import { defineStore } from "pinia";
import { ref } from "vue";

export const useServerStore = defineStore("server", () => {
  const urls = ref({});

  const setUrl = (id, url) => {
    urls.value[id] = url;
  }

  const deleteUrl = (id) => {
    delete urls.value[id];
  }

  return {
    urls,
    setUrl,
    deleteUrl
  }
});
