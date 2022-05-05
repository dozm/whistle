var os = require('os');
var net = require('net');
var mac = require('./mac');
var win = require('./win');

var platform = os.platform();
var BYPASS_RE = /^[*a-z\d_-]+(?:\.[*a-z\d_-]+)*$/i;

function getBypass(bypass) {
  if (!bypass || typeof bypass !== 'string') {
    return;
  }
  var map = {};
  bypass = bypass.trim().toLowerCase();
  return bypass.split(/[\s,;]+/).filter((host) => {
    if (!map[host] && (host === '<local>' || net.isIP(host) || BYPASS_RE.test(host))) {
      map[host] = 1;
      return true;
    }
    return false;
  });
}

// only support mac & win
function getProxyMgr() {
  if (platform === 'win32') {
    return win;
  }
  return mac;
}

exports.enableProxy = function(options) {
  var host = options.host.toLowerCase();
  var enableProxy = getProxyMgr().enableProxy;
  var bypass = getBypass(options.bypass);
  enableProxy({
    host,
    port: options.port,
    bypass
  });
};

exports.disableProxy = function() {
  var disableProxy = getProxyMgr().disableProxy;
  disableProxy();
};
