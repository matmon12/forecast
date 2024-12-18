<template>
  <div class="hour">
    <div class="hour-wrapper" ref="scrollBox">
      <table class="hour-table" ref="table">
        <tr class="hour-item">
          <td class="hour-title" ref="hourTitle">Time</td>
          <td v-for="(item, id) in forecastHour" :key="id">
            <p class="hour-time">{{ formatTime(item.time) }}</p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Cloudiness</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
          >
            <div
              class="hour-imgwrapper"
              v-tooltip.bottom="{
                escape: false,
                value: `<div class='tooltip-wrapper'><p class='tooltip-hour-text'>${item?.condition?.text}</p>
                <p class='tooltip-hour-chance'>Chance of rain:<span>${item?.chance_of_rain}%</span></p></div>`,
              }"
            >
              <img
                class="hour-img"
                :src="getImageUrl(formatPath(item.condition.icon))"
                alt="icon"
              />
            </div>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Air temperature, °C</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
            v-tooltip.bottom="{
              escape: false,
              value: `${getTextTemp(Math.round(item.temp_c)).text}`,
              pt: {
                arrow: {
                  style: {
                    borderBottomColor: getTextTemp(Math.round(item.temp_c))
                      .backColor,
                    borderTopColor: getTextTemp(Math.round(item.temp_c))
                      .backColor,
                  },
                },
                text: {
                  style: {
                    backgroundColor: getTextTemp(Math.round(item.temp_c))
                      .backColor,
                    color: getTextTemp(Math.round(item.temp_c)).color,
                  },
                },
              },
            }"
          >
            <p
              class="hour-temp"
              :style="{ color: getColorTemp(Math.round(item.temp_c)) }"
            >
              {{ setPlus(item.temp_c) + Math.round(item.temp_c) }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Feeling temperature, °C</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
            v-tooltip.bottom="{
              escape: false,
              value: `${getTextTemp(Math.round(item.feelslike_c)).text}`,
              pt: {
                arrow: {
                  style: {
                    borderBottomColor: getTextTemp(Math.round(item.feelslike_c))
                      .backColor,
                    borderTopColor: getTextTemp(Math.round(item.feelslike_c))
                      .backColor,
                  },
                },
                text: {
                  style: {
                    backgroundColor: getTextTemp(Math.round(item.feelslike_c))
                      .backColor,
                    color: getTextTemp(Math.round(item.feelslike_c)).color,
                  },
                },
              },
            }"
          >
            <p
              class="hour-feel"
              :style="{ color: getColorTemp(Math.round(item.feelslike_c)) }"
            >
              {{ setPlus(item.feelslike_c) + Math.round(item.feelslike_c) }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Wind speed, m/s</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
            v-tooltip.bottom="{
              escape: false,
              value: `<p class='tooltip-hour-wind'>${getTextWind(
                kphToMph(item.wind_kph)
              )} (${kphToMph(item.wind_kph)} m/s)${
                kphToMph(item.gust_kph) > 0
                  ? ', gusts ' + kphToMph(item.gust_kph) + ' m/s'
                  : ''
              }</p>`,
            }"
          >
            <p
              class="hour-wind-spped"
              :style="{ color: getColorWind(kphToMph(item.wind_kph)) }"
            >
              {{ kphToMph(item.wind_kph) }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Gusts of wind, m/s</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
          >
            <p
              class="hour-wind-gusts"
              :style="{ color: getColorWind(kphToMph(item.gust_kph)) }"
            >
              {{ kphToMph(item.gust_kph) }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Direction of the wind</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
            v-tooltip.bottom="{
              escape: false,
              value: `${fullTextDir[item.wind_dir]}`,
            }"
          >
            <i-gravity-ui:arrow-up
              class="hour-dir-arrow"
              :style="{ transform: `rotate(${item.wind_degree + 180}deg)` }"
            />
            <p class="hour-dir-text">{{ item.wind_dir }}</p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Humidity, %</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
            v-tooltip.bottom="{
              escape: false,
              value: `${getTextHumidity(item.humidity)}`,
            }"
          >
            <p
              class="hour-humidity"
              :style="{
                color: getColorHumidity(item.humidity),
                fontWeight: getColorHumidity(item.humidity),
              }"
            >
              {{ item.humidity }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Pressure, mmHg</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="{
              'is--night': item.is_day === 0,
              'is--day': item.is_day === 1,
            }"
          >
            <p
              class="hour-pressure"
              :style="{
                color: getStylePressure(mbToMmHg(item.pressure_mb)),
                fontWeight: getStylePressure(mbToMmHg(item.pressure_mb)),
              }"
            >
              {{ mbToMmHg(item.pressure_mb) }}
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line">
          <td class="hour-title">Precipitation, mm</td>
          <td
            v-for="(item, id) in forecastHour"
            :key="id"
            :class="[
              'hour-precip',
              {
                'is--night': item.is_day === 0,
                'is--day': item.is_day === 1,
                'is--precip-null': totalPrecip(item.precip_mm) === 0,
              },
            ]"
          >
            <p class="hour-precip-text">
              {{
                totalPrecip(item.precip_mm) < 0.1 && item.precip_mm > 0
                  ? "<0.1"
                  : totalPrecip(item.precip_mm)
              }}
            </p>
            <div class="hour-precip-img">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="5">
                <path
                  fill="#427ba9"
                  fill-rule="evenodd"
                  d="M0 1.004s8.245.928 18.75 1c5.825.04 11.794-.108 18.75-1 6.883-.882 12.966-1.033 18.75-1 10.601.062 18.75 1 18.75 1V5H0V1.004Z"
                />
              </svg>
            </div>
            <div
              class="hour-precip-graph"
              :style="{
                height: `${
                  (totalPrecip(item.precip_mm) < 0.1
                    ? 0
                    : totalPrecip(item.precip_mm)) * percent
                }px`,
              }"
            ></div>
          </td>
        </tr>
        <tr class="hour-item hour-line hour-sun">
          <td class="hour-title">Sun: sunrise sunset</td>
          <td class="hour-block">
            <p class="hour-sun-text">
              {{ forecastAstro?.sunrise }}
              <span>{{ forecastAstro?.sunset }}</span>
            </p>
          </td>
        </tr>
        <tr class="hour-item hour-line hour-moon">
          <td class="hour-title">Moon: moonrise moonset</td>
          <td
            class="hour-block"
            v-tooltip.top="{
              escape: false,
              value: `${forecastAstro?.moon_phase}, lighting: ${forecastAstro?.moon_illumination}%`,
            }"
          >
            <p class="hour-moon-text">
              {{ forecastAstro?.moonrise }}
              <span>{{ forecastAstro?.moonset }}</span>
            </p>
            <img
              class="hour-moon-icon"
              :src="getImageUrl(`phase/${forecastAstro?.moon_phase}.svg`)"
              alt="moon"
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted } from "vue";
import {
  getImageUrl,
  formatPath,
  setPlus,
  kphToMph,
  mbToMmHg,
  formatFromAMPM,
} from "@/utils/index";

