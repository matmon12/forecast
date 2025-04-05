import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const search = ref("auto:ip");
  const searchSuccess = ref();
  const lastSearch = ref();

  const loading = ref(false);
  const historyLoading = ref(false);
  const astroLoading = ref(false);

  const error = ref();
  const input = ref("");

  const curWeather = ref();
  const astroInfo = ref();
  const maxTemp = ref();
  const minTemp = ref();

  const setCityDefault = (city) => {
    if (city) {
      curWeather.value = null;
      search.value = city;
    }
  };

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
    lastSearch,
    setCityDefault,
  };
});
