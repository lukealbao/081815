var http = require('http');
var assert = require('assert');
var err = require('../assertions').err;
var pass = require('../assertions').pass;
var qs = require('querystring');

// Tests:
// 1. 200 status code on success
// 2. Response sets a `sessionId` cookie
function loginPass (opts, nextTest, cookies) {
  var creds = {username: 'lukealbao', password: 'tenable'};
  var validReq = http.request(opts, function (res) {
                   assert.equal(res.statusCode, 200,
                                err('Bad Status Code when given good creds.'));
                   assert(res.headers['set-cookie'] !== undefined
                        && typeof qs.parse(res.headers
                                           ['set-cookie'][0])
                                  .sessionId === 'string',
                          err('Session cookie not present.'));
                   cookies.sessionId = qs.parse(res.headers['set-cookie'][0]);
                   nextTest();
                 });
  validReq.write(JSON.stringify(creds));
  validReq.end(function () {
    console.info(pass('User can log in.'));
  });
}

module.exports = loginPass;
