import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const search = ref('Orel');
  const searchSuccess = ref('Orel');
  const loading = ref(false);
  const historyLoading = ref(false);
  const error = ref();
  const input = ref('');

  return {
    search,
    loading,
    error,
    searchSuccess,
    input,
    historyLoading
  }
});
