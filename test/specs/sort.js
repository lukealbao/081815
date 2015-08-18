var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. Sorts ascending by username
function sort (opts, nextTest, cookies) {
  opts.path = '/servers?sort=username';
  opts.method = 'GET';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var req = http.request(opts, function (res) {
              res.setEncoding('utf8');
              assert.equal(res.statusCode, 200);
              var body = '';
              res.on('readable', function () {
                body += res.read();
              });

              res.on('end', function () {
                var results = JSON.parse(body).configurations;
                assert(results[0].username < results[1].username,
                       err('Did not sort by username.'));
                console.info(pass('Configuration results can be sorted.'));
                nextTest();
              });
            });
  req.end();
}

module.exports = sort;
