const nodemail = require('nodemailer');


const transporter = nodemail.createTransport({
    service: 'mail.ru',
    auth: {
        user: 'fiald@mail.ru',
        pass: 'DFA081998FA'
    }
});

const sendMail = (data) => {

    let html = data.reduce((acc, item) => {
        const link = `<tr><td><h1 style="font-size: 21px;"><a style="text-decoration: none;" href=https://www.avito.ru${item.link}>${item.title}</a></h1></td></tr>`;
        const postTime = `<tr><td><b>${item.postTime}</b></td></tr>`;
        const price = `<tr style="border-bottom: 1px solid green;"><td><p>${item.price}₽</p></td></tr>`;

        return acc + link + postTime + price;
    }, '');

    html = '<table style="border-collapse: collapse; padding: 10px; font-size: 16px;"><tbody>' + html + '</tbody></table>';

    transporter.sendMail(
    {
        from: 'fiald@mail.ru',
        to: 'advertmail24@gmail.com, famiev91@gmail.com',
        // to: 'famiev91@gmail.com',
        subject: 'Объявления Avito',
        html
    },
    (error, info) => {
        if(error) {
            console.log(error);
        } else {
            console.log('Email send ' + info.response);
        }
    });

};

module.exports = sendMail;
