<template>
  <div ref="container" class="card-container">
    <div
      v-if="settingStore.isDraggable && authStore.user"
      class="card-mask"
    ></div>
    <div v-if="settingStore.isDraggable && authStore.user" class="card-header">
      <div class="container">
        <button @click="saveSlotItemMap()" class="card-btn">
          <i-svg-spinners-180-ring v-if="loading" />
          <i-mingcute-check-fill v-else />
        </button>
      </div>
    </div>

    <Spinner
      v-if="searchStore.loading || searchStore.astroLoading"
      :size="50"
    />

    <Error
      v-else-if="searchStore.error === 1006"
      @to-back="onToBack"
      :message="$t('errors.nothing_found')"
      class="error-wrapper"
    />

    <div
      :class="[
        'home',
        { 'is-draggable': settingStore.isDraggable && authStore.user },
      ]"
      v-else
    >
      <div
        v-for="{ slotId, itemId, item } in slottedItems"
        :key="slotId"
        class="card-slot"
        :data-swapy-slot="slotId"
      >
        <div class="card-item" :key="itemId" :data-swapy-item="itemId">
          <div
            v-if="
              !isMobileAndTablet && settingStore.isDraggable && authStore.user
            "
            class="card-handle"
          >
            <i-icon-park-outline-drag />
          </div>
          <TodayWeather
            v-if="item.title === 'today'"
            v-bind:data-swapy-no-drag="!isMobileAndTablet ? true : undefined"
            :cur-weather="searchStore.curWeather"
            :class="{
              'is-high':
                (settingStore.slotItemMap[1].item === '1' &&
                  settingStore.slotItemMap[3].item === '4') ||
                (settingStore.slotItemMap[1].item === '1' &&
                  settingStore.slotItemMap[3].item === '3') ||
                (settingStore.slotItemMap[2].item === '1' &&
                  settingStore.slotItemMap[3].item === '2'),
              'is-draggable': settingStore.isDraggable && authStore.user,
            }"
          />
          <div
            v-if="item.title === 'highlight'"
            v-bind:data-swapy-no-drag="!isMobileAndTablet ? true : undefined"
            :class="[
              'highlight',
              { 'is-draggable': settingStore.isDraggable && authStore.user },
            ]"
          >
            <UvIndex :uv-index="searchStore.curWeather?.current?.uv" />
            <Humidity :humidity="searchStore.curWeather?.current?.humidity" />
            <Wind
              :speed="searchStore.curWeather?.current?.wind_kph"
              :degree="searchStore.curWeather?.current?.wind_degree"
              :dir="searchStore.curWeather?.current?.wind_dir"
            />
            <Pressure
              :pressure="searchStore.curWeather?.current?.pressure_mb"
            />
          </div>
          <Sunset
            v-if="item.title === 'sun'"
            v-bind:data-swapy-no-drag="!isMobileAndTablet ? true : undefined"
            :astro-info="searchStore.astroInfo"
            :class="[
              'sunset-wrap',
              {
                'is-high':
                  (settingStore.slotItemMap[1].item === '3' &&
                    settingStore.slotItemMap[0].item === '2') ||
                  (settingStore.slotItemMap[1].item === '3' &&
                    settingStore.slotItemMap[2].item === '2') ||
                  (settingStore.slotItemMap[2].item === '3' &&
                    settingStore.slotItemMap[3].item === '2') ||
                  (settingStore.slotItemMap[2].item === '3' &&
                    settingStore.slotItemMap[3].item === '1'),
                'is-draggable': settingStore.isDraggable && authStore.user,
              },
            ]"
          />
          <Moon
            v-if="item.title === 'moon'"
            v-bind:data-swapy-no-drag="!isMobileAndTablet ? true : undefined"
            :astro-info="searchStore.astroInfo"
            :class="[
              'moon-wrap',
              {
                'is-high':
                  (settingStore.slotItemMap[2].item === '4' &&
                    settingStore.slotItemMap[3].item === '2') ||
                  (settingStore.slotItemMap[2].item === '4' &&
                    settingStore.slotItemMap[3].item === '1') ||
                  (settingStore.slotItemMap[1].item === '4' &&
                    settingStore.slotItemMap[0].item === '1') ||
                  (settingStore.slotItemMap[1].item === '4' &&
                    settingStore.slotItemMap[0].item === '2') ||
                  (settingStore.slotItemMap[1].item === '4' &&
                    settingStore.slotItemMap[3].item === '1'),
                'is-draggable': settingStore.isDraggable && authStore.user,
              },
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted, computed, inject } from "vue";
import { useSearchStore } from "@/stores/search";
import { axiosApiInstance } from "@/server/api";
import { CURRENT_URL, ASTRO_URL, FORECAST_URL } from "../constants/index";
import { useI18n } from "vue-i18n";
import { createSwapy, utils } from "swapy";
import { isMobileAndTablet } from "@/utils";
import { useVibrate } from "@vueuse/core";
import { useSettingStore } from "@/stores/setting";
import { updateToDB } from "@/server/users";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "primevue/usetoast";
import router from "@/router/router";
import { onBeforeRouteLeave } from "vue-router";

