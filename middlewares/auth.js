const authCookie = {
  check: (req, res, next) => {
      if(!req.session.logged_in){
          return res.redirect('/');
      }
      next();
  },
  logged: (req, res, next) => {
    if(req.session.logged_in){
        return res.redirect('/sites');
    }
    next();
},
};

module.exports = {
  authCookie,
};