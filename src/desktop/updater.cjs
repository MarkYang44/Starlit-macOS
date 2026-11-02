'use strict';

const https = require('node:https');
const { createHash } = require('node:crypto');
const { mkdirSync, statSync, renameSync } = require('node:fs');
const { open } = require('node:fs/promises');
const { join } = require('node:path');

function validateRelease(release) {
  if (!release || typeof release !== 'object') throw new Error('更新信息无效');
  const url = new URL(String(release.url || ''));
  if (url.protocol !== 'https:' || !url.hostname || !url.pathname.toLowerCase().endsWith('.exe')) {
    throw new Error('安装包地址无效');
  }
  if (!Number.isSafeInteger(release.size) || release.size < 1024 || release.size > 2_000_000_000) {
    throw new Error('安装包大小无效');
  }
  if (!/^[a-f0-9]{64}$/.test(release.sha256 || '')) throw new Error('安装包校验值无效');
  return { url: url.href, size: release.size, sha256: release.sha256 };
}

function downloadToFile(url, destination, offset, expectedSize, onProgress, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 3) { reject(new Error('下载地址跳转次数过多')); return; }
    const headers = { 'User-Agent': 'Starlit-Windows-Updater/1', 'Accept-Encoding': 'identity' };
    if (offset) headers.Range = `bytes=${offset}-`;
    const request = https.get(url, { headers }, response => {
      const status = response.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status)) {
        response.resume();
        let target;
        try { target = new URL(response.headers.location, url); } catch { reject(new Error('下载跳转地址无效')); return; }
        if (target.protocol !== 'https:') { reject(new Error('拒绝不安全的下载跳转')); return; }
        downloadToFile(target.href, destination, offset, expectedSize, onProgress, redirects + 1)
          .then(resolve, reject);
        return;
      }
      if (![200, 206].includes(status)) {
        response.resume(); reject(new Error(`下载失败（HTTP ${status}）`)); return;
      }
      const resumed = offset > 0 && status === 206;
      if (resumed && !(response.headers['content-range'] || '').startsWith(`bytes ${offset}-`)) {
        response.resume(); reject(new Error('服务器断点响应无效，请重试')); return;
      }
      const start = resumed ? offset : 0;
      let received = start;
      let file;
      (async () => {
        file = await open(destination, resumed ? 'r+' : 'w');
        for await (const chunk of response) {
          received += chunk.length;
          if (received > expectedSize) throw new Error('安装包超过声明大小，已停止下载');
          let written = 0;
          const position = received - chunk.length;
          while (written < chunk.length) {
            const result = await file.write(chunk, written, chunk.length - written, position + written);
            if (!result.bytesWritten) throw new Error('安装包写入失败，请检查磁盘空间');
            written += result.bytesWritten;
          }
          onProgress(received, expectedSize);
        }
        if (received !== expectedSize) throw new Error('下载未完成，下次会从断点继续');
      })().then(resolve, reject).finally(async () => { if (file) await file.close().catch(() => {}); });
    });
    request.setTimeout(30000, () => request.destroy(new Error('下载连接超时，请重试')));
    request.on('error', reject);
  });
}

async function verifyFile(path, expected) {
  const actualSize = statSync(path).size;
  if (actualSize !== expected.size) throw new Error('安装包大小校验失败，请重新下载');
  const file = await open(path, 'r');
  const hash = createHash('sha256');
  try {
    const stream = file.createReadStream();
    for await (const chunk of stream) hash.update(chunk);
  } finally { await file.close(); }
  if (hash.digest('hex') !== expected.sha256) throw new Error('SHA-256 校验失败，安装包可能已损坏');
}

class WindowsUpdater {
  constructor(directory, emit) {
    this.directory = directory;
    this.part = join(directory, 'Starlit-update.exe.part');
    this.target = join(directory, 'Starlit-update.exe');
    this.emit = emit;
    this.busy = false;
    this.ready = false;
    this.expected = null;
  }
  send(phase, progress = 0, message = '') {
    this.emit({ phase, progress, message });
  }
  async download(release) {
    if (this.busy) throw new Error('已有更新正在下载');
    const expected = validateRelease(release);
    this.busy = true; this.ready = false; this.expected = expected;
    mkdirSync(this.directory, { recursive: true });
    let offset = 0;
    try { offset = statSync(this.part).size; } catch {}
    if (offset > expected.size) offset = 0;
    try {
      this.send('downloading', Math.floor(offset / expected.size * 100));
      await downloadToFile(expected.url, this.part, offset, expected.size, (received, total) => {
        this.send('downloading', Math.min(99, Math.floor(received / total * 100)));
      });
      await verifyFile(this.part, expected);
      renameSync(this.part, this.target);
      this.ready = true;
      this.send('ready', 100);
      return { ok: true };
    } catch (error) {
      this.send('error', 0, error.message || String(error));
      throw error;
    } finally { this.busy = false; }
  }
  verifiedInstaller() {
    if (!this.ready || this.busy) throw new Error('安装包尚未准备完成');
    return this.target;
  }
}

module.exports = { WindowsUpdater, validateRelease, verifyFile, downloadToFile };
