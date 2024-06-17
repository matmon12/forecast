
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const search = ref("Orel");
  const searchSuccess = ref("Orel");

  const loading = ref(false);
  const historyLoading = ref(false);
  const astroLoading = ref(false);

  const error = ref();
  const input = ref("");

  const curWeather = ref();
  const astroInfo = ref();
  const maxTemp = ref();
  const minTemp = ref();

  const lastSearch = ref("Orel"); 
  return {
    search,
    loading,
    error,
    searchSuccess,
    input,
    historyLoading,
    astroLoading,
    curWeather,
    astroInfo,
    maxTemp,
    minTemp,
    lastSearch
  };
});
