'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdvertSchema = new _mongoose.Schema({
  link: {
    type: String,
    required: true
  }
});

var Advert = _mongoose2.default.model('adverts', AdvertSchema);

exports.default = Advert;