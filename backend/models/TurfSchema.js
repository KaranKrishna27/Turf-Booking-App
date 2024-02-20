const mongoose = require('mongoose');

const turfSchema = {
    name: String,
    description: String,
    imageURL: String
  };

  const Turf = mongoose.model('Turf', turfSchema);

  module.exports = Turf;
  