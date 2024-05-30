<template>
  <div class="home" v-if="searchStore.error !== 1006">
    <TodayWeather class="card-item" :cur-weather="curWeather" />
    <div class="highlight">
      <UvIndex :uv-index="curWeather?.current?.uv" />
      <Humidity :humidity="curWeather?.current?.humidity" />
      <Wind
        :speed="curWeather?.current?.wind_kph"
        :degree="curWeather?.current?.wind_degree"
        :dir="curWeather?.current?.wind_dir"
      />
      <Pressure/>
    </div>
    <Spinner v-if="searchStore.loading || searchStore.historyLoading" />
  </div>
  <Error @retry-fetch="getWeatherData" class="error-wrapper" v-else />
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useSearchStore } from "@/stores/search";
import axiosApiInstance from "@/api";
import { CURRENT_URL, HISTORY_URL } from "@/constants/index";

const searchStore = useSearchStore();
const curWeather = ref();

watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      getWeatherData();
    }
  }
);

const getWeatherData = async () => {
  searchStore.loading = true;
  await axiosApiInstance
    .get(`${CURRENT_URL}?q=${searchStore.search}`)
    .then((res) => {
      curWeather.value = res.data;
      searchStore.searchSuccess = curWeather.value.location.name;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      searchStore.loading = false;
    });
};

onMounted(() => {
  getWeatherData();
});
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
  gap: 15px;
}
.card-item {
  align-self: start;
}

.highlight {
  @include Card();
  background: radial-gradient(circle, $main 0%, $grey 100%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-self: start;
  gap: 15px;
  padding: 15px;
}

.error-wrapper {
  flex-grow: 1;
}
</style>
