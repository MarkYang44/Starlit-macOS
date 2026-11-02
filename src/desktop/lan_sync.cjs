'use strict';

const dgram = require('node:dgram');
const http = require('node:http');
const { createWriteStream } = require('node:fs');
const { mkdir, unlink } = require('node:fs/promises');
const { join } = require('node:path');
const { randomBytes, timingSafeEqual } = require('node:crypto');
const { pipeline } = require('node:stream/promises');

const MAGIC = 'starlit-lan-sync';
const PROTOCOL_VERSION = 1;
const DEFAULT_PORT = 18766;
const DEFAULT_DISCOVERY_PORT = 18767;
const MAX_BACKUP_BYTES = 8 * 1024 * 1024 * 1024;

function tokenMatches(actual, expected) {
  const a = Buffer.from(String(actual || ''));
  const b = Buffer.from(String(expected || ''));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

function requestToken(req) {
  const header = String(req.headers.authorization || '');
  return header.startsWith('Bearer ') ? header.slice(7) : '';
}

function sendJson(res, status, value) {
  if (res.headersSent || res.destroyed) return;
  const body = Buffer.from(JSON.stringify(value));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function parseDiscovery(packet) {
  if (!Buffer.isBuffer(packet) || packet.length === 0 || packet.length > 2048) return null;
  let value;
  try { value = JSON.parse(packet.toString('utf8')); } catch { return null; }
  if (!value || value.magic !== MAGIC || value.version !== PROTOCOL_VERSION ||
      value.action !== 'discover') return null;
  return value;
}

class LanSyncService {
  constructor(options) {
    this.token = options.token;
    this.deviceId = options.deviceId;
    this.deviceName = options.deviceName;
    this.port = options.port || DEFAULT_PORT;
    this.discoveryPort = options.discoveryPort || DEFAULT_DISCOVERY_PORT;
    this.workDir = options.workDir;
    this.exportBackup = options.exportBackup;
    this.importBackup = options.importBackup;
    this.log = options.log || (() => {});
    this.server = null;
    this.socket = null;
    this.importing = false;
  }

  async start() {
    if (!this.token) throw new Error('局域网同步需要访问令牌');
    await mkdir(this.workDir, { recursive: true });
    await new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        this.handle(req, res).catch(error => {
          this.log(`sync request failed: ${error.message}`);
          sendJson(res, 500, { ok: false, error: error.message });
        });
      });
      this.server.once('error', reject);
      this.server.listen(this.port, '0.0.0.0', () => {
        this.server.removeListener('error', reject);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      this.socket = dgram.createSocket({ type: 'udp4', reuseAddr: true });
      this.socket.once('error', reject);
      this.socket.on('message', (packet, remote) => this.onDiscovery(packet, remote));
      this.socket.bind(this.discoveryPort, '0.0.0.0', () => {
        this.socket.removeListener('error', reject);
        try { this.socket.setBroadcast(true); } catch {}
        resolve();
      });
    });
    this.log(`LAN sync listening on ${this.port}; discovery on ${this.discoveryPort}`);
  }

  onDiscovery(packet, remote) {
    if (!parseDiscovery(packet) || !this.socket) return;
    // 只公开发现所需的最小信息；访问令牌永远不会进入广播或响应。
    const response = Buffer.from(JSON.stringify({
      magic: MAGIC,
      version: PROTOCOL_VERSION,
      action: 'announce',
      device_id: this.deviceId,
      device_name: this.deviceName,
      product: '星伴',
      platform: process.platform === 'darwin' ? 'macos' : 'windows',
      port: this.port,
    }));
    this.socket.send(response, remote.port, remote.address, error => {
      if (error) this.log(`discovery response failed: ${error.message}`);
    });
  }

  authorized(req) {
    return tokenMatches(requestToken(req), this.token);
  }

  async handle(req, res) {
    const pathname = new URL(req.url, 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/healthz') {
      sendJson(res, 200, { ok: true, product: '星伴', version: PROTOCOL_VERSION });
      return;
    }
    if (!this.authorized(req)) {
      sendJson(res, 403, { ok: false, error: '访问令牌不正确' });
      return;
    }
    if (req.method === 'GET' && pathname === '/v1/backup') {
      await this.exportBackup(req, res);
      return;
    }
    if (req.method === 'POST' && pathname === '/v1/restore') {
      await this.receiveBackup(req, res);
      return;
    }
    sendJson(res, 404, { ok: false, error: '未知同步接口' });
  }

  async receiveBackup(req, res) {
    if (this.importing) {
      sendJson(res, 409, { ok: false, error: '另一项同步正在进行，请稍后再试' });
      return;
    }
    const declared = Number(req.headers['content-length'] || 0);
    if (declared > MAX_BACKUP_BYTES) {
      sendJson(res, 413, { ok: false, error: '备份超过 8 GiB 限制' });
      return;
    }
    this.importing = true;
    const temporary = join(this.workDir, `incoming-${randomBytes(12).toString('hex')}.zip`);
    let bytes = 0;
    const counter = require('node:stream').Transform({
      transform: (chunk, _encoding, callback) => {
        bytes += chunk.length;
        if (bytes > MAX_BACKUP_BYTES) callback(new Error('备份超过 8 GiB 限制'));
        else callback(null, chunk);
      },
    });
    try {
      await pipeline(req, counter, createWriteStream(temporary, { flags: 'wx' }));
      if (bytes === 0) throw new Error('收到空备份');
      const result = await this.importBackup(temporary);
      sendJson(res, 200, { ok: true, ...(result || {}) });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    } finally {
      this.importing = false;
      unlink(temporary).catch(() => {});
    }
  }

  async close() {
    const server = this.server;
    const socket = this.socket;
    this.server = null;
    this.socket = null;
    if (socket) await new Promise(resolve => { try { socket.close(resolve); } catch { resolve(); } });
    if (server) await new Promise(resolve => server.close(resolve));
  }
}

module.exports = {
  LanSyncService,
  MAGIC,
  PROTOCOL_VERSION,
  DEFAULT_PORT,
  DEFAULT_DISCOVERY_PORT,
  parseDiscovery,
  tokenMatches,
};
