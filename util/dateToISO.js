const { DateTime } = require('luxon');

function dateToISO(dateString) {
  const dateWithTimezone = DateTime.fromSQL(dateString, {
    zone: 'Europe/Paris',
  });

  return dateWithTimezone.toUTC().toISO();
}

module.exports = dateToISO;
