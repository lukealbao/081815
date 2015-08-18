var http = require('http');
var qs = require('querystring');
var assert = require('assert');
var util = require('util');
var Framework = require('../lib/app');
var app = new Framework();
var spawn = require('child_process').spawn;
var err = require('./assertions').err;
var pass = require('./assertions').pass;

console.log('\n\033[1;36m  Framework Tests');
console.log('--------------------\033[0;37m');

// `use` method: add middleware
assert.equal(app.middleware.length, 0,
             err('Oops, middleware is already there.'));
app.use('extendObjects');
assert.equal(app.middleware.length, 1,
             err('Middleware count is off.'));
assert.equal(typeof app.middleware[0], 'function',
             err('Added middleware, but it\'s not a function'));
console.log(pass('User can add middleware handlers to all routes.'));


// HTTP method handler additions
assert.equal(app.routes['/test'], undefined);
app.post('/test', function (req, res, next) {next()});
assert.equal(app.routes['/test'].GET, undefined);
assert.equal(typeof app.routes['/test'].POST, 'function',
             err('Handler was not properly added.'));
assert(app.routes['/test'].regex instanceof RegExp,
       err('The regex was not properly added.'));
console.log(pass('User can add a single route handler.'));



console.log('\n\n\033[1;36m  Application Tests');
console.log('----------------------\033[0;37m');
var server = require('../index');

// Hide all server logging when testing
console.info = console.log;
console.log = function () {};

server.server.on('listening', function () {
  var COOKIES = {}
  var opts = {
    host: 'localhost',
    port: 9999,
    path: '/login',
    method: 'POST',
    headers: {'content-type': 'application/json'}
  };
  var t = require('./specs');

  // Async management;
  var tests = [t.loginFail, t.loginPass, t.getConfigs, t.getServer, t.createServer,
               t.modifyServer, t.deleteServer, t.sort, t.paginate, t.logout,
               function () {server.server.close()}];
  var n = 0;
  function nextTest() {
    if (n < tests.length) tests[n++](opts, nextTest, COOKIES);
  }

  nextTest(opts, nextTest, COOKIES);
});
