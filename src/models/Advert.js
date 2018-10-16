const mongoose = require('mongoose');

const { Schema } = mongoose;

const AdvertSchema = new Schema({
  link: {
    type: String,
    required: true
  }
});

const Advert = mongoose.model('adverts', AdvertSchema);

module.exports = Advert;
