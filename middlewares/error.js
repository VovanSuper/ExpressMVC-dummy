module.exports = function(err, req, resp, next) {
  console.log(err);
  if (req.xhr) {
    return resp.status(500).json({
      message: 'Error handler',
      error: err.stack || err.message || err
    });
  }
  resp.render('error', {
    title: 'Error handler page',
    err: err.stack || err.message || err
  });
}