const scrollBox = ref();
const hourTitle = ref();
const table = ref();
const percent = ref(0);

const fullTextDir = {
  N: "North",
  NNW: "North-North-West",
  NW: "North-West",
  WNW: "West-North-West",
  W: "West",
  WSW: "West-South-West",
  SW: "South-West",
  SSW: "South-South-West",
  S: "South",
  SSE: "South-South-East",
  SE: "South-East",
  ESE: "East-South-East",
  E: "East",
  ENE: "East-North-East",
  NE: "North-East",
  NNE: "North-North-East",
};

const props = defineProps({
  forecastHour: Array,
  forecastAstro: Object,
  timezone: String,
});

watch(
  () => props.forecastHour,
  (newValue) => {
    if (newValue) {
      calcPercent();
    }
  }
);

onMounted(() => {
  if (props.forecastHour) {
    calcPercent();
  }
  // if (props.timezone) {
  //   setScrollTo();
  // }
});

const setScrollTo = () => {
  let date = new Date();
  let localTime = date.toLocaleTimeString("en-GB", {
    timeZone: props.timezone,
    hour: "numeric",
  });

  let widthTotal = table.value.clientWidth;
  let widthFirstColumn = hourTitle.value.offsetWidth;
  let widthHours = widthTotal - widthFirstColumn;
  let widthHour = widthHours / 24;
  setTimeout(() => {
    scrollBox.value.scrollLeft = 60 * Number(localTime) + widthFirstColumn;
  }, 100);
};

