import mongoose, { Schema } from 'mongoose';

const AdvertSchema = new Schema({
  link: {
    type: String,
    required: true
  }
});

const Advert = mongoose.model('adverts', AdvertSchema);

export default Advert;
