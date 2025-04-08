const express = require('express');
const router = express.Router();
const { authCookie } = require('../middlewares/auth')
const { Site } = require('../models');

router.get('/', authCookie.check, async function(req, res, next) {
  try {
    const sites = await Site.findAll();
    return res.render('sites', {
      layout: 'template',
      sites: sites,
      url: req.protocol + '://' + req.get('host'),
    });
  } catch (error) {
    return res.send(error.message);
  }
});

router.post('/', authCookie.check, async function(req, res, next) {
  try {
    const { name, target, source } = req.body;
    if (!name || !target || !source) {
      return res.status(400).send('All fields are required');
    }
    await Site.create({
      name: name,
      target: target,
      source: source,
      status: true,
    });
    return res.redirect(302, '/sites');
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete('/:id', authCookie.check, async function(req, res, next){
  return res.send(req.params.id);
});

module.exports = router;