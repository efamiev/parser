import nodemail from 'nodemailer';

import { sendersMail, sendersMailPassword, recipientsMail } from './constants';

const transporter = nodemail.createTransport({
  service: 'gmail',
  auth: {
    user: sendersMail,
    pass: sendersMailPassword
  }
});

function errorSendMail() {
  transporter.sendMail(
    {
      from: sendersMail,
      to: 'famiev91@gmail.com',
      subject: 'Ошибка в парсере Авито. Зайди!',
      text: 'Ошибка в парсере Авито. Зайди!'
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email send ${info.response}`);
      }
    }
  );
}

function successSendMail(data) {
  let html = data.reduce((acc, item) => {
    const link = `<tr><td><h1 style="font-size: 21px;"><a style="text-decoration: none;" href=https://www.avito.ru${
      item.link
    }>${item.title}</a></h1></td></tr>`;
    const postTime = `<tr><td><b>${item.postTime}</b></td></tr>`;
    const price = `<tr style="border-bottom: 1px solid green;"><td><p>${item.price}₽</p></td></tr>`;

    return acc + link + postTime + price;
  }, '');

  html = `<table style="border-collapse: collapse; padding: 10px; font-size: 16px;"><tbody>${html}</tbody></table>`;

  transporter.sendMail(
    {
      from: sendersMail,
      to: recipientsMail,
      subject: 'Объявления Avito',
      html
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email send ${info.response}`);
      }
    }
  );
}

export default data => (data.isError ? errorSendMail() : successSendMail(data.items));
