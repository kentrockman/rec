const Preset = require('../model/preset');

exports.formTextCheckboxArraytoMap = (arr) => {
  const map = {};
  if (arr === undefined) return map;
  for (let i = 0, len = arr.length; i < len; i += 1) {
    if (i + 1 !== len && arr[i] !== '' && arr[i + 1] === 'on') {
      map[arr[i]] = true;
    } else if (arr[i] !== '' && arr[i] !== 'on') {
      map[arr[i]] = false;
    }
  }
  return map;
};

exports.createDefaultPreset = (presetName) => {
  const preset = new Preset({
    name: presetName,
    active: true,
    ha: {
      switch: {
        Lamp: false, TV: false, Kitchen: false, Guitar: true,
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
        privateKey: 'pk123',
      },
    },
  });
  return preset;
};
