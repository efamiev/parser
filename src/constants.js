const proxy = 'http://uciedh:G5SG68Ep1Z@109.248.51.32:24531';
const mongoURI = process.env.NODE_ENV === 'production'
  ? 'mongodb://localhost/parser'
  : 'mongodb://192.168.99.100/parser';

const sendersMail = 'senderadvertmail24@gmail.com';
const sendersMailPassword = '123senderadvertmail24';
const recipientsMail = '779966i@mail.ru, famiev91@gmail.com';

const avitoUrl = 'https://www.avito.ru/krasnoyarskiy_kray/dlya_biznesa?s=104&s_trg=3&q=%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80';

const fiveMinuteInterval = 300000;

module.exports = {
  proxy,
  mongoURI,
  sendersMail,
  sendersMailPassword,
  recipientsMail,
  avitoUrl,
  fiveMinuteInterval
};
