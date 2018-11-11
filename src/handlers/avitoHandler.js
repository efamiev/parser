const cheerio = require('cheerio');

const Advert = require('../models/Advert');
const sendMail = require('../sendEmail');

const { formatToDate, diffirenceInTime, indexOf } = require('../helpers');

function avitoHandler(error, response, html) {
  if (error) {
    sendMail({ isError: true });
    return;
  }

  const $ = cheerio.load(html);
  const titleContainer = $('.item.item_table .item-description-title-link');
  const priceContainer = $('.item.item_table .price');
  const timeContainer = $('.item.item_table .js-item-date.c-2');

  const titleItems = titleContainer.map((index, el) => el.attribs.title).get();
  const linksItems = titleContainer.map((index, el) => el.attribs.href).get();
  const price = priceContainer.map((index, el) => el.attribs.content).get();
  const time = timeContainer.map((index, el) => el.attribs['data-absolute-date'].trim()).get();

  const adverts = time.reduce((acc, item, index) => {
    if (isNaN(Number(item)) && indexOf(item, 'сегодня')) {
      const date = formatToDate(item);
      const hours = date.hour();
      const minutes = date.minute();

      acc.push({
        postTime: `Сегодня ${hours}:${minutes}`,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index],
        datePostTime: date,
        hours,
        minutes
      });
    }

    return acc;
  }, []);

  const filteredAds = adverts.filter((item) => {
    const forbiddenWords = ['рефконтейнер', 'мусор', 'шиномонтажка'];
    const condition = !indexOf(item.title, ...forbiddenWords) && indexOf(item.title, 'контейнер');
    console.log('Condition: ', condition);
    console.log('Diffirence in time: ', diffirenceInTime(item.datePostTime));
    if (diffirenceInTime(item.datePostTime) <= 5 && condition) {
      return true;
    }

    return false;
  });

  console.log('Filtered adverts: ', filteredAds);

  Advert.find({}).exec((err, docs) => {
    if (err) {
      sendMail({ isError: true });
    } else {
      const dbData = docs.reduce((acc, { link }) => Object.assign(acc, { [link]: 2 }), {});
      const seltData = filteredAds.reduce((acc, item) => {
        if (dbData[item.link]) {
          Advert.findOneAndDelete({ link: item.link }).then(() => console.log('Deleting'));
        } else {
          Advert.create({ link: item.link }).then(() => console.log('Creating'));
          return acc.concat(item);
        }

        return acc;
      }, []);

      seltData.length > 0 && sendMail({ items: seltData });
    }
  });
}

module.exports = avitoHandler;
