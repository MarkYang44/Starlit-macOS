'use strict';

function stopChild(child, graceMs = 10000) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => child.kill('SIGKILL'), graceMs);
    const cleanup = () => {
      clearTimeout(timer);
      child.removeListener('exit', exited);
      child.removeListener('error', failed);
    };
    function exited() { cleanup(); resolve(); }
    function failed(error) { cleanup(); reject(error); }
    child.once('exit', exited);
    child.once('error', failed);
    child.kill('SIGTERM');
  });
}

async function shutdownServices(syncService, stopBackend) {
  try {
    if (syncService) await syncService.close();
  } finally {
    await stopBackend();
  }
}

module.exports = { stopChild, shutdownServices };
