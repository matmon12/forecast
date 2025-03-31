<template>
  <Spinner
    v-if="historyStore.loadingToday || historyStore.loadingHistory"
    :size="50"
  />
  <Error
    v-else-if="searchStore.error === 1006"
    :message="$t('errors.nothing_found')"
    @to-back="onToBack"
    class="error-wrapper"
  />

  <div v-else class="history">
    <Breadcrumb :model="breadCrumbItems" />
    <div class="history__content">
      <HistoryMain
        class="history-card"
        :weather-today="historyStore.todayWeather"
      />
      <HistoryRadar class="history-card" :history="historyStore.history" />
      <HistoryPolarArea class="history-card" :history="historyStore.history" />
      <HistoryPie
        class="history-card"
        :weather-today="historyStore.todayWeather"
      />
      <HistoryBar class="history-card" :history="historyStore.history" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch, inject } from "vue";
import { HISTORY_URL, FORECAST_URL } from "@/constants/index";
import { useHistoryStore } from "@/stores/history";
import { useSearchStore } from "@/stores/search";
import { axiosApiInstance } from "@/server/api";
import Breadcrumb from "../components/Breadcrumb.vue";

const historyStore = useHistoryStore();
const searchStore = useSearchStore();
const t = inject("t");

// breadcrumb
const breadCrumbItems = computed(() => [
  {
    label: t("breadcrumb.history"),
  },
]);

watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      fetchWeatherToday();
    }
  }
);

const fetchWeatherToday = async () => {
  historyStore.loadingToday = true;
  await axiosApiInstance
    .get(`${FORECAST_URL}?q=${searchStore.search}`)
    .then((res) => {
      historyStore.todayWeather = res.data.forecast.forecastday[0].hour;
      searchStore.searchSuccess = res.data.location.name;

      // сохранение последнего поиска
      historyStore.lastSearch = res.data.location.name;

      // дата неделю назад и вчера
      let time = res.data.location.tz_id;
      let date = new Date();
      date.setDate(date.getDate() - 1);
      let currentDate = getFormattedDate(date, time);
      date.setDate(date.getDate() - 6);
      let dateWeekBack = getFormattedDate(date, time);

      fetchHistory(dateWeekBack, currentDate);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      historyStore.loadingToday = false;
    });
};

const fetchHistory = async (dateStart, dateEnd) => {
  historyStore.loadingHistory = true;
  await axiosApiInstance
    .get(
      `${HISTORY_URL}?q=${searchStore.search}&dt=${dateStart}&end_dt=${dateEnd}`
    )
    .then((res) => {
      historyStore.history = res.data.forecast.forecastday;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      historyStore.loadingHistory = false;
    });
};

const getFormattedDate = (date, time) => {
  let currentDate = date.toLocaleDateString("en-GB", {
    timeZone: time,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return `${currentDate.split("/")[2]}-${currentDate.split("/")[1]}-${
    currentDate.split("/")[0]
  }`;
};

onMounted(() => {
  if (
    (historyStore.lastSearch !== searchStore.searchSuccess ||
      !historyStore.todayWeather) &&
    searchStore.error !== 1006
  ) {
    fetchWeatherToday();
  }
});

const onToBack = () => {
  searchStore.error = "";
  searchStore.search = searchStore.searchSuccess;
  searchStore.input = searchStore.searchSuccess;
};
</script>

<style lang="scss" scoped>
@include History();
.history {
  position: relative;
  height: fit-content;
  width: 100%;
}
.history__content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.history-card {
  &:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 4;
  }
  &:nth-child(2) {
  }
  &:nth-child(5) {
    grid-column-start: 1;
    grid-column-end: 4;
  }
}

.error-wrapper {
  flex-grow: 1;
}
</style>
