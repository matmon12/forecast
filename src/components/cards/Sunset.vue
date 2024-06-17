<template>
  <div class="sun">
    <div class="sun-content">
      <p class="sun-title">
        <i-ph:sun-horizon />
        Sunset / sunrise
      </p>
      <div class="sun-graphik-wrap">
        <div class="sun-graphik">
          <Knob
            :min="min"
            :max="max"
            :model-value="currentTime"
            :color-point="'#ffaa00'"
            :colors-line="['#fbdb66a3']"
            :stroke-width="10"
            :size-point="40"
            :color-back="'#404040'"
            :width="250"
            :icon="PhSunFill"
          />
          <div class="sun-currenttime-wrap">
            <h6 class="sun-currenttime-title">Current time</h6>
            <div class="sun-currenttime">
              {{ currentTimeHour[0] }} <span>{{ currentTimeHour[1] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sun__aside">
      <div class="sun__aside-item">
        <h6 class="sun__aside-title">Sunrise</h6>
        <p class="sun__aside-text">
          {{ sunrise[0] }}<span>{{ sunrise[1] }}</span>
        </p>
      </div>
      <div class="sun__aside-item">
        <h6 class="sun__aside-title">Sunset</h6>
        <p class="sun__aside-text">
          {{ sunset[0] }}<span>{{ sunset[1] }}</span>
        </p>
      </div>
      <div class="sun__aside-item sun-length">
        <h6 class="sun__aside-title">Length of day</h6>
        <p class="sun__aside-text">{{ lengthDay }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, defineProps } from "vue";
import axiosApiInstance from "@/api";
import { useSearchStore } from "@/stores/search";
import { formattedTime, formatFromAMPM } from "@/utils/index";
import PhSunFill from "~icons/ph/sun-fill";

const searchStore = useSearchStore();

const min = ref();
const max = ref();
const currentTime = ref();
const lengthDay = ref();
const currentTimeHour = ref([]);
const sunrise = ref([]);
const sunset = ref([]);

const props = defineProps({
  astroInfo: {
    type: Object,
  },
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
  sunrise.value = formattedTime(props.astroInfo.astronomy.astro.sunrise);
  sunset.value = formattedTime(props.astroInfo.astronomy.astro.sunset);

  min.value = timeToMinutes(
    formatFromAMPM(props.astroInfo.astronomy.astro.sunrise)
  );
  max.value = timeToMinutes(
    formatFromAMPM(props.astroInfo.astronomy.astro.sunset)
  );
  currentTime.value = timeToMinutes(
    formatFromAMPM(getLocalTime(props.astroInfo.location.tz_id))
  );

  checkCurrentTime();
  getDayLength(
    props.astroInfo.astronomy.astro.sunrise,
    props.astroInfo.astronomy.astro.sunset
  );
};

const checkCurrentTime = () => {
  if (currentTime.value < min.value) {
    currentTime.value = min.value;
  }
  if (currentTime.value > max.value) {
    currentTime.value = max.value;
  }
};

const getDayLength = (firstTime, secondTime) => {
  let timeSunrise = formatFromAMPM(firstTime);
  let timeSunset = formatFromAMPM(secondTime);

  let different = getDate(timeSunset) - getDate(timeSunrise);

  let differentDate = new Date(different).toLocaleTimeString("ru-RU", {
    timeZone: "Atlantic/Reykjavik",
    hour: "numeric",
    minute: "numeric",
  });

  lengthDay.value = `${Number(differentDate.split(":")[0])}h ${Number(
    differentDate.split(":")[1]
  )}m`;
};

const getDate = (string) => {
  return new Date(0, 0, 0, string.split(":")[0], string.split(":")[1]);
};

const timeToMinutes = (time) => {
  return Number(time.split(":")[0]) * 60 + Number(time.split(":")[1]);
};

const getLocalTime = (timeZone) => {
  var timeNow = Date.now();
  let localTime = new Date(timeNow).toLocaleTimeString("ru-RU", {
    timeZone: timeZone,
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
  });
  currentTimeHour.value = [localTime.slice(0, -2), localTime.slice(-2)];

  return localTime;
};

onMounted(() => {
  // fetchAstroData();
});
</script>

<style lang="scss" scoped>
.sun {
  @include Card();
  display: flex;
  justify-content: space-between;
  gap: 20px;
  &-title {
    display: flex;
    align-items: center;
    gap: 7px;
    // margin-bottom: 20px;
    svg {
      font-size: 20px;
    }
  }
}
.sun-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.sun-graphik-wrap {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sun-graphik {
  position: relative;
}
.sun__aside {
  height: 100%;
  width: 140px;
  background-color: #2d313aaf;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 0 10px #00000035;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.sun__aside-item {
}
.sun__aside-title {
  color: #aeaeae;
  font-size: 17px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 8px;
  line-height: 1.15;
}
.sun__aside-text {
  line-height: 1;
  font-size: 30px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  span {
    color: #929292;
    font-size: 17px;
    font-weight: 500;
  }
}
.sun-length {
  .sun__aside-text {
    font-size: 21px;
    font-weight: 400;
  }
}
.sun-currenttime {
  font-size: 35px;
  font-weight: 500;
  display: flex;
  align-items: flex-end;
  line-height: 1;
  gap: 8px;
  &-wrap {
    position: absolute;
    left: 50%;
    top: 75%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &-title {
    color: #c1c1c1;
  }
  span {
    font-size: 20px;
    color: #a4a4a4;
  }
}
.sun-icons {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  svg {
    color: #ffaa00;
    font-size: 30px;
    &:nth-child(1) {
      transform: translateX(calc(-50% + 5px));
    }
    &:nth-child(2) {
      transform: translateX(calc(50% - 5px));
    }
  }
}
</style>
