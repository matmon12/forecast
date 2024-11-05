<template>
  <Spinner v-if="forecastStore.loadingForecast" :size="50" />
  <Error
    v-else-if="searchStore.error === 1006"
    message="Oooops! Nothing found"
    @to-back="onToBack"
    class="error-wrapper"
  />

  <div v-else class="tomorrow">
    <Breadcrumb :model="breadCrumbItems" />

    <div class="tabs">
      <div
        v-for="(item, id) in forecastStore.forecastData?.forecast?.forecastday"
        :key="id"
        :class="['tab', { 'is--cheked': tabActive === id }]"
        @click="tabActive = id"
      >
        <TomorrowDay :forecast-day="item" :data-day="dataDay[id]" />
      </div>
    </div>
    <div class="tabs-wrapper">
      <transition name="tabs">
        <div class="tab-content" v-if="tabActive === 0">
          <TomorrowHour
            :forecast-hour="
              forecastStore.forecastData?.forecast?.forecastday[0].hour
            "
            :forecast-astro="
              forecastStore.forecastData?.forecast?.forecastday[0].astro
            "
            :timezone="forecastStore.forecastData?.location?.tz_id"
          />
        </div>
        <div class="tab-content" v-else-if="tabActive === 1">
          <TomorrowHour
            :forecast-hour="
              forecastStore.forecastData?.forecast?.forecastday[1].hour
            "
            :forecast-astro="
              forecastStore.forecastData?.forecast?.forecastday[1].astro
            "
          />
        </div>
        <div class="tab-content" v-else-if="tabActive === 2">
          <TomorrowHour
            :forecast-hour="
              forecastStore.forecastData?.forecast?.forecastday[2].hour
            "
            :forecast-astro="
              forecastStore.forecastData?.forecast?.forecastday[2].astro
            "
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { FORECAST_URL } from "@/constants/index";
import {axiosApiInstance} from "@/server/api";
import { useSearchStore } from "@/stores/search";
import { useForecastStore } from "@/stores/forecast";

const tabActive = ref(0);
const searchStore = useSearchStore();
const forecastStore = useForecastStore();
const test = [{ test: 0 }, { test: 1 }, { test: 2 }];

const dataDay = ref([{ day: "Today" }, { day: "Tomorrow" }, { day: "" }]);

// breadcrumb
const breadCrumbItems = [
  {
    label: "Forecast",
  },
];

watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      fetchForecastDay();
    }
  }
);

const fetchForecastDay = async () => {
  forecastStore.loadingForecast = true;
  await axiosApiInstance
    .get(`${FORECAST_URL}?q=${searchStore.search}&days=3`)
    .then((res) => {
      forecastStore.forecastData = res.data;
      searchStore.searchSuccess = res.data.location.name;

      // сохранение последнего поиска
      forecastStore.lastSearch = res.data.location.name;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      forecastStore.loadingForecast = false;
    });
};

onMounted(() => {
  if (
    (forecastStore.lastSearch !== searchStore.searchSuccess ||
      !forecastStore.forecastData) &&
    searchStore.error !== 1006
  ) {
    fetchForecastDay();
  }
});

const onToBack = () => {
  searchStore.error = "";
  searchStore.search = searchStore.searchSuccess;
  searchStore.input = searchStore.searchSuccess;
};
</script>

<style lang="scss" scoped>
.tomorrow {
  width: 100%;
}
.tabs {
  display: flex;
  gap: 15px;
}
.tab {
  cursor: pointer;
  background-color: $grey;
  overflow: hidden;
  border-radius: 20px;
  transition: all 0.5s;
}
.is--cheked {
  background-color: #a1a1a170;
}
.tabs-wrapper {
  position: relative;
  width: 100%;
  margin-top: 15px;
  border-radius: 20px;
}
.tab-content {
  width: 100%;
}

.error-wrapper {
  flex-grow: 1;
}
</style>
