'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _sendEmail = require('../sendEmail');

var _sendEmail2 = _interopRequireDefault(_sendEmail);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (error, response, html) {
  if (error) {
    (0, _sendEmail2.default)({ isError: true });
    return;
  }

  var $ = _cheerio2.default.load(html);
  var titleContainer = $('.item.item_table .item-description-title-link');
  var priceContainer = $('.item.item_table .price');
  var timeContainer = $('.item.item_table .js-item-date.c-2');

  var titleItems = titleContainer.map(function (index, el) {
    return el.attribs.title;
  }).get();
  var linksItems = titleContainer.map(function (index, el) {
    return el.attribs.href;
  }).get();
  var price = priceContainer.map(function (index, el) {
    return el.attribs.content;
  }).get();
  var time = timeContainer.map(function (index, el) {
    return el.attribs['data-absolute-date'].trim();
  }).get();
  var relativeTime = timeContainer.map(function (index, el) {
    return el.attribs['data-relative-date'].trim();
  }).get();

  var items = time.reduce(function (acc, item, index) {
    if (isNaN(Number(item)) && item.slice(0, toString(item).indexOf(' ')) === 'Сегодня') {
      var hours = Number(item.slice(toString(item).indexOf(' '), item.indexOf(':'))) + 4;
      var minutes = Number(item.slice(item.indexOf(':') + 1));

      acc.push({
        postTime: '\u0421\u0435\u0433\u043E\u0434\u043D\u044F ' + hours + ':' + minutes,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index],
        isMoreThanHour: relativeTime[index].indexOf('часов') !== -1,
        hours: hours,
        minutes: minutes
      });
    }

    return acc;
  }, []);

  var sendItems = items.filter(function (item) {
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth();
    var currentDay = new Date().getDate();

    var diffirenceInTime = Math.abs((0, _moment2.default)(new Date(currentYear, currentMonth, currentDay, item.hours, item.minutes)).diff((0, _moment2.default)().format(), 'minutes'));

    console.log('Diffirent in time: ' + diffirenceInTime);

    if (diffirenceInTime <= 5 && item.title.toLowerCase().indexOf('контейнер') >= 0 && !item.isMoreThanHour) {
      return item;
    }
    return false;
  });

  sendItems.length > 0 && (0, _sendEmail2.default)({ items: sendItems });

  console.log('Все данные: ', items);
  console.log('Отправляемые данные: ', sendItems);
};