const moment = require('moment');

function formatToDate(date) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const hours = Number(date.slice(toString(date).indexOf(' '), date.indexOf(':')));
  const minutes = Number(date.slice(date.indexOf(':') + 1));

  const currentDay = hours === 19 && minutes >= 55 ? new Date().getDate() - 1 : new Date().getDate();

  return moment(new Date(currentYear, currentMonth, currentDay, hours, minutes)).add(4, 'h');
}

const indexOf = (string, word) => string.toLowerCase().indexOf(word) !== -1 ? true : false;

const diffirenceInTime = date => Math.abs(date.diff(moment(), 'minutes'));

module.exports = {
  indexOf,
  formatToDate,
  diffirenceInTime
};