const searchStore = useSearchStore();
const settingStore = useSettingStore();
const authStore = useAuthStore();
const toast = useToast();
const { locale } = useI18n({});
const t = inject("t");

const swapy = ref(null);
const container = ref();
const loading = ref(false);

const slottedItems = computed(() =>
  utils.toSlottedItems(settingStore.cards, "id", settingStore.slotItemMap)
);

const { vibrate, isSupported } = useVibrate({ pattern: [100] });

// при вводе другого города
watch(
  () => searchStore.search,
  (newValue) => {
    if (newValue) {
      getData().then(() => {
        swapy.value?.update();
      });
    }
  }
);

// при изменении локали получить описание на этом языке
watch(
  () => locale.value,
  (newValue) => {
    getWeatherData().then(() => {
      swapy.value?.update();
    });
  }
);

// при включении / выключении режима перетаскивания
watch(
  () => settingStore.isDraggable,
  (newValue) => {
    swapy.value?.enable(newValue);
  }
);

// отключать при выходе
watch(
  () => authStore.user,
  (newValue) => {
    swapy.value?.enable(false);
    settingStore.isDraggable = false;
  }
);

// при несохранненых изменениях
onBeforeRouteLeave((to, from) => {
  if (settingStore.isDraggable) {
    const answer = window.confirm(t("dashboard.confirm"));

    if (answer) {
      settingStore.isDraggable = false;
    } else {
      return false;
    }
  }
});

const getWeatherData = async () => {
  searchStore.loading = true;
  await axiosApiInstance
    .get(`${CURRENT_URL}?q=${searchStore.search}&lang=${locale.value}`)
    .then((res) => {
      searchStore.curWeather = res.data;
      searchStore.searchSuccess = searchStore.curWeather.location.name;

      // сохранение последнего поиска
      searchStore.lastSearch = searchStore.curWeather.location.name;
    })
    .catch((err) => {
      console.error(err);
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
      console.error(err);
    })
    .finally(() => {
      searchStore.astroLoading = false;
    });
};

