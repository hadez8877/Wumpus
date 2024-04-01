const { Schema, model } = require('mongoose');

let welcome = new Schema({
  Guild: { type: String, unique: true },
  Channel: { type: String, default: null },
  Message: { type: Array, default: null },
});

module.exports = model('welcome', welcome);