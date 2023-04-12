function deserialize(serializedDate) {
  let dateAndTime = serializedDate.split(' ');
  let dateParts = dateAndTime[0].split('-');
  let timeParts = dateAndTime[1].split(':');

  return new Date(
    dateParts[0],
    dateParts[1] - 1,
    dateParts[2],
    timeParts[0],
    timeParts[1],
    timeParts[2],
    0
  );
}

function serialize(date) {
  if (!date) {
    return date;
  }

  let hours = formatNumber(date.getHours());
  let minutes = formatNumber(date.getMinutes());
  let seconds = formatNumber(date.getSeconds());

  return (
    date.getFullYear() +
    '-' +
    formatNumber(date.getMonth() + 1) +
    '-' +
    formatNumber(date.getDate()) +
    ` ${hours}:${minutes}:${seconds}`
  );

  function formatNumber(number, digits = 2) {
    let string = `${number}`;
    while (string.length < digits) {
      string = `0${string}`;
    }
    return string;
  }
}

export const dateMapper = {
  dataFieldName: null,
  serialize,
  deserialize(serializedDate) {
    if (!serializedDate) {
      return new Date();
    }
    return deserialize(serializedDate);
  },
};

export const dateMapperNullable = {
  dataFieldName: null,
  serialize,
  deserialize(serializedDate) {
    if (!serializedDate) {
      return serializedDate;
    }
    return deserialize(serializedDate);
  },
};