const formatTime = (time) => {
  let onlyTime = time.split(" ")[1];
  return onlyTime.startsWith("0") ? onlyTime.slice(1) : onlyTime;
};

const totalPrecip = (precip) => {
  if (precip < 0.1 && precip > 0) {
    return precip;
  }
  return precip.toFixed(1) == 0.0 ? 0 : precip.toFixed(1);
};

const getColorTemp = (temp) => {
  if (temp >= 0 && temp < 27) {
    return "#ff5900";
  } else if (temp >= 27 && temp < 33) {
    return "#fc9801";
  } else if (temp >= 33) {
    return "#fc3319";
  } else if (temp < 0 && temp > -26) {
    return "#2b63a0";
  } else if (temp <= -26 && temp > -40) {
    return "#00ccff";
  } else if (temp <= -40) {
    return "#0099ff";
  }
};

const getColorWind = (wind) => {
  return wind > 10 ? "#ff0000" : "inherit";
};

const getColorHumidity = (humidity) => {
  if (humidity >= 70 && humidity < 91) {
    return ["#fd5901", "400"];
  } else if (humidity >= 91) {
    return ["#fd5901", "600"];
  }
};

const getStylePressure = (pressure) => {
  if (pressure < 739 && pressure > 729) {
    return ["#2b639f", "400"];
  } else if (pressure <= 729) {
    return ["#2b639f", "600"];
  } else if (pressure > 764 && pressure < 770) {
    return ["#fd5901", "400"];
  } else if (pressure >= 770) {
    return ["#fd5901", "600"];
  }
};

const calcPercent = () => {
  let precips = props.forecastHour.map((item) =>
    totalPrecip(item.precip_mm) < 0.1 ? 0 : totalPrecip(item.precip_mm)
  );
  let minPrecips = Math.min(...precips);
  let maxPrecips = Math.max(...precips);

  let heightGraphTotal;
  if (maxPrecips <= 0.5) {
    heightGraphTotal = 5;
  } else if (maxPrecips > 0.5 && maxPrecips < 4) {
    heightGraphTotal = 10;
  } else if (maxPrecips >= 4) {
    heightGraphTotal = 15;
  }

  percent.value = heightGraphTotal / (maxPrecips - minPrecips);
};

const getTextWind = (value) => {
  if (value === 0) {
    return "Calm";
  } else if (value === 1) {
    return "Quiet wind";
  } else if (value === 2 || value === 3) {
    return "Light breeze";
  } else if (value === 4 || value === 5) {
    return "Light wind";
  } else if (value > 5 && value < 10) {
    return "Moderate wind";
  } else if (value >= 10 && value < 14) {
    return "Strong wind";
  } else if (value >= 14) {
    return "Squally wind";
  }
};

const getTextHumidity = (humidity) => {
  if (humidity >= 30 && humidity < 70) {
    return "Comfortable humidity";
  } else if (humidity >= 70 && humidity < 90) {
    return "High humidity";
  } else if (humidity >= 90) {
    return "Very high humidity";
  } else if (humidity < 30 && humidity >= 20) {
    return "Low humidity";
  } else if (humidity < 20) {
    return "Very low humidity";
  }
};

const getTextTemp = (temp) => {
  if (temp >= 27) {
    return { text: "High temperature!", backColor: "#fd9801", color: "#fff" };
  } else if (temp <= -26) {
    return { text: "Severe frost!", backColor: "#00ccff", color: "#fff" };
  } else {
    return { text: "", backColor: "#fff", color: "#000" };
  }
};
</script>

