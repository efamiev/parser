const request = require('request');
const cheerio = require('cheerio');
const moment = require('moment');


const sendMail = require('./send_email');

const avitoRequest = () => request({
    url: 'https://www.avito.ru/krasnoyarskiy_kray/dlya_biznesa?s=104&s_trg=3&q=%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80',
    proxy: 'http://uciedh:G5SG68Ep1Z@109.248.51.32:24531'
  },
  (error, response, html) => {
  
  if(error) throw error;

  const $ = cheerio.load(html);
  const titleContainer = $('.item.item_table .item-description-title-link');
  const priceContainer = $('.item.item_table .price');
  const timeContainer = $('.item.item_table .js-item-date.c-2');

  const titleItems = titleContainer.map((index, el) => el.attribs.title).get();
  const linksItems = titleContainer.map((index, el) => el.attribs.href).get();
  const price = priceContainer.map((index, el) => el.attribs.content).get();
  const time = timeContainer.map((index, el) => el.attribs['data-absolute-date'].trim()).get();

  const newItemIndices = time.reduce((acc, item, index) => {

    if(isNaN(Number(item)) && item.slice(0, toString(item).indexOf(' ')) === 'Сегодня') {

      const hours = item.slice(toString(item).indexOf(' '), item.indexOf(':')); // -7 on server TODO: convert all date to ISO
      const minutes = item.slice(item.indexOf(':') + 1);

      acc.push({
        postTime: `Сегодня ${Number(hours) + 4}:${minutes}`,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index]
      })
    }

    return acc;

  }, []);

  //  TODO: Перенести данную функциию в newItemIndices
  const sendItems = newItemIndices.filter((item) => {

    //  Current date constant
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    //  Item time constant
    const hours = item.postTime.slice(toString(item.postTime).indexOf(' '), item.postTime.indexOf(':')); // -7 on server TODO: convert all date to ISO
    const minutes = item.postTime.slice(item.postTime.indexOf(':') + 1);
    const diffirenceInTime = Math.abs(moment(new Date(currentYear, currentMonth, currentDay, hours, minutes)).diff(moment().format(), 'minutes'));

    console.log('Diffirent in time: ' + diffirenceInTime);
    if (diffirenceInTime <= 5 && item.title.toLowerCase().indexOf('контейнер') >= 0) {
      return item;
    } else {
      return false;
    }

  });

  sendItems.length > 0 && sendMail(sendItems);

  console.log('Все данные: ', newItemIndices);
  console.log('Отправляемые данные: ', sendItems);

});

avitoRequest();

// 5 min
setInterval(avitoRequest, 300000);
