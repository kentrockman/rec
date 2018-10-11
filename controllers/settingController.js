const logger = require('../config/winston');

exports.index = (req, res) => {
  logger.log('warn', `==> ${req.app.get('views')}`);
  res.render('index.pug', { title: 'Rec' });
};

exports.savePreset = (req, res) => {
  res.render('index.pug', { title: 'Rec' });
};
