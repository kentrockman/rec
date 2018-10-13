const logger = require('../config/winston');
const Preset = require('../models/preset');
const consts = require('../config/constants');

exports.index = (req, res) => {
  // Default preset available?
  Preset.findOne({ default: 1 }, (errFindDefault, presetLoaded) => {
    if (errFindDefault) { logger.log('warn', errFindDefault); res.render('error'); }

    if (presetLoaded === null) {
      const presetName = 'Default';

      // Given preset name available?
      Preset.countDocuments({ name: presetName }, (errCount, count) => {
        if (errCount) { logger.log('error', errCount); res.render('error'); }

        if (count === 0) {
          // Save and render preset
          const preset = new Preset({
            name: presetName,
            default: true,
            switch: {
              lamp: false, tv: false, kitchen: false, guitar: true,
            },
            pc: {
              jackd: true, compton: false, ardour: true,
            },
          });
          preset.save((errSave, presetSaved) => {
            res.render('index.pug', { title: consts.indexTitle, preset: presetSaved });
          });
        }
      });
    } else {
      res.render('index.pug', { title: consts.indexTitle, preset: presetLoaded });
    }
  });
};

exports.savePreset = (req, res) => {
  const presetToSave = new Preset({
    _id: req.body.id,
    name: req.body.name,
    default: req.body.default,
    switch: { lamp: !!req.body.lamp, guitar: !!req.body.guitar, tv: !!req.body.tv },
    pc: { jackd: !!req.body.jackd, compton: !!req.body.compton, ardour: !!req.body.ardour },
  });

  Preset.findOneAndUpdate(
    { _id: req.body.id }, presetToSave, { new: true }, (errUpdate, presetSaved) => {
      if (errUpdate) { logger.log('error', errUpdate); res.render('error'); }
      res.render('index.pug', { title: consts.indexTitle, preset: presetSaved });
    },
  );
};
