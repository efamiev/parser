'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _Advert = require('../models/Advert');

var _Advert2 = _interopRequireDefault(_Advert);

var _sendEmail = require('../sendEmail');

var _sendEmail2 = _interopRequireDefault(_sendEmail);

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  var adverts = time.reduce(function (acc, item, index) {
    if (isNaN(Number(item)) && item.indexOf('Сегодня') !== -1) {
      var date = (0, _helpers.formatToDate)(item);
      var hours = date.hour();
      var minutes = date.minute();

      acc.push({
        postTime: '\u0421\u0435\u0433\u043E\u0434\u043D\u044F ' + hours + ':' + minutes,
        title: titleItems[index],
        price: price[index],
        link: linksItems[index],
        isMoreThanHour: relativeTime[index].indexOf('часов') !== -1,
        datePostTime: date,
        hours: hours,
        minutes: minutes
      });
    }

    return acc;
  }, []);

  var filteredAds = adverts.filter(function (item) {
    console.log('Diffirent in time: ' + (0, _helpers.diffirenceInTime)(item.datePostTime));

    if ((0, _helpers.diffirenceInTime)(item.datePostTime) <= 5 && item.title.toLowerCase().indexOf('контейнер') >= 0) {
      return item;
    }
    return false;
  });

  _Advert2.default.find({}).exec(function (err, docs) {
    if (err) {
      (0, _sendEmail2.default)({ isError: true });
    } else {
      var dbData = docs.reduce(function (acc, _ref) {
        var link = _ref.link;
        return Object.assign(acc, _defineProperty({}, link, 2));
      }, {});
      var seltData = filteredAds.reduce(function (acc, item) {
        if (dbData[item.link]) {
          _Advert2.default.findOneAndDelete({ link: item.link }).then(function () {
            return console.log('Deleting');
          });
        } else {
          _Advert2.default.create({ link: item.link }).then(function () {
            return console.log('Creating');
          });
          return acc.concat(item);
        }

        return acc;
      }, []);

      seltData.length > 0 && (0, _sendEmail2.default)({ items: seltData });
      console.log('Отправляемые данные: ', seltData);
    }
  });
};