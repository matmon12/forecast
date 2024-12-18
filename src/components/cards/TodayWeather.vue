<template>
  <div class="summary">
    <div class="summary__header">
      <div class="summary__location">
        <i-carbon:location-filled />
        <p class="summary__location-text">{{ curWeather?.location?.name }}</p>
      </div>
      <div class="summary__degree">
        <SwitchDegree
          :model-value="valueSwitch"
          @toggle-switch="(value) => onChangeDegree(value)"
        />
      </div>
    </div>
    <div class="summary__content">
      <div class="summary__left">
        <div class="summary__date-wrap">
          <p class="summary-week">{{ curDayWeek }}</p>
          <p class="summary-date">{{ currentDate }}</p>
        </div>
        <div class="summary__temp">
          <div class="summary__temp-value">
            {{ curTemp }}
          </div>
          <div class="summary__temp-text">
            <span>High: {{ Math.round(searchStore.maxTemp) }}°</span
            ><span>Low: {{ Math.round(searchStore.minTemp) }}°</span>
          </div>
        </div>
      </div>
      <div class="summary__right">
        <div class="summary__img-wrap">
          <img
            class="summary-img"
            width="200px"
            :src="
              getImageUrl(
                formatPath(props.curWeather?.current?.condition?.icon)
              )
            "
            alt="icon"
          />
        </div>
        <div class="summary__right-info">
          <p class="summary__right-weather">
            {{ curWeather?.current?.condition?.text }}
          </p>
          <p class="summary__right-feels">
            Feels like {{ Math.round(curWeather?.current?.feelslike_c) }}°
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, defineProps } from "vue";
import { getFarTemp, getImageUrl, formatPath } from "@/utils/index";
import { useSearchStore } from "@/stores/search";

const valueSwitch = true;
const currentDate = ref();
const curDayWeek = ref();
const curTemp = ref();
const path = ref();
const searchStore = useSearchStore();

const props = defineProps({
  curWeather: {
    type: Object,
  },
});

watch(
  () => props.curWeather,
  (newValue) => {
    if (newValue) {
      init();
    }
  }
);

onMounted(() => {
  if (props.curWeather) {
    init();
  }
});

const init = () => {
  curTemp.value = valueSwitch
    ? `${Math.round(props.curWeather.current.temp_c)}°C`
    : `${Math.round(getFarTemp(props.curWeather.current.temp_c))}°F`;

  getCurDate(props.curWeather.location.tz_id);
};

const onChangeDegree = (value) => {
  if (value) {
    curTemp.value = `${Math.round(props.curWeather.current.temp_c)}°C`;
  } else {
    curTemp.value = `${Math.round(
      getFarTemp(props.curWeather.current.temp_c)
    )}°F`;
  }
};

const getCurDate = (tz) => {
  const date = new Date();
  currentDate.value = date.toLocaleDateString("en-GB", {
    timeZone: tz,
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  curDayWeek.value = days[date.getDay()];
};
</script>

<style lang="scss" scoped>
@include TodayWeather();
.summary {
  @include Card();
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__location {
    background-color: var(--white-2);
    height: 33px;
    display: flex;
    gap: 5px;
    align-items: center;
    border-radius: 33px;
    padding: 0 20px 0 10px;
    color: #000;
  }

  &__location-text {
    font-weight: 600;
    font-size: 14px;
    line-height: 1;
  }

  &__degree {
    display: flex;
  }

  &__content {
    flex-grow: 1;
    display: flex;
    padding: 20px 0 0;
    justify-content: space-between;
  }

  &__left {
    padding-top: 10px;
  }

  &__date-wrap {
    margin-bottom: 20px;
  }

  &__temp {
  }

  &__temp-value {
    font-size: 70px;
    font-weight: 500;
    line-height: 1.2;
  }

  &__temp-text {
    color: #ffffffc9;
    color: var(--grey-200);
  }

  &__right {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__img-wrap {
    height: 190px;
    max-width: 250px;
    position: relative;
    z-index: 0;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      width: 70%;
      height: 70%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      box-shadow: 0 0 40px 30px var(--shadow-img-1);
      background-color: var(--shadow-img-2);
    }
    // display: flex;
    // justify-content: flex-end;
  }

  &__right-info {
  }

  &__right-weather {
    font-size: 27px;
    line-height: 1.2;
  }

  &__right-feels {
    color: var(--grey-200);
  }
}
.summary-week {
  font-weight: 700;
  font-size: 34px;
}
.summary-date {
  line-height: 1.3;
  color: var(--grey-200);
}
.summary-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