<style lang="scss" scoped>
@include TomorrowHour();
.hour {
  @include Card();
  padding-top: 20px;
  line-height: 1.1;
}
.hour-wrapper {
  border: 1px solid #464646;
  border-radius: 10px;
  width: 100%;
  overflow: auto;
  overflow-x: scroll;
  @include Scroll(10px, 10px, var(--grey-900), var(--grey-350));
}
.hour-table {
  width: max-content;
  display: block;
}
.hour-item {
  display: flex;
  // gap: 10px;
  &:nth-child(1) {
    background-color: var(--grey-800);
  }
}
td {
  min-width: 60px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  // padding: 7px 0;
  display: flex;
  padding: 7px 5px;
  position: relative;
  // border-right: 1px solid #464646;
}
.hour-time {
  font-size: 14px;
  line-height: 1;
  color: var(--grey-100);
  font-weight: 600;
}
.hour-imgwrapper {
  height: 50px;
  max-width: 45px;
  margin: 0 auto;
  // position: relative;
  // z-index: 0;
  // &::after {
  //   content: "";
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   z-index: -1;
  //   width: 1%;
  //   height: 1%;
  //   transform: translate(-50%, -50%);
  //   border-radius: 50%;
  //   box-shadow: 0 0 10px 10px var(--shadow-img-1);
  //   background-color: var(--shadow-img-2);
  // }
}
.hour-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.hour-line {
  border-top: 1px solid #464646;
}
.hour-title {
  font-size: 13px;
  color: var(--grey-100);
  min-width: 140px;
  max-width: 140px;
  text-align: left;
  line-height: 1.2;
  display: block;
  border-right: 1px solid #464646;
  padding: 7px 5px;
  background-color: var(--grey-800);
}
.hour-temp {
  font-weight: 700;
}
.hour-feel {
}
.hour-wind-spped {
  color: var(--white);
}
.hour-wind-gusts {
}
.hour-dir-arrow {
  color: var(--white);
}
.hour-dir-text {
  font-size: 13px;
  color: var(--grey-300);
}
.hour-humidity {
  color: var(--white);
}
.hour-pressure {
  color: var(--white);
}
.hour-precip {
  justify-content: flex-end;
  padding: 7px 0 0;
  gap: 0;
  &:is(.is--precip-null) {
    padding-bottom: 2px;
    .hour-precip-graph {
      display: none;
    }
    .hour-precip-img{
      display: none;
    }
    .hour-precip-text {
      color: var(--grey-100);
    }
  }
}
.hour-precip-text {
  font-size: 14px;
  color: var(--blue-200);
}
.hour-precip-img {
  display: flex;
  height: 5px;
  path{
    fill: var(--blue-500);
  }
}
.hour-precip-graph {
  height: 1px;
  width: 100%;
  background-color: var(--blue-500);
}
.hour-moon-text,
.hour-sun-text {
  display: flex;
  gap: 15px;
  span {
    color: #9c9c9c;
    color: var(--grey-100);
  }
}
.hour-moon-icon {
  width: 35px;
  margin-top: 2px;
  filter: brightness(var(--brightness-phase));
}
.hour-moon {
  height: 75px;
}
.hour-sun {
  height: 30px;
}
.hour-block {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.is--night {
  background-color: var(--blue-800);
}
.is--day {
  background-color: var(--blue-700);
}
</style>

<style lang="scss">
.p-tooltip {
  position: absolute;
  padding: 0.25em 0.35rem;
  max-width: 12.5rem;
}
.p-tooltip .p-tooltip-text {
  background: #fff;
  color: #000;
  padding: 7px 8px;
  box-shadow: 0 0 10px #000;
  border-radius: 6px;
  font-weight: 400;
  line-height: 1.1;
}
.p-tooltip .p-tooltip-text {
  font-size: 12px;
}
.p-tooltip.p-tooltip-bottom .p-tooltip-arrow {
  border-bottom-color: #fff;
}
.p-tooltip.p-tooltip-top .p-tooltip-arrow {
  border-top-color: #fff;
}

.tooltip-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.tooltip-hour-text {
  font-weight: 700;
  font-size: 13px;
  line-height: 1.1;
}
.tooltip-hour-chance {
  display: flex;
  gap: 5px;
  span {
    font-weight: 600;
  }
}
</style>
