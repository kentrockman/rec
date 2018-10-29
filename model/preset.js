const mongoose = require('mongoose');

const presetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  active: Boolean,
  ha: {
    switch: {
      type: Map,
      of: Boolean,
    },
    settings: {
      host: String,
      user: String,
      pw: String,
    },
  },
  ssh: {
    apps: {
      type: Map,
      of: Boolean,
    },
    settings: {
      host: String,
      port: Number,
      user: String,
      pw: String,
    },
  },
});

module.exports = mongoose.model('Preset', presetSchema, 'preset');
