const logger = require('../config/winston');
const Preset = require('../model/preset');
const consts = require('../config/constants');
const helper = require('../lib/helper');


exports.index = (req, res) => {
  // Active preset available?
  Preset.findOne({ active: true }, (errFindActive, presetLoaded) => {
    if (errFindActive) { logger.log('error', errFindActive); res.render('error'); }

    if (presetLoaded === null) {
      const presetName = 'Default';
      // Given preset name available?
      Preset.countDocuments({ name: presetName }, (errCount, count) => {
        if (errCount) { logger.log('error', errCount); res.render('error'); }

        if (count === 0) {
          // Save and render default preset

          helper.createDefaultPreset(presetName).save((errSave, presetSaved) => {
            if (errSave) { logger.log('error', errCount); res.render('error'); }
            res.render('index', { title: consts.indexTitle, preset: presetSaved });
          });
        }
      });
    } else {
      res.render('index', { title: consts.indexTitle, preset: presetLoaded });
    }
  });
};

exports.savePreset = (req, res) => {
  // Todo: Check for active preset
  const presetToSave = new Preset({
    _id: req.body.id,
    name: req.body.name,
    active: !!req.body.active,
    ha: {
      switch: helper.formTextCheckboxArraytoMap(req.body.haList),
      settings: { host: req.body.haHost, user: req.body.haUser, pw: req.body.haPw },
    },
    ssh: {
      apps: helper.formTextCheckboxArraytoMap(req.body.sshList),
      settings: {
        host: req.body.sshHost,
        user: req.body.sshUser,
        privateKey: req.body.sshPrivateKey,
      },
    },
  });

  Preset.findOneAndUpdate(
    { _id: req.body.id }, presetToSave, { new: true }, (errUpdate, presetSaved) => {
      if (errUpdate) { logger.log('error', errUpdate); res.render('error'); }
      res.render('index', { title: consts.indexTitle, preset: presetSaved });
    },
  );
};
