var qs = require('querystring');
var url = require('url');
var http = require('http');
var https = require('https');
var util = require('util');
var middleware = require('./middleware');
var slice = Array.prototype.slice;

function Application (opts) {
  var self = this;
  opts = opts || {};
  var protocol = opts.secure
           ? https
           : http;
  self.server = protocol.createServer();

  if (!(self instanceof Application))
      return new Application(opts);

  self.middleware = [];
  self.routes = {};

  self.server.on('request', requestHandler.bind(self));
}

Application.prototype.use = function (fn) {
  if (typeof fn === 'string') {
    fn = middleware[fn];
  }
  this.middleware.push(fn);
}

Application.prototype.listen = function (port, cb) {
  var self = this;
  process.nextTick(function () {
    self.server.listen(port, cb.bind(self.server));
  });
}

Application.prototype.get = function (patternString, fn) {
  var elems = patternString.split('/');
  var _re = /:\w+/;
  var params = {};
  var pattern;
  
  // Extract pattern variables for params
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].match(_re)) {
      params[i - 1] = elems[i].replace(':', ''); // elems has '' at index 0;
      elems[i] = '(\\w+)';
    }
  }

  // Coerce pattern to RegExp
  pattern = new RegExp(elems.join('\\/'));

  if (!this.routes[patternString]) this.routes[patternString] = {regex: pattern};
  
  this.routes[patternString].GET = function (req, res, next) {
    // Attach pattern variables to req.params
    var args = req.pathname.match(pattern);
    for (var i = 1; i < args.length; i++) {
      console.log('matching params', params);
      var param = params[i];
      req.params[param] = args[i];
    }
    
    return fn(req, res, next);
  }
};

Application.prototype.post = function (patternString, fn) {
  var elems = patternString.split('/');
  var _re = /:\w+/;
  var params = {};
  var pattern;
  
  // Extract pattern variables for params
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].match(_re)) {
      params[i - 1] = elems[i].replace(':', ''); // elems has '' at index 0;
      elems[i] = '(\\w+)';
    }
  }

  // Coerce pattern to RegExp
  pattern = new RegExp(elems.join('\\/'));

  if (!this.routes[patternString]) this.routes[patternString] = {regex: pattern};
  
  this.routes[patternString].POST = function (req, res, next) {
    // Attach pattern variables to req.params
    var args = req.pathname.match(pattern);
    for (var i = 1; i < args.length; i++) {
      console.log('matching params', params);
      var param = params[i];
      req.params[param] = args[i];
    }
    
    return fn(req, res, next);
  }
};

Application.prototype.put = function (patternString, fn) {
  var elems = patternString.split('/');
  var _re = /:\w+/;
  var params = {};
  var pattern;
  
  // Extract pattern variables for params
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].match(_re)) {
      params[i - 1] = elems[i].replace(':', ''); // elems has '' at index 0;
      elems[i] = '(\\w+)';
    }
  }

  // Coerce pattern to RegExp
  pattern = new RegExp(elems.join('\\/'));

  if (!this.routes[patternString]) this.routes[patternString] = {regex: pattern};
  
  this.routes[patternString].PUT = function (req, res, next) {
    // Attach pattern variables to req.params
    var args = req.pathname.match(pattern);
    for (var i = 1; i < args.length; i++) {
      console.log('matching params', params);
      var param = params[i];
      req.params[param] = args[i];
    }
    
    return fn(req, res, next);
  }
};

Application.prototype.delete = function (patternString, fn) {
  var elems = patternString.split('/');
  var _re = /:\w+/;
  var params = {};
  var pattern;
  
  // Extract pattern variables for params
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].match(_re)) {
      params[i - 1] = elems[i].replace(':', ''); // elems has '' at index 0;
      elems[i] = '(\\w+)';
    }
  }

  // Coerce pattern to RegExp
  pattern = new RegExp(elems.join('\\/'));

  if (!this.routes[patternString]) this.routes[patternString] = {regex: pattern};
  
  this.routes[patternString].DELETE = function (req, res, next) {
    // Attach pattern variables to req.params
    var args = req.pathname.match(pattern);
    for (var i = 1; i < args.length; i++) {
      console.log('matching params', params);
      var param = params[i];
      req.params[param] = args[i];
    }
    
    return fn(req, res, next);
  }
};

function requestHandler (req, res) {
  console.log('Incoming request from',
              req.socket.remoteAddress,
             'to', req.url);
  var self = this;
  var m = 0;
  var r = 0;
  var mwCount = self.middleware.length;
  var routeCount = self.routes.length;

  function nextMW () {
    if (m < mwCount)
      self.middleware[m++](req, res, nextMW);
    else
      nextRoute();
  }

  function nextRoute () {
    var method = req.method.toUpperCase();
    for (var r in self.routes) {
      var route = self.routes[r];
      var match = req.pathname.match(route.regex);

      if (match && match[0] === match.input) {
        if (method in route) {
          route[method](req, res, function () {});
        } else {
          res.send(405);
        }
        return;
      }
    }
    // No matching routes
    res.send(404);
  }

  nextMW();
}

module.exports = Application;
