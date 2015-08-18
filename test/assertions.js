// For semi-prettifying test reports

module.exports.err = function err (msg ) {
  return '[\033[31m' + msg + '\033[0;37m';
}
module.exports.pass = function pass (msg) {
  return '\033[1;32mSuccess:\033[0;37m ' + msg;
}
