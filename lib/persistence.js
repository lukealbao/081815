var generateServer = require('./generate-servers');
var dataStore = {
  users: {
    // raw password for lukealbao: 'tenable'
    'lukealbao': {
      password: '1f927c130a814ece0e5723cb7f0c36375f66'
              + 'e4230f5e2b8b4dfad2a87fba78109b3738'
              + 'bd56a5675ea5d7bbdae04983e008db58d4'
              + '86baec2950db16e0e6072f6a|supersecret!'}
  },
  sessions: {
    // No persistence here!
  },
  servers: {
    'ip-local-172-81-02-131': {
      name: 'host1',
      hostname: 'www.superfun.com',
      port: 9986,
      username: 'satchmo'
    },
    'ip-local-172-81-02-132': {
      name: 'host2',
      hostname: 'w3.superfun.com',
      port: 9986,
      username: 'satchmo'
    },
    'ip-local-172-81-02-133': {
      name: 'host3',
      hostname: 'borrrring.com',
      port: 9986,
      username: 'hal'
    }
  }    
};

for (var i = 0; i < 200; dataStore.servers[i++] = generateServer());

module.exports = dataStore;
