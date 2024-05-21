import { ref } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(true);

  return {theme};
})