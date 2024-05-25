import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const search = ref('Orel');
  const loading = ref(false);
  const error = ref();

  return {
    search,
    loading,
    error
  }
});
