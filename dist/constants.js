'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var proxy = exports.proxy = 'http://uciedh:G5SG68Ep1Z@109.248.51.32:24531';
var mongoURI = exports.mongoURI = process.env.NODE_ENV === 'production' ? 'mongodb://localhost/parser' : 'mongodb://192.168.99.100/parser';

var sendersMail = exports.sendersMail = 'senderadvertmail24@gmail.com';
var sendersMailPassword = exports.sendersMailPassword = '123senderadvertmail24';
var recipientsMail = exports.recipientsMail = '779966i@mail.ru, famiev91@gmail.com';

var avitoUrl = exports.avitoUrl = 'https://www.avito.ru/krasnoyarskiy_kray/dlya_biznesa?s=104&s_trg=3&q=%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80';
// export const avitoUrl = 'https://www.avito.ru/krasnoyarskiy_kray/kvartiry/sdam?q=%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%B0&sgtd=21&s=104';

var fiveMinuteInterval = exports.fiveMinuteInterval = 300000;