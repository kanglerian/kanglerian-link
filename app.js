require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { Site } = require('./models');

const indexRouter = require('./routes/index');
const sitesRouter = require('./routes/sites');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(session({ secret: 'kanglerian' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sites', sitesRouter);

app.get('/in/:target', async (req, res) => {
  try {
    const site = await Site.findOne({
      where: {
        target: req.params.target,
      }
    });
    if(!site) {
      return res.status(404).send('Site not found');
    }
    return res.redirect(302, site.source);
  } catch (error) {
    return res.send(error.message);
  }
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
