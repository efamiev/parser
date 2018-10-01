const request = require("request");
const cheerio = require("cheerio");

request('https://www.avito.ru/krasnoyarskiy_kray/dlya_biznesa?s=104&s_trg=10&q=%D0%BA%D0%BE%D0%BD%D1%82%D0%B5%D0%B9%D0%BD%D0%B5%D1%80', (error, response, html) => {
  const $ = cheerio.load(html)
  const titleContainer = $(".item.item_table .item-description-title-link");
  const priceContainer = $(".item.item_table .price");
  const timeContainer = $(".item.item_table .js-item-date.c-2");

  const titleItems = titleContainer.map((index, el) => el.attribs.title).get();
  const price = priceContainer.map((index, el) => el.attribs.content).get();
  const time = timeContainer.map((index, el) => el.attribs['data-absolute-date']).get();
  // Если время менее 30 мин назад, берем индекс элемента и отправляем на почту
  // TODO: Разобратся с конвертацией даты


  console.log(time);
  // console.log(price.length);
  // console.log(titleItems);
  // console.log(price)
  // console.log(titleContainer.attr('title'));
});
