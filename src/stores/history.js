import { defineStore } from "pinia";
import { ref } from "vue";

export const useHistoryStore = defineStore("history", () => {
  const history = ref();
  const todayWeather = ref();
  const lastSearch = ref('Orel');

  const loadingHistory = ref(false);
  const loadingToday = ref(false);

  return { history, todayWeather, loadingHistory, loadingToday, lastSearch };
});
