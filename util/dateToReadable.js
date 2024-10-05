function dateToReadable(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split(' ');

  const [year, month, day] = datePart.split('-');

  const [hours, minutes] = timePart.split(':');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

module.exports = dateToReadable;
