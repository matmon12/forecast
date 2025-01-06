<template>
  <Spinner v-if="forecastStore.loadingForecast" :size="50" />
  <Error
    v-else-if="searchStore.error === 1006"
    :message="$t('errors.nothing_found')"
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
      <div v-for="item in [0, 1, 2]" :key="item" class="tab-content">
        <TomorrowHour
          v-if="tabActive === item"
          :forecast-hour="
            forecastStore.forecastData?.forecast?.forecastday[item].hour
          "
          :forecast-astro="
            forecastStore.forecastData?.forecast?.forecastday[item].astro
          "
          :timezone="forecastStore.forecastData?.location?.tz_id"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { FORECAST_URL } from "@/constants/index";
import { axiosApiInstance } from "@/server/api";
import { useSearchStore } from "@/stores/search";
import { useForecastStore } from "@/stores/forecast";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const t = inject("t");
const { locale } = useI18n();
const tabActive = ref(0);
const searchStore = useSearchStore();
const forecastStore = useForecastStore();
const test = [{ test: 0 }, { test: 1 }, { test: 2 }];

const dataDay = computed(() => [
  { day: t("tomorrow.today") },
  { day: t("tomorrow.tomorrow") },
  { day: "" },
]);

// breadcrumb
const breadCrumbItems = computed(() => [
  {
    label: t("breadcrumb.forecast"),
  },
]);

watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      fetchForecastDay();
    }
  }
);

// при изменении локали получить описание на этом языке
watch(
  () => locale.value,
  (newValue) => {
    fetchForecastDay();
  }
);

const fetchForecastDay = async () => {
  forecastStore.loadingForecast = true;
  await axiosApiInstance
    .get(`${FORECAST_URL}?q=${searchStore.search}&days=3&lang=${locale.value}`)
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
@include Tomorrow();
.tomorrow {
  width: 100%;
}
.tabs {
  display: flex;
  gap: 15px;
}
.tab {
  cursor: pointer;
  background-color: var(--grey);
  overflow: hidden;
  border-radius: 20px;
  transition: all 0.5s;
}
.is--cheked {
  background-color: var(--grey-400);
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