const getMinMax = async () => {
  await axiosApiInstance
    .get(`${FORECAST_URL}?q=${searchStore.search}&days=1`)
    .then((res) => {
      searchStore.maxTemp = res.data.forecast.forecastday[0].day.maxtemp_c;
      searchStore.minTemp = res.data.forecast.forecastday[0].day.mintemp_c;
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {});
};

const onToBack = () => {
  searchStore.error = "";
  searchStore.search = searchStore.searchSuccess;
  searchStore.input = searchStore.searchSuccess;
};

const getData = async () => {
  await getWeatherData().then(() => {
    getMinMax();
  });
  await fetchAstroData();
};

const initSwapy = () => {
  if (container.value) {
    swapy.value = createSwapy(container.value, {
      enabled: settingStore.isDraggable,
      dragOnHold: isMobileAndTablet ? true : false,
      manualSwap: true,
      autoScrollOnDrag: true,
      dragAxis: isMobileAndTablet ? "y" : "both",
      swapMode: isMobileAndTablet ? "drop" : "hover",
    });

    swapy.value.onSwap((event) => {
      requestAnimationFrame(() => {
        settingStore.slotItemMap = event.newSlotItemMap.asArray;
      });
    });

    // vibration
    swapy.value.onSwapStart(() => {
      if (isSupported && isMobileAndTablet) {
        vibrate();
      }
    });
  }
};

const saveSlotItemMap = async () => {
  loading.value = true;

  const updatedField = {
    order: JSON.stringify([
      ...settingStore.slotItemMap.map((item) => ({ ...item })),
    ]),
  };

  try {
    await updateToDB(authStore.uid, updatedField);

    toast.add({
      severity: "success",
      summary: t("success.successfully"),
      detail: t("success.order.save"),
      life: 3000,
    });

    settingStore.isDraggable = false;
    router.push({ name: "SettingUser" });
  } catch (err) {
    const messageError = JSON.parse(err.message);
    toast.add({
      severity: "error",
      summary: t("errors.order.save"),
      detail: `${t(`errors.process.${messageError.process}`)} ${t(
        `error_codes.${messageError.description}`
      )}`,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (
    (searchStore.searchSuccess !== searchStore.lastSearch ||
      !searchStore.curWeather) &&
    searchStore.error !== 1006
  ) {
    await getData();
  }

  initSwapy();
});

onUnmounted(() => {
  swapy.value?.destroy();
});
</script>

<style scoped lang="scss">
@include Home();
.home {
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  position: relative;
  gap: 15px;

  &.is-draggable {
    z-index: 1510;
  }
}

.card-mask {
  position: fixed;
  left: 0;
  top: 0;
  background-color: #00000098;
  width: 100%;
  height: 100%;
  z-index: 1500;
}

.card-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1520;
  padding: 15px 0;
  pointer-events: none;
}

.card-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  line-height: 1;
  border-radius: 7px;
  width: 60px;
  height: 60px;
  color: #000;
  font-size: 24px;
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s, filter 0.3s;
  background-color: var(--blue-80);
  margin-left: auto;
  pointer-events: all;
  box-shadow: 0 0 15px #000;

  &:not(:disabled):hover {
    filter: brightness(1.2);
  }
}

.card-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  position: relative;
}

.card-slot {
  &:nth-child(1) {
    grid-row-start: 1;
    grid-row-end: 20;
  }
  &:nth-child(2) {
    grid-row-start: 1;
    grid-row-end: 23;
  }
  &:nth-child(3) {
    grid-row-start: 20;
    grid-row-end: 40;
  }
  &:nth-child(4) {
    grid-row-start: 23;
    grid-row-end: 40;
  }
  &[data-swapy-highlighted] {
    background-color: var(--grey-880);
    border-radius: 20px;
  }
}

.card-item {
  position: relative;
  height: 100%;
  &[data-swapy-dragging] {
    opacity: 0.8;
  }
}

.summary,
.highlight,
.sunset-wrap,
.moon-wrap {
  height: 100%;
  &.is-draggable {
    border: 2px dashed var(--blue-2);
  }
}

.card-handle {
  position: absolute;
  left: 15px;
  top: 15px;
  background-color: #fff;
  color: #000;
  border-radius: 7px;
  font-size: 20px;
  display: flex;
  padding: 10px 5px;
  cursor: grab;
  box-shadow: 0 0 10px #000;
  transition: transform 0.2s;
}

.highlight {
  @include Card();
  background: radial-gradient(circle, var(--main) 0%, var(--grey) 100%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 15px;
}

.error-wrapper {
  flex-grow: 1;
}
</style>
