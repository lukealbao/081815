var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 201 status code on success
function createServer (opts, nextTest, cookies) {
  opts.path = '/servers';
  opts.method = 'POST';
  opts.headers['content-type'] = 'application/json';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var req = http.request(opts, function (res) {
              assert.equal(res.statusCode, 201,
                           err('Unexpected status code when creating server.'));
              console.info(pass('User can create a server.'));
              nextTest();
            });
  req.write(JSON.stringify({name: 'test', port: 9999,
                            username: 'luke', hostname: 'test.internal'}));
  req.end();
}

module.exports = createServer;
