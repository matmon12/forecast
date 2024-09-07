export const getImageUrl = (path) => {
  return new URL(`../img/${path}`, import.meta.url).href;
};

export const getFarTemp = (cel) => {
  return Math.round((cel * 9/5) + 32);
}

export const kphToMph = (speed) => {
  return Math.round(speed / 3.6);
}

export const mbToMmHg = (pressure) => {
  return Math.round(pressure / 1.333)
}

export const formattedTime = (time) => {
  return [
    `${Number(time.slice(0, -2).split(":")[0])}:${
      time.slice(0, -2).split(":")[1]
    }`,
    time.slice(-2),
  ];
};

export const formatPath = (path) => {
  if(path) {
    return `${path.split("/")[5]}/${path.split("/")[6]}`;
  }
  return
}

export const setPlus  = (value) => {
  return /^-|0&/.test(value) ? "" : "+";
}

export const formatFromAMPM = (time) => {
  let ampm = time.slice(-2);
  let hours = time.split(":")[0];
  let minutes = time.slice(0, -3).split(":")[1];
  if (Number(hours) === 12) {
    hours = ampm === "AM" ? "00" : "12";
  } else {
    hours = ampm === "AM" ? hours : parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

export const uppercaseFirst = (str) => {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1); 
}

export const pluralize = (count) => {
  return count > 1 ? 's' : '';
}