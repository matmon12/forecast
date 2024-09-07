import { defineStore } from "pinia";
import { ref } from "vue";

export const useServerStore = defineStore("server", () => {
  const urls = ref({});

  return {
    urls
  }
});
