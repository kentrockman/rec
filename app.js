const bodyParser = require('body-parser');
const httpErrors = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const morganBody = require('morgan-body');

const logger = require('./config/winston');

// Get MongoDB config
const cfgMongo = require('./config/mongodb.json');

const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

// Add logger
app.use(morgan('combined', { stream: logger.stream }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
morganBody(app);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));

mongoose.connect(cfgMongo.uri, cfgMongo.options).then(
  () => {
    logger.log('info', `Connected to ${cfgMongo.uri}`);
  },
  (err) => {
    logger.log('error', err.stack);
    process.exit(1);
  },
);

// Announce routes
require('./config/routes.js')(app);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// Error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
