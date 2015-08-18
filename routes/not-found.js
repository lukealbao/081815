module.exports = {
  regex: null,
  fn: notFoundHandler
};

function notFoundHandler (req, res, state) {
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.end();
}
