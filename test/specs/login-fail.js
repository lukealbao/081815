var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;

// Tests:
// 1. Status code 401 when not authenticated
function loginFail (opts, nextTest, cookies) {
  var invalidReq = http.request(opts, function (res) {
                     assert.equal(res.statusCode, 401,
                                  err('Bad Status Code when given bad creds.'));
                     nextTest();
                   });
  invalidReq.write(JSON.stringify({username: 'notfound', password: ''}));
  invalidReq.end();
}

module.exports = loginFail;
