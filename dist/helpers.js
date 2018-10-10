'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diffirenceInTime = undefined;
exports.formatToDate = formatToDate;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatToDate(date) {
  var currentYear = new Date().getFullYear();
  var currentMonth = new Date().getMonth();

  var hours = Number(date.slice(toString(date).indexOf(' '), date.indexOf(':')));
  var minutes = Number(date.slice(date.indexOf(':') + 1));

  var currentDay = hours === 19 && minutes >= 55 ? new Date().getDate() - 1 : new Date().getDate();

  return (0, _moment2.default)(new Date(currentYear, currentMonth, currentDay, hours, minutes)).add(4, 'h');
}

var diffirenceInTime = exports.diffirenceInTime = function diffirenceInTime(date) {
  return Math.abs(date.diff((0, _moment2.default)(), 'minutes'));
};