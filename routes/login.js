var crypto = require('crypto');

// loginHandler : Object, Object, Function -> Continue(null)
function loginHandler (req, res, next) {
  var state = req.appState;
  var params = req.params;
  var authenticated = login(params.username, params.password, state.users);

  if (authenticated) {
    var sessionId = crypto.createHash('sha1')
                    .update(new Date() + 'TotallyRandom text!')
                    .digest('hex');

    state.sessions[sessionId] = params.username;

    res.setHeader('Set-Cookie', 'sessionId=' + sessionId);
    res.send(200, 'You\'re all logged in and stuff.\n');
    next();
    console.log('[' + new Date() + ']',
                params.username, 'has logged in at session id', sessionId);
  } else {
    res.send(401, 'Your username and/or password is/are invalid.\n');
    next();
  }
}

// login : String, String, Object -> Boolean
function login (name, rawPwd, userStore) {
  var user = userStore[name];
  if (!user) return false;

  var _pwd = user.password.split('|');
  var pwHash = _pwd[0];
  var salt = _pwd[1];
  
  var attempt = crypto
                .pbkdf2Sync(rawPwd, salt, 1024, 64)
                .toString('hex');

  user.loggedIn = (attempt === pwHash);

  return user.loggedIn;
}

module.exports = loginHandler;
