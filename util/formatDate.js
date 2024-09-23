function formatDate(dateString) {
  const dateInFrance = new Date(`${dateString} GMT+0200`);

  const isoStringParts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
    .formatToParts(dateInFrance)
    .reduce((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});

  const isoDate = `${isoStringParts.year}-${isoStringParts.month}-${isoStringParts.day}T${isoStringParts.hour}:${isoStringParts.minute}:${isoStringParts.second}+02:00`;

  return isoDate;
}

module.exports = formatDate;
