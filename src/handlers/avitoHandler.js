import cheerio from 'cheerio';
import moment from 'moment';

import Advert from '../models/Advert';
import sendMail from '../sendEmail';

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

  const items = time.reduce((acc, item, index) => {
    if (isNaN(Number(item)) && item.slice(0, toString(item).indexOf(' ')) === 'Сегодня') {
      const hours = Number(item.slice(toString(item).indexOf(' '), item.indexOf(':'))) + 4;
      const minutes = Number(item.slice(item.indexOf(':') + 1));

      acc.push({
        postTime: `Сегодня ${hours}:${minutes}`,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index],
        isMoreThanHour: relativeTime[index].indexOf('часов') !== -1,
        hours,
        minutes
      });
    }

    return acc;
  }, []);

  const sendItems = items.filter((item) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = item.hours === 24 ? new Date().getDate() - 1 : new Date().getDate();

    const diffirenceInTime = Math.abs(
      moment(new Date(currentYear, currentMonth, currentDay, item.hours, item.minutes)).diff(
        moment().format(),
        'minutes'
      )
    );

    console.log(`Diffirent in time: ${diffirenceInTime}`);

    if (diffirenceInTime <= 5 && item.title.toLowerCase().indexOf('контейнер') >= 0 && !item.isMoreThanHour) {
      return item;
    }
    return false;
  });

  Advert.find({}).exec((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      const res = docs.reduce((acc, { link }) => Object.assign(acc, { [link]: 2 }), {});
      const res1 = sendItems.reduce((acc, item) => {
        if (res[item.link]) {
          Advert.findOneAndDelete({ link: item.link }).then(() => console.log('Deleting'));
        } else {
          Advert.create({ link: item.link }).then(() => console.log('Creating'));
          return acc.concat(item);
        }

        return acc;
      }, []);
      res1.length > 0 && sendMail({ items: sendItems });
      console.log('Все данные: ', sendItems);
      console.log('Отправляемые данные: ', res1);
    }
  });
};
