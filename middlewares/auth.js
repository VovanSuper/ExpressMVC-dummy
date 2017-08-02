module.exports = function(req, resp, next) {
  if (req.isAuthenticated()) {
    req.toastr.success('Authentication', 'Successfully logged in!');
    return next();
  }
  req.toastr.error('Authentication', 'Non authenticated! Please log in');
  return resp.redirect('/auth/login/local');
};
