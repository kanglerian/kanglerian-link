const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {
  User
} = require('../models');
const { authCookie } = require('../middlewares/auth');

router.get('/', authCookie.logged, function (req, res, next) {
  return res.render('index', {
    layout: 'template'
  });
});

router.post('/login', authCookie.logged,  async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.redirect(401, '/');
      }
      req.session.logged_in = true;
      return res.redirect('/sites');
    }
    return res.redirect('/');
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete('/logout', function (req, res) {
  req.session.destroy((error) => {
    if(error){
      return alert('Failed to logout');
    }
    res.redirect(301, '/');
  });
});

module.exports = router;
