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

router.get('/:id', authCookie.check, async function(req, res, next){
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('ID is required');
    }
    const site = await Site.findByPk(id);
    if (!site) {
      return res.status(404).send('Site not found');
    }
    return res.json({
      status: 'success',
      data: site
    }, 200);
  } catch (error) {
    return res.send(error.message);
  }
});

router.delete('/:id', authCookie.check, async function(req, res, next){
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('ID is required');
    }
    const site = await Site.findByPk(id);
    if (!site) {
      return res.status(404).send('Site not found');
    }
    await site.destroy();
    return res.json({
      status: 'success',
      message: 'Site deleted successfully',
    }, 200);
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

router.patch('/:id', authCookie.check, async function(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('ID is required');
    }
    const site = await Site.findByPk(id);
    if (!site) {
      return res.status(404).send('Site not found');
    }
    const { name, target, source } = req.body;
    if (!name || !target || !source) {
      return res.status(400).send('All fields are required');
    }
    await Site.update({
      name: name,
      target: target,
      source: source,
      status: true,
    }, {
      where: {
        id: id
      }
    });
    return res.redirect(302, '/sites');
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = router;