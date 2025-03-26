const express = require('express');
const router = express.Router();
const { authCookie } = require('../middlewares/auth')
const { Site } = require('../models');

router.get('/', authCookie.check, async function(req, res, next) {
  try {
    const sites = await Site.findAll();
    return res.render('sites', {
      layout: 'template',
      sites: sites
    });
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = router;