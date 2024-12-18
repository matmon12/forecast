<template>
  <div class="tomorrow-day">
    <div class="tomorrow-day-left">
      <div class="tomorrow-day-top">
        <div class="tomorrow-day-title">{{ dateDay }}</div>
        <div class="tomorrow-day-subtitle">{{ dataDay.day }}</div>
      </div>
      <div class="tomorrow-day-footer">
        <div class="tomorrow-day-box">
          <div
            class="tomorrow-day-temp-block"
            :style="{
              backgroundColor: getColor(props.forecastDay?.day?.mintemp_c)
                .colorBack,
              borderColor: getColor(props.forecastDay?.day?.mintemp_c)
                .colorBorder,
            }"
          >
            <span>{{
              setPlus(props.forecastDay.day.mintemp_c) +
              Math.round(props.forecastDay?.day?.mintemp_c)
            }}</span>
          </div>
          <div
            class="tomorrow-day-temp-block"
            :style="{
              backgroundColor: getColor(props.forecastDay?.day?.maxtemp_c)
                .colorBack,
              borderColor: getColor(props.forecastDay?.day?.maxtemp_c)
                .colorBorder,
            }"
          >
            <span>{{
              setPlus(props.forecastDay.day.mintemp_c) +
              Math.round(props.forecastDay?.day?.maxtemp_c)
            }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="tomorrow-day-right">
      <div class="tomorrow-day-imgwrapper">
        <img
          class="tomorrow-day-img"
          :src="getImageUrl(formatPath(props.forecastDay.day.condition.icon))"
          alt="icon"
        />
      </div>
      <div class="tomorrow-day-precip">
        {{ totalPrecip }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, computed, watch } from "vue";
import { getImageUrl, formatPath, setPlus } from "@/utils/index";

const props = defineProps({
  forecastDay: Object,
  dataDay: Object,
});

const path = ref();
const dateDay = ref();
const totalPrecip = computed(() =>
  props.forecastDay?.day?.totalprecip_mm.toFixed(1) == 0.0
    ? ""
    : `${props.forecastDay?.day?.totalprecip_mm.toFixed(1)} mm`
);

const getColor = (value) => {
  var colorBack;
  var colorBorder;

  if (value < 0 && value >= -10) {
    colorBack = "#caeffe";
    colorBorder = "#00b7ff";
  } else if (value < -10 && value >= -20) {
    colorBack = "#a7c8fd";
    colorBorder = "#0a68ff";
  } else if (value < -20 && value >= -30) {
    colorBack = "#89a9ff";
    colorBorder = "#0042f9";
  } else if (value < -30 && value >= -35) {
    colorBack = "#baa6fd";
    colorBorder = "#6a00ff";
  } else if (value < -35) {
    colorBack = "#c898ff";
    colorBorder = "#9900ff";
  } else if (value >= 0 && value < 13) {
    colorBack = "#e0ffc7";
    colorBorder = "#60d500";
  } else if (value >= 13 && value < 20) {
    colorBack = "#e9ffae";
    colorBorder = "#9ed700";
  } else if (value >= 20 && value < 30) {
    colorBack = "#fedf9d";
    colorBorder = "#ffae00";
  } else if (value >= 30 && value < 35) {
    colorBack = "#fdc1af";
    colorBorder = "#fa3a00";
  } else if (value >= 35) {
    colorBack = "#ffa68b";
    colorBorder = "#de3400";
  }

  return { colorBack, colorBorder };
};

onMounted(() => {
  if (props.forecastDay) {
    init();
  }
});

watch(
  () => props.forecastDay,
  (newValue) => {
    if (newValue) {
      init();
    }
  }
);

const init = () => {
  getDate();
};

const getDate = () => {
  const originDate = props.forecastDay.date;
  const date = new Date(originDate);
  dateDay.value = date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};
</script>

<style lang="scss" scoped>
@include TomorrowDay();
.tomorrow-day {
  border-radius: 20px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 260px;
  height: 100%;
}

.tomorrow-day-left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tomorrow-day-top {
}
.tomorrow-day-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 1;
  margin-bottom: 3px;
}
.tomorrow-day-subtitle {
  color: var(--grey-300);
  font-size: 14px;
  line-height: 1.1;
}
.tomorrow-day-footer {
}
.tomorrow-day-box {
  display: flex;
  height: 40px;
}
.tomorrow-day-temp-block {
  height: 28px;
  width: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid;
  border-radius: 5px;
  box-shadow: 0 0 10px #ffffff77;
  &:nth-child(1) {
    align-self: flex-end;
    z-index: 10;
  }
  &:nth-child(2) {
  }
  span {
    color: #000;
    font-weight: 500;
    font-size: 20px;
  }
}
.tomorrow-day-right {
}
.tomorrow-day-imgwrapper {
  height: 70px;
  max-width: 70px;
  position: relative;
  z-index: 0;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: -1;
    width: 30%;
    height: 30%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: 0 0 20px 20px var(--shadow-img-1);
    background-color: var(--shadow-img-2);
  }
}
.tomorrow-day-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.tomorrow-day-precip {
  text-align: center;
  font-size: 16px;
  //   font-weight: 500;
  line-height: 1;
  color: var(--blue-300);
  margin-top: 5px;
}
</style>
