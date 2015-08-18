var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 200 status code on success
// 2. `sessionId` cookie is removed on success
function logout (opts, nextTest, cookies) {
  opts.path = '/logout';
  opts.method = 'GET';
  opts.headers.cookie = qs.stringify(cookies.sessionId);
  var logoutReq = http.request(opts, function (res) {
                    assert.equal(res.statusCode, 200,
                                 err('Bad Status Code when logging out.'));
                    assert(!res.headers['cookie'],
                           err('Session cookie was not removed.' + JSON.stringify(res.headers)));
                    nextTest();
                  });
  logoutReq.write('');
  logoutReq.end(function () {
    console.info(pass('User can log out.'));
  });
}

module.exports = logout;
