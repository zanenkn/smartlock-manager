const { DateTime } = require('luxon');

function dateToISO(dateString, options = {}) {
  const { start = false } = options;

  const dateWithTimezone = DateTime.fromSQL(dateString, {
    zone: 'Europe/Paris',
  });

  return start
    ? dateWithTimezone.minus({ minutes: 5 }).toUTC().toISO()
    : dateWithTimezone.toUTC().toISO();
}

module.exports = dateToISO;
