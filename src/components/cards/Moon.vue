<template>
  <div class="moon">
    <div class="moon__left">
      <p class="moon-title">
        <i-solar:moon-stars-outline />
        Lunar phase
      </p>
      <div class="moon__content">
        <div class="moon-picture">
          <div class="moon-img-wrap">
            <img class="moon-img" src="@/img/moon.png" alt="moon" />
            <div
              class="moon-shadow"
              :style="{ left: `${illumination}%` }"
            ></div>
          </div>
        </div>
        <div class="moon__info">
          <div class="moon__info-top">
            <p class="moon__info-phase">{{ phase }}</p>
          </div>
          <div class="moon__info-bottom">
            Full Moon - {{ moonFullDate[1] }} {{ moonFullDate[0].getDate() }}, in
            {{ timeLeft }} days
          </div>
        </div>
      </div>
    </div>
    <div class="moon__aside">
      <div class="moon__aside-item">
        <h6 class="moon__aside-title">Moonrise</h6>
        <p class="moon__aside-text">
          {{ moonrise[0] }}<span>{{ moonrise[1] }}</span>
        </p>
      </div>
      <div class="moon__aside-item">
        <h6 class="moon__aside-title">Moonset</h6>
        <p class="moon__aside-text">
          {{ moonset[0] }}<span>{{ moonset[1] }}</span>
        </p>
      </div>
      <div class="moon__aside-item">
        <h6 class="moon__aside-title">Light</h6>
        <p class="moon__aside-text">{{ illumPercent }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, inject, onMounted, computed } from "vue";
import { formattedTime } from "@/utils/index";
import { moonposition, moon, base, moonphase } from "astronomia";

const { anime } = inject("plugins");

const illumination = ref(0);
const illumPercent = ref(0);
const phase = ref();
const moonrise = ref([]);
const moonset = ref([]);
const moonFullDate = ref([]);

const currentDate = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const timeLeft = computed(() => new Date(moonFullDate.value[0] - currentDate).getDate());

function convertToDecimalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const decimalDate = year + (month - 1) / 12 + (day - 1) / 365;
  return decimalDate;
}

function convertJDEToNextFullMoon(jde) {
  const Z = Math.floor(jde + 0.5);
  const F = jde + 0.5 - Z;
  let A, alpha, B, C, D, E, year, month, day;

  if (Z < 2299161) {
    A = Z;
  } else {
    alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  B = A + 1524;
  C = Math.floor((B - 122.1) / 365.25);
  D = Math.floor(365.25 * C);
  E = Math.floor((B - D) / 30.6001);

  day = Math.floor(B - D - Math.floor(30.6001 * E) + F);
  month = E < 14 ? E - 1 : E - 13;
  year = month > 2 ? C - 4716 : C - 4715;

  // Создаем дату следующего полнолуния
  let curFullMoonDate = new Date(year, month - 1, day);
  if (curFullMoonDate < currentDate) {
    curFullMoonDate.setDate(curFullMoonDate.getDate() + 29);

    let nextFullMoonDate = moonphase.full(
      convertToDecimalDate(curFullMoonDate)
    );
    return convertJDEToNextFullMoon(nextFullMoonDate);
  } else {
    return new Date(year, month - 1, day);
  }
}

const decimalDate = convertToDecimalDate(currentDate);
const jde = moonphase.full(decimalDate);
const date = convertJDEToNextFullMoon(jde);
moonFullDate.value = [date, months[date.getMonth()]];

const props = defineProps({
  astroInfo: Object,
});

watch(
  () => props.astroInfo,
  (data) => {
    if (data) {
      init();
    }
  }
);

onMounted(() => {
  if (props.astroInfo) {
    init();
  }
});

const init = () => {
  illumPercent.value = props.astroInfo.astronomy.astro.moon_illumination;
  phase.value = props.astroInfo.astronomy.astro.moon_phase;
  moonrise.value = /\d/.test(props.astroInfo.astronomy.astro.moonrise)
    ? formattedTime(props.astroInfo.astronomy.astro.moonrise)
    : ["—", ""];
  moonset.value = /\d/.test(props.astroInfo.astronomy.astro.moonset)
    ? formattedTime(props.astroInfo.astronomy.astro.moonset)
    : ["—", ""];

  anime({
    targets: illumination,
    value: props.astroInfo.astronomy.astro.moon_illumination,
    easing: "linear",
    duration: 500,
  });
};
</script>

<style lang="scss" scoped>
.moon {
  @include Card();
  display: flex;
  gap: 20px;
  &-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    svg {
      font-size: 20px;
    }
  }
}
.moon__left {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.moon-picture {
  display: flex;
  align-items: center;
  margin: 0 25px 0 0px;
}
.moon-img-wrap {
  width: 140px;
  height: 140px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 20px #c9f4ff5b;
}
img {
  width: 100%;
}
.moon-shadow {
  background-color: #242424c2;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
}
.moon__content {
  display: flex;
  flex-grow: 1;
}
.moon__info {
  flex-grow: 1;
}
.moon__aside {
  height: 100%;
  min-width: 125px;
  background-color: #2d313aaf;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 0 10px #00000035;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.moon__aside-item {
}
.moon__aside-title {
  color: #aeaeae;
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 5px;
  line-height: 1.15;
}
.moon__aside-text {
  line-height: 1;
  font-size: 25px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  span {
    color: #929292;
    font-size: 15px;
    font-weight: 500;
  }
}
.moon__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
}
.moon__info-top {
}
.moon__info-illum {
  font-size: 20px;
  font-weight: 500;
}
.moon__info-phase {
  color: #87e8fa;
  line-height: 1.1;
  font-size: 25px;
}
.moon__info-bottom {
  font-size: 12px;
  line-height: 1.2;
}
</style>
