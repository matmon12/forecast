import { defineStore } from "pinia";
import { ref } from "vue";

export const useForecastStore = defineStore("forecast", () => {
  const forecastData = ref();
  const loadingForecast = ref(false);

  const lastSearch = ref("Orel");

  return {
    forecastData,
    loadingForecast,
    lastSearch
  };
});
