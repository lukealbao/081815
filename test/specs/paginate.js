var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 200 status code on success
// 2. `prev` and `next` rel links in `Link` header
// 3. Default page length is 10
function paginate (opts, nextTest, cookies) {
  opts.path = '/servers?paginate&page=3';
  opts.method = 'GET';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var req = http.request(opts, function (res) {
              res.setEncoding('utf8');
              assert.equal(res.statusCode, 200,
                          err('Unexpected status code when paginating'));

              var body = '';
              res.on('readable', function () {
                body += res.read();
              });

              var links = res.headers.link.split(',');
              var prev = links[0];
              var next = links[1];

              assert(prev.match('page=2'), err('Invalid prev link'));
              assert(next.match('page=4'), err('Invalid next link'));

              res.on('end', function () {
                var results = JSON.parse(body).configurations;
                assert.equal(results.length, 10,
                             err('Unexpected pagination length.'));
                console.info(pass('Results can be paginated.'));
                nextTest();
              });
            });
  req.end();
}

module.exports = paginate;
