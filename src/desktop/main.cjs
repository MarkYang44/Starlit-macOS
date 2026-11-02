const { app, BrowserWindow, ipcMain, dialog, Menu, nativeImage } = require('electron');
const { spawn, spawnSync } = require('node:child_process');

function showAppError(title, message) {
  const options = {
    type: 'error',
    title: '星伴',
    message: title,
    detail: String(message),
    buttons: ['确定'],
    defaultId: 0,
    noLink: true,
    icon: nativeImage.createFromPath(join(__dirname, 'assets', 'icon.png')),
  };
  return mainWindow && !mainWindow.isDestroyed()
    ? dialog.showMessageBoxSync(mainWindow, options)
    : dialog.showMessageBoxSync(options);
}
const {
  copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync,
  appendFileSync, createWriteStream,
} = require('node:fs');
const { unlink } = require('node:fs/promises');
const { networkInterfaces, hostname } = require('node:os');
const { join, basename } = require('node:path');
const { randomBytes } = require('node:crypto');
const { pipeline } = require('node:stream/promises');
const http = require('node:http');
const { LanSyncService } = require('./lan_sync.cjs');
const { WindowsUpdater } = require('./updater.cjs');
const { stopChild, shutdownServices } = require('./process_lifecycle.cjs');

const PORT = 18765;
const SYNC_PORT = 18766;
const macDataRoot = process.env.STARLIT_DATA_ROOT || join(app.getPath('appData'), 'starlit-macos');
if (process.platform === 'darwin') {
  mkdirSync(join(macDataRoot, 'desktop-profile'), { recursive: true });
  app.setPath('userData', join(macDataRoot, 'desktop-profile'));
}
let backend = null;
let mainWindow = null;
let quitting = false;
let expectedBackendStop = false;
let dataRoot = '';
let accessToken = '';
let syncService = null;
let syncError = '';
let shutdownStarted = false;
let shutdownFinished = false;

function log(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try { appendFileSync(join(dataRoot, 'data', 'desktop.log'), line); } catch {}
}

