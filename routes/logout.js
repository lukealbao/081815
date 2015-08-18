var qs = require('querystring');

// logoutHandler : Object, Object, Function -> Continue(null)
function logoutHandler (req, res, next) {
  var state = req.appState;
  var sessionId = req.cookies.sessionId;
  var user = req.authenticated;
  delete state.sessions[sessionId];

  if (user) {
    console.log(user, 'has logged out.');
    req.authenticated = false;
  } 

  res.send(200, 'You\'re all logged out and stuff.\n');
}

module.exports = logoutHandler;
