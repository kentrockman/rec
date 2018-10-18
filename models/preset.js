const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  test: {
    type: Map,
    of: Boolean,
  },
  active: Boolean,
  ha: {
    switch: {
      lamp: Boolean,
      guitar: Boolean,
      tv: Boolean,
      kitchen: Boolean,
    },
    settings: {
      host: String,
      user: String,
      pw: String,
    },
  },
  ssh: {
    apps: {
      jackd: Boolean,
      compton: Boolean,
      ardour: Boolean,
    },
    settings: {
      host: String,
      user: String,
      publickey: String,
    },
  },
});

module.exports = mongoose.model('Preset', presetSchema, 'preset');
