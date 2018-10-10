import cheerio from 'cheerio';

import Advert from '../models/Advert';
import sendMail from '../sendEmail';
import { formatToDate, diffirenceInTime } from '../helpers';

export default (error, response, html) => {
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
  const relativeTime = timeContainer.map((index, el) => el.attribs['data-relative-date'].trim()).get();

  const adverts = time.reduce((acc, item, index) => {
    if (isNaN(Number(item)) && item.indexOf('Сегодня') !== -1) {
      const date = formatToDate(item);
      const hours = date.hour();
      const minutes = date.minute();

      acc.push({
        postTime: `Сегодня ${hours}:${minutes}`,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index],
        isMoreThanHour: relativeTime[index].indexOf('часов') !== -1,
        datePostTime: date,
        hours,
        minutes
      });
    }

    return acc;
  }, []);

  const filteredAds = adverts.filter((item) => {
    console.log(`Diffirent in time: ${diffirenceInTime(item.datePostTime)}`);

    if (diffirenceInTime(item.datePostTime) <= 5 && item.title.toLowerCase().indexOf('контейнер') >= 0) {
      return item;
    }
    return false;
  });

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
      console.log('Отправляемые данные: ', seltData);
    }
  });
};
