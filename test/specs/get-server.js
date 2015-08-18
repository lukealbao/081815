var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

function getServer (opts, nextTest, cookies) {
  opts.path = '/server/100';
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
                assert(typeof JSON.parse(body) === 'object',
                       err('Single server body was wrong.'));
                console.info(pass('User can get a single configuration object.'));
                nextTest();
              });
            });
  req.end();
}

module.exports = getServer;
