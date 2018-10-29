const presetController = require('../controller/preset-controller');

module.exports = (app) => {
  app.get('/', presetController.index);
  app.post('/savePreset', presetController.savePreset);
};
