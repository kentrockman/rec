const logger = require('../config/winston');
const Preset = require('../models/preset');
const consts = require('../config/constants');

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
          const preset = new Preset({
            name: presetName,
            active: true,
            ha: {
              switch: {
                lamp: false, tv: false, kitchen: false, guitar: true,
              },
              settings: {
                host: '127.0.0.1',
                user: 'user',
                pw: 'pass',
              },
            },
            ssh: {
              apps: {
                jackd: true, compton: false, ardour: true,
              },
              settings: {
                host: '127.0.0.1',
                user: 'user',
                publickey: 'pk123',
              },
            },
          });
          preset.save((errSave, presetSaved) => {
            if (errSave) { logger.log('error', errCount); res.render('error'); }
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
    active: !!req.body.active,
    ha: { switch: { lamp: !!req.body.lamp, guitar: !!req.body.guitar, tv: !!req.body.tv } },
    ssh: {
      apps:
      { jackd: !!req.body.jackd, compton: !!req.body.compton, ardour: !!req.body.ardour },
    },
  });

  Preset.findOneAndUpdate(
    { _id: req.body.id }, presetToSave, { new: true }, (errUpdate, presetSaved) => {
      if (errUpdate) { logger.log('error', errUpdate); res.render('error'); }
      res.render('index.pug', { title: consts.indexTitle, preset: presetSaved });
    },
  );
};
