const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  default: Boolean,
  switch: {
    lamp: Boolean,
    guitar: Boolean,
    tv: Boolean,
    kitchen: Boolean,
  },
  pc: {
    jackd: Boolean,
    compton: Boolean,
    ardour: Boolean,
  },
});

module.exports = mongoose.model('Preset', presetSchema, 'preset');
