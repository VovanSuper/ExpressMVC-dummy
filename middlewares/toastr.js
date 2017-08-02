module.exports = function(req, resp, next) {
  if (req.url === '/favicon.ico')
    return resp.status(404).send('No favicon, OK...');

  if (req.user) {
    resp.locals.user = req.user;
    console.log('Req user: ' + resp.locals.user);
  }
  resp.locals.toastr = req.toastr.render() || null;
  next();
};
