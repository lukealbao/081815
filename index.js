var App = require('./lib/app');
var routes = require('./routes');
var dataStore = require('./lib/persistence');
var server = new App();

server.use('extendObjects');
server.use('parseBody');
server.use(function authenticate (req, res, next) {
  // req.authenticated = :userName | false
  var sessionId = req.cookies.sessionId;
  if (sessionId in dataStore.sessions) {
    req.authenticated = dataStore.sessions[sessionId];
    }
  else {
    req.authenticated = false;
  }
  next();
});
server.use(function ormLite (req, res, next) {
  // req.appState = state (i.e., lib/persistence)
  req.appState = dataStore;
  next();
});

server.post('/login', routes.login);
server.get('/logout', routes.logout);

server.get('/servers', routes.servers.getMany);
server.post('/servers', routes.servers.createOne);

server.get('/server/:id', routes.servers.getOne);
server.put('/server/:id', routes.servers.updateOne);
server.delete('/server/:id', routes.servers.deleteOne);

server.listen(9999, function () {
  console.log('Listening on port 9999...')
});

module.exports = server;
