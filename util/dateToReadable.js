const { DateTime } = require('luxon');

function dateToReadable(dateString) {
  return DateTime.fromSQL(dateString).toFormat('dd/MM/yyyy HH:mm');
}

module.exports = dateToReadable;
