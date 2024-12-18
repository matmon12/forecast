import router from "@/router/router";

export const getImageUrl = (path) => {
  return new URL(`../img/${path}`, import.meta.url).href;
};

export const getFarTemp = (cel) => {
  return Math.round((cel * 9) / 5 + 32);
};

export const kphToMph = (speed) => {
  return Math.round(speed / 3.6);
};

export const mbToMmHg = (pressure) => {
  return Math.round(pressure / 1.333);
};

export const formattedTime = (time) => {
  return [
    `${Number(time.slice(0, -2).split(":")[0])}:${
      time.slice(0, -2).split(":")[1]
    }`,
    time.slice(-2),
  ];
};

export const formatPath = (path) => {
  if (path) {
    return `${path.split("/")[5]}/${path.split("/")[6]}`;
  }
  return;
};

export const setPlus = (value) => {
  return /^-|0&/.test(value) ? "" : "+";
};

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
};

export const pluralize = (count) => {
  return count > 1 ? "s" : "";
};

export const areArraysEqual = (firstArray, secondArray) => {
  if (
    firstArray.length === secondArray.length &&
    firstArray.every((el, index) => el === secondArray[index])
  ) {
    return true;
  }
  return false;
};

export const onToBack = () => {
  router.go(-1);
};

export const getLuminance = (color) => {
  const rgb = color.match(/\d+/g);
  const r = parseInt(rgb[0]);
  const g = parseInt(rgb[1]);
  const b = parseInt(rgb[2]);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const translitForUrl = (text) => {
  var converter = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ь: "",
    ы: "y",
    ъ: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };
  var answer = "";

  if (text) {
    text = text.toLowerCase();

    for (let i = 0; i < text.length; ++i) {
      if (converter[text[i]] == undefined) {
        answer += text[i];
      } else {
        answer += converter[text[i]];
      }
    }

    answer = answer.replace(/[^-0-9a-z]/g, "-");
    answer = answer.replace(/[-]+/g, "-");
    answer = answer.replace(/^\-|-$/g, "");
  } else {
    return text;
  }

  return answer;
};

export const getUsername = (email) => {
  if (email) {
    return uppercaseFirst(email.split("@")[0]);
  }
};