function prepareData() {
  // 产品显示名改为“星伴”，数据目录保持旧标识，升级不会丢失聊天。
  dataRoot = process.platform === 'darwin' ? macDataRoot :
    process.env.STARLIT_DATA_ROOT || join(app.getPath('appData'), 'starlit-desktop');
  mkdirSync(join(dataRoot, 'data'), { recursive: true });
  const template = join(process.resourcesPath, 'template');
  if (!existsSync(join(dataRoot, 'persona'))) {
    cpSync(join(template, 'persona'), join(dataRoot, 'persona'), { recursive: true });
  }
  const config = join(dataRoot, 'config.yaml');
  if (!existsSync(config)) {
    const seedData = join(template, 'data');
    if (existsSync(seedData)) cpSync(seedData, join(dataRoot, 'data'), { recursive: true, force: false });
    copyFileSync(join(template, 'config.yaml'), config);
    accessToken = randomBytes(24).toString('base64url');
    const original = readFileSync(config, 'utf8');
    const updated = original.replace(/^(\s*token:\s*)["']{2}\s*$/m, `$1"${accessToken}"`);
    if (updated === original) throw new Error('无法初始化本地访问令牌，请重新安装星伴。');
    writeFileSync(config, updated, 'utf8');
  } else {
    const match = readFileSync(config, 'utf8').match(/^\s*token:\s*["']?([^"'\r\n]*)["']?\s*$/m);
    accessToken = match ? match[1].trim() : '';
  }
  if (!accessToken) {
    accessToken = randomBytes(24).toString('base64url');
    const original = readFileSync(config, 'utf8');
    const updated = original.replace(/^(\s*token:\s*)["']{2}\s*$/m, `$1"${accessToken}"`);
    if (updated === original) throw new Error('无法修复空的本地访问令牌，请检查 config.yaml。');
    writeFileSync(config, updated, 'utf8');
  }
}

function backendExecutable() {
  const executable = join(process.resourcesPath, 'backend',
    process.platform === 'win32' ? 'StarlitBackend.exe' : 'StarlitBackend');
  if (!existsSync(executable)) throw new Error('找不到内置后端，请重新安装星伴。');
  return executable;
}

function startBackend() {
  const child = spawn(backendExecutable(), [], {
    cwd: dataRoot,
    windowsHide: true,
    env: {
      ...process.env,
      STARLIT_DATA_ROOT: dataRoot,
      STARLIT_RESOURCE_ROOT: process.resourcesPath,
      PYTHONUNBUFFERED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  backend = child;
  child.on('error', error => {
    log(`backend launch failed: ${error.message}`);
    if (backend === child) backend = null;
  });
  child.stdout.on('data', chunk => log(`backend: ${String(chunk).trim()}`));
  child.stderr.on('data', chunk => log(`backend: ${String(chunk).trim()}`));
  child.on('exit', code => {
    log(`backend exited: ${code}`);
    if (backend === child) backend = null;
    if (!quitting && !expectedBackendStop) {
      showAppError('星伴已断开', '本地服务意外退出。聊天数据仍保存在你的用户目录中，请重新启动应用。');
      if (!mainWindow) app.quit();
    }
  });
}

function health() {
  return new Promise(resolve => {
    const req = http.get({ hostname: '127.0.0.1', port: PORT, path: '/api/identity',
      headers: { Authorization: `Bearer ${accessToken}` }, timeout: 1200 }, res => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

async function waitBackend() {
  for (let i = 0; i < 120; i++) {
    if (await health()) return;
    if (!backend) throw new Error('本地服务未能启动，请检查 data/companion.log。');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new Error('本地服务启动超时，请检查端口 18765 是否被占用。');
}

function localAddresses() {
  const result = [];
  for (const entries of Object.values(networkInterfaces())) {
    for (const item of entries || []) {
      if (item.family === 'IPv4' && !item.internal) result.push(item.address);
    }
  }
  return [...new Set(result)];
}

function deviceId() {
  const path = join(dataRoot, 'data', 'lan-device.json');
  try {
    const value = JSON.parse(readFileSync(path, 'utf8'));
    if (/^[a-f0-9]{32}$/.test(value.device_id || '')) return value.device_id;
  } catch {}
  const value = { format_version: 1, device_id: randomBytes(16).toString('hex') };
  writeFileSync(path, JSON.stringify(value), 'utf8');
  return value.device_id;
}

function proxyLocalBackup(_req, res) {
  return new Promise((resolve, reject) => {
    const upstream = http.get({
      hostname: '127.0.0.1', port: PORT, path: '/api/backup',
      headers: { Authorization: `Bearer ${accessToken}` },
    }, response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error('电脑端备份生成失败'));
        return;
      }
      const headers = {
        'Content-Type': 'application/zip',
        'Cache-Control': 'no-store',
        'Content-Disposition': 'attachment; filename="starlit-lan-backup.zip"',
      };
      if (response.headers['content-length']) headers['Content-Length'] = response.headers['content-length'];
      res.writeHead(200, headers);
      response.on('error', reject);
      response.pipe(res);
      res.on('finish', resolve);
      res.on('close', resolve);
    });
    upstream.on('error', reject);
  });
}

function downloadLocalBackup(destination) {
  return new Promise((resolve, reject) => {
    const request = http.get({
      hostname: '127.0.0.1', port: PORT, path: '/api/backup',
      headers: { Authorization: `Bearer ${accessToken}` },
    }, async response => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error('接收前自动备份失败'));
        return;
      }
      try {
        await pipeline(response, createWriteStream(destination, { flags: 'wx' }));
        resolve();
      } catch (error) {
        await unlink(destination).catch(() => {});
        reject(error);
      }
    });
    request.on('error', reject);
  });
}

function runBackendTask(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(backendExecutable(), args, {
      cwd: dataRoot,
      windowsHide: true,
      env: { ...process.env, STARLIT_DATA_ROOT: dataRoot, PYTHONUNBUFFERED: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let details = '';
    child.stdout.on('data', chunk => { details += String(chunk); });
    child.stderr.on('data', chunk => { details += String(chunk); });
    child.on('error', reject);
    child.on('exit', code => {
      const clean = details.trim();
      if (clean) log(`sync task: ${clean}`);
      if (code === 0) resolve();
      else reject(new Error(clean.split(/\r?\n/).filter(Boolean).slice(-2).join('；') || '同步备份处理失败'));
    });
  });
}

async function importReceivedBackup(incoming) {
  await runBackendTask(['--validate', incoming, '--root', dataRoot]);
  const backupDir = join(dataRoot, 'backups', 'lan-sync');
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z');
  const safety = join(backupDir, `before-receive-${stamp}-${randomBytes(4).toString('hex')}.zip`);
  await downloadLocalBackup(safety);

  expectedBackendStop = true;
  await stopBackend();
  let restoreError = null;
  try {
    await runBackendTask([
      '--restore', incoming, '--root', dataRoot,
      '--pid-file', join(dataRoot, 'run', 'companion.pid'),
    ]);
  } catch (error) {
    restoreError = error;
  }
  try {
    if (!quitting) {
      startBackend();
      await waitBackend();
    }
  } finally {
    expectedBackendStop = false;
  }
  if (restoreError) throw restoreError;
  if (mainWindow) mainWindow.reload();
  return { message: '接收完成，电脑端已重新启动', safety_backup: basename(safety) };
}

function openPairing() {
  const win = new BrowserWindow({
    width: 560, height: 700, resizable: false,
    parent: mainWindow, title: '手机连接与同步 - 星伴',
    autoHideMenuBar: true, backgroundColor: '#f7f8fc', icon: join(__dirname, 'assets', 'icon.png'),
    webPreferences: { preload: join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  win.loadFile(join(__dirname, 'pairing.html'));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380, height: 880, minWidth: 1000, minHeight: 680,
    show: false, title: '星伴', autoHideMenuBar: true,
    frame: process.platform === 'darwin', backgroundColor: '#f5f6fa', icon: join(__dirname, 'assets', 'icon.png'),
    webPreferences: { preload: join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(`http://127.0.0.1:${PORT}/`)) event.preventDefault();
  });
  const suffix = accessToken ? `?access_token=${encodeURIComponent(accessToken)}` : '';
  mainWindow.loadURL(`http://127.0.0.1:${PORT}/${suffix}`);
  const sendWindowState = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-state', { maximized: mainWindow.isMaximized() });
    }
  };
  mainWindow.on('maximize', sendWindowState);
  mainWindow.on('unmaximize', sendWindowState);
  mainWindow.on('closed', () => { mainWindow = null; });
}

function controlledWindow(event) {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win && win === mainWindow && !win.isDestroyed() ? win : null;
}

ipcMain.handle('window-control', (event, action) => {
  const win = controlledWindow(event);
  if (!win) return false;
  if (action === 'minimize') win.minimize();
  else if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (action === 'close') win.close();
  else return false;
  return true;
});

ipcMain.handle('window-state', event => {
  const win = controlledWindow(event);
  return { maximized: !!(win && win.isMaximized()) };
});

async function stopBackend() {
  if (!backend) return;
  expectedBackendStop = true;
  const child = backend;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true });
  } else await stopChild(child);
  if (backend === child) backend = null;
}

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();
else {
  app.setName('星伴');
  app.on('second-instance', () => {
    if (mainWindow) { if (mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); }
  });
  const updater = new WindowsUpdater(join(app.getPath('temp'), 'starlit-updater'), state => {
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('update-state', state);
  });
  ipcMain.handle('update-download', (event, release) => {
    if (process.platform !== 'win32') throw new Error('此 Mac 移植版请手动安装新版');
    if (!controlledWindow(event)) throw new Error('无效更新请求');
    return updater.download(release);
  });
  ipcMain.handle('update-install', async event => {
    if (process.platform !== 'win32') throw new Error('此 Mac 移植版请手动安装新版');
    if (!controlledWindow(event)) throw new Error('无效安装请求');
    const installer = updater.verifiedInstaller();
    const backupDir = join(dataRoot, 'backups', 'updates');
    mkdirSync(backupDir, { recursive: true });
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z');
    const safety = join(backupDir, `before-update-${stamp}.zip`);
    await downloadLocalBackup(safety);
    const child = spawn(installer, [], { detached: true, stdio: 'ignore', windowsHide: false });
    child.unref();
    quitting = true;
    app.quit();
  });
  app.whenReady().then(async () => {
    prepareData();
    const menu = Menu.buildFromTemplate([
      { label: '星伴', submenu: [
        ...(process.platform === 'darwin' ? [{ role: 'about', label: '关于星伴' },
          { type: 'separator' }] : []),
        { label: '手机连接与同步', click: openPairing },
        { label: '重新加载', accelerator: 'CmdOrCtrl+R', click: () => mainWindow && mainWindow.reload() },
        { type: 'separator' }, { role: 'quit', label: '退出' },
      ]},
      ...(process.platform === 'darwin' ? [{ role: 'editMenu', label: '编辑' },
        { role: 'windowMenu', label: '窗口' }] : []),
    ]);
    Menu.setApplicationMenu(menu);
    try {
      startBackend();
      await waitBackend();
      syncService = new LanSyncService({
        token: accessToken,
        deviceId: deviceId(),
        deviceName: hostname() || '我的电脑',
        port: SYNC_PORT,
        workDir: join(dataRoot, 'data', 'sync-temp'),
        exportBackup: proxyLocalBackup,
        importBackup: importReceivedBackup,
        log,
      });
      try { await syncService.start(); } catch (error) {
        syncError = error.message;
        log(`LAN sync unavailable: ${error.message}`);
      }
      createWindow();
    } catch (error) {
      log(String(error.stack || error));
      showAppError('星伴启动失败', error.message);
      app.quit();
    }
  });
  app.on('before-quit', event => {
    if (shutdownFinished) return;
    event.preventDefault();
    if (shutdownStarted) return;
    shutdownStarted = true;
    quitting = true;
    shutdownServices(syncService, stopBackend)
      .catch(error => log(`shutdown: ${error.message}`))
      .finally(() => { shutdownFinished = true; app.quit(); });
  });
  app.on('activate', () => {
    if (backend && !mainWindow && !quitting) createWindow();
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

ipcMain.handle('pairing-info', () => ({
  port: SYNC_PORT,
  token: accessToken,
  addresses: localAddresses(),
  syncAvailable: !!(syncService && syncService.server && !syncError),
  syncError,
  requirement: '电脑需保持星伴运行，手机与电脑连接同一 Wi-Fi。首次配对后手机会记住电脑和令牌。',
}));
