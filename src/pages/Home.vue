<template>
  <div class="home" v-if="searchStore.error !== 1006">
    <TodayWeather class="card-item" :cur-weather="searchStore.curWeather" />
    <div class="highlight">
      <UvIndex :uv-index="searchStore.curWeather?.current?.uv" />
      <Humidity :humidity="searchStore.curWeather?.current?.humidity" />
      <Wind
        :speed="searchStore.curWeather?.current?.wind_kph"
        :degree="searchStore.curWeather?.current?.wind_degree"
        :dir="searchStore.curWeather?.current?.wind_dir"
      />
      <Pressure :pressure="searchStore.curWeather?.current?.pressure_mb" />
    </div>
    <Sunset :astro-info="searchStore.astroInfo" class="sunset-wrap" />
    <Moon :astro-info="searchStore.astroInfo" class="moon-wrap" />
    <Spinner
      v-if="
        searchStore.loading ||
        searchStore.historyLoading ||
        searchStore.astroLoading
      "
    />
  </div>
  <Error @retry-fetch="getWeatherData" class="error-wrapper" v-else />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useSearchStore } from "@/stores/search";
import { useForecastStore } from "@/stores/forecast";
import axiosApiInstance from "@/api";
import { CURRENT_URL, ASTRO_URL } from "@/constants/index";

const searchStore = useSearchStore();
const forecastStore = useForecastStore();

watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      getWeatherData();
      fetchAstroData();
    }
  }
);

const getWeatherData = async () => {
  searchStore.loading = true;
  await axiosApiInstance
    .get(`${CURRENT_URL}?q=${searchStore.search}`)
    .then((res) => {
      searchStore.curWeather = res.data;
      searchStore.searchSuccess = searchStore.curWeather.location.name;

      // сохранение последнего поиска
      searchStore.lastSearch = searchStore.curWeather.location.name;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      searchStore.loading = false;
    });
};

const fetchAstroData = async () => {
  searchStore.astroLoading = true;
  await axiosApiInstance
    .get(`${ASTRO_URL}?q=${searchStore.search}`)
    .then((res) => {
      searchStore.astroInfo = res.data;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      searchStore.astroLoading = false;
    });
};

onMounted(() => {
  if (
    (searchStore.searchSuccess !== searchStore.lastSearch ||
      !searchStore.curWeather) &&
    searchStore.error !== 1006
  ) {
    // getWeatherData();
    // fetchAstroData();
  }
});
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  grid-template-rows: repeat(20, 5px);
  position: relative;
  gap: 15px;
}
.card-item {
  &:nth-child(1) {
    grid-row-start: 1;
    grid-row-end: 20;
  }
}

.sunset-wrap {
  grid-row-start: 20;
  grid-row-end: 40;
}

.moon-wrap {
  grid-row-start: 23;
  grid-row-end: 40;
}

.highlight {
  @include Card();
  background: radial-gradient(circle, $main 0%, $grey 100%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
  grid-row-start: 1;
  grid-row-end: 23;
}

.error-wrapper {
  flex-grow: 1;
}
</style>
