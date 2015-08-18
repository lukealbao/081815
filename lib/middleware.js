var qs = require('querystring');
var url = require('url');
var util = require('util');

// parseBody
// 1. Querystring or JSON body -> `req.params`
// 2. Cookies -> `req.cookies`
// 3. Path -> `req.cookies`
function parseBody (req, res, next) {
  var uri = url.parse(req.url, true);
  req.pathname = uri.pathname;
  req.cookies = qs.parse(req.headers.cookie);
  req.query = uri.query;

  req.on('readable', function () {
    var body = req.read();
    var contentType = req.headers['content-type'];
    if (contentType === 'application/json') {
      util._extend(req.params, JSON.parse(body));
    } else {
      util._extend(req.params, qs.parse(body));
    }
    next(req, res);
  });
}

// extendObjects
// 1. Set request encoding for stringification of stream
// 2. Set req.params: <Object>
// 3. Set res.send : <Number> Status Code, <Object> | <String> Body
function extendObjects (req, res, next) {
  req.setEncoding(req.headers['content-encoding'] || 'utf8');
  req.params = {};
  res.send = send;
  next();
}

// send: Context is http.ServerResponse Object
// content-type: application/json only!
function send (statusCode, body) {
  this.statusCode = statusCode;
  this.statusMessage = STATUSES[statusCode];
  if (typeof body === 'object'
    || typeof body === 'number') {
    body = JSON.stringify(body, null, 2);
  }
  if (!body) body = '';

  this.setHeader('Content-Length', body.length);
  this.setHeader('Content-Type', 'application/json');  
  this.end(body);
}

var STATUSES = {
    200: 'OK',
    201: 'Created',
    400: 'Bad Request',
    401: 'Not Authorized',
    404: 'Not Found',
    405: 'Method Not Allowed'
};
    
module.exports.parseBody = parseBody;
module.exports.extendObjects = extendObjects;
