export const getImageUrl = (path) => {
  return new URL(`../img/${path}`, import.meta.url).href;
};
