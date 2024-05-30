export const getImageUrl = (path) => {
  return new URL(`../img/${path}`, import.meta.url).href;
};

export const getFarTemp = (cel) => {
  return Math.round((cel * 9/5) + 32);
}

export const kphToMph = (speed) => {
  return speed / 3.6;
}