'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport({
  service: 'gmail',
  auth: {
    user: _constants.sendersMail,
    pass: _constants.sendersMailPassword
  }
});

var errorSendMail = function errorSendMail() {
  transporter.sendMail({
    from: _constants.sendersMail,
    to: 'famiev91@gmail.com',
    subject: 'Ошибка в парсере Авито. Зайди!',
    text: 'Ошибка в парсере Авито. Зайди!'
  }, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email send ' + info.response);
    }
  });
};

var successSendMail = function successSendMail(data) {
  var html = data.reduce(function (acc, item) {
    var link = '<tr><td><h1 style="font-size: 21px;"><a style="text-decoration: none;" href=https://www.avito.ru' + item.link + '>' + item.title + '</a></h1></td></tr>';
    var postTime = '<tr><td><b>' + item.postTime + '</b></td></tr>';
    var price = '<tr style="border-bottom: 1px solid green;"><td><p>' + item.price + '\u20BD</p></td></tr>';

    return acc + link + postTime + price;
  }, '');

  html = '<table style="border-collapse: collapse; padding: 10px; font-size: 16px;"><tbody>' + html + '</tbody></table>';

  transporter.sendMail({
    from: _constants.sendersMail,
    to: _constants.recipientsMail,
    // to: "famiev91@gmail.com",
    subject: 'Объявления Avito',
    html: html
  }, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email send ' + info.response);
    }
  });
};

exports.default = function (data) {
  return data.isError ? errorSendMail() : successSendMail(data.items);
};