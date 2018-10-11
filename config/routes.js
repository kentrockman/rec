const presetController = require('../controllers/presetController');

module.exports = (app) => {
  app.get('/', presetController.index);
  app.post('/savePreset', presetController.savePreset);
};
