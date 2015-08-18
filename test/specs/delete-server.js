var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 200 status code on success
function deleteServer (opts, nextTest, cookies) {
  opts.path = '/server/100';
  opts.method = 'DELETE';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var req = http.request(opts, function (res) {
              res.setEncoding('utf8');
              var body = '';
              res.on('readable', function () {
                body += res.read();
              });

              res.on('end', function () {
                assert.equal(res.statusCode, 200,
                             err('Unexpected status code when deleting server.'));
                console.info(pass('User can delete a single server.'));
                nextTest();
              });
            });
  req.end();
}

module.exports = deleteServer;
