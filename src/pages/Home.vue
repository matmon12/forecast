<template>
  <div class="home" v-if="searchStore.error !== 1006">
    <TodayWeather class="card-item" :cur-weather="curWeather" />
    <Spinner v-if="searchStore.loading" />
  </div>
  <Error class="error-wrapper" v-else/>
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
}
.card-item {
}

.error-wrapper {
  flex-grow: 1;
}
</style>
