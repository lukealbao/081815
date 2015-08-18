var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. Status code 200 on success
function modifyServer (opts, nextTest, cookies) {
  opts.path = '/server/100';
  opts.method = 'PUT';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var req = http.request(opts, function (res) {
              assert.equal(res.statusCode, 200,
                           err('Unexpected status code when modifying server.'));
              console.info(pass('User can modify a single server.'));
              nextTest();
            });
  req.write(JSON.stringify({hostname: 'new.internal'}));
  req.end();
}

module.exports = modifyServer;
