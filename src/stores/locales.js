import { defineStore } from "pinia";
import { ref } from "vue";

export const useLocalesStore = defineStore("locales", () => {
  const locales = ref({});

  return {locales};
});
