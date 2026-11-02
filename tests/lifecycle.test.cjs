'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { stopChild, shutdownServices } = require('../src/desktop/process_lifecycle.cjs');

async function readyChild(code) {
  const child = spawn(process.execPath, ['-e', code], { stdio: ['ignore', 'pipe', 'inherit'] });
  await once(child.stdout, 'data');
  return child;
}

test('waits for a real child to finish graceful cleanup', { timeout: 5000 }, async t => {
  const child = await readyChild("process.on('SIGTERM',()=>setTimeout(()=>process.exit(0),100));process.stdout.write('ready');setInterval(()=>{},1000)");
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); });
  const start = Date.now();
  await stopChild(child, 2000);
  assert.equal(child.exitCode, 0);
  assert.ok(Date.now() - start >= 75);
});

test('kills a child that ignores SIGTERM after the grace period', { timeout: 5000 }, async t => {
  const child = await readyChild("process.on('SIGTERM',()=>{});process.stdout.write('ready');setInterval(()=>{},1000)");
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); });
  await stopChild(child, 100);
  assert.equal(child.signalCode, 'SIGKILL');
});

test('waits for sync close and stops the final backend even on sync failure', async () => {
  const order = [];
  const sync = { async close() { order.push('close'); await new Promise(resolve => setImmediate(resolve)); order.push('import-finished'); throw new Error('sync-close'); } };
  await assert.rejects(shutdownServices(sync, async () => order.push('stop-final-backend')), /sync-close/);
  assert.deepEqual(order, ['close', 'import-finished', 'stop-final-backend']);
});
