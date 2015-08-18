var letters = 'abcdefghijklmnopqrstuvwxyz';

function word (length) {
  var s = '';
  while (s.length < length)
    s += letters[Math.floor(Math.random() * letters.length)];
  return s
}

function generateServer() {
  return {
    name: word(8),
    hostname: word(10) + '.internal',
    port: Math.floor(Math.random() * 10e3),
    username: word(10)
  }
}

module.exports = generateServer;
