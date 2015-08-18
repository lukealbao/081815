var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 200 status code on success
// 2. Response is an Objecta
// 3. response.configurations is an Array
function getConfigs (opts, nextTest, cookies) {
  opts.path = '/servers';
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
                var response = JSON.parse(body);
                assert(response instanceof Object,
                       err('Servers body was wrong.'));
                assert(response.configurations instanceof Array,
                       err('Servers `configuration` was not an array.'));
                console.info(pass('User can get configurations array.'));
                nextTest();
              });
            });
  req.end();
}


module.exports = getConfigs;
