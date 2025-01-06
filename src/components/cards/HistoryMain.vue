<template>
  <div class="history-main">
    <div class="history__header">
      <div class="history__header-left">
        <p class="history-subtitle">{{ $t("history-main.subtitle") }}</p>
        <h1 class="history-title">{{ $t("history-main.title") }}</h1>
      </div>
      <div class="history__header-right">
        <SelectButton
          :value="valueHour"
          :options="optionsHour"
          :color-btn="'var(--blue-150)'"
          :colorBack="'var(--grey-400)'"
          :color-text="'var(--grey-200)'"
          @toggle-select="
            (category) => {
              valueHour = category;
              weatherToday ? init() : null;
            }
          "
        />
      </div>
    </div>
    <div class="history-main-graph">
      <Line :data="dataToday" :options="optionsToday" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, computed, onMounted, inject } from "vue";
import { Line } from "vue-chartjs";
import { useHistoryStore } from "@/stores/history";
import { useUiStore } from "@/stores/ui";

const historyStore = useHistoryStore();
const uiStore = useUiStore();
const t = inject("t");

const todayData = ref([]);
const min = ref(0);
const max = ref(50);
const stepSize = ref(5);

const valueHour = ref("temp_c");
const optionsHour = computed(() => [
  {
    name: t("history-main.options.temp.name"),
    value: "temp_c",
    measurement: "°С",
  },
  {
    name: t("history-main.options.humidity.name"),
    value: "humidity",
    measurement: "%",
  },
  {
    name: t("history-main.options.precip.name"),
    value: "precip_mm",
    measurement: t("history-main.options.precip.measurement"),
  },
]);

// ui настройки графика
const pointRadius = ref(4);
const pointHoverRadius = ref(7);
const borderWidth = ref(2);
const ticksFontSize = ref(14);
const ticksPadding = ref(10);
const titleFont = ref(13);
const titleMarginBottom = ref(5);
const bodyFont = ref(13);

const props = defineProps({
  weatherToday: Array,
});

watch(
  () => props.weatherToday,
  (newValue) => {
    if (newValue) {
      init();
    }
  }
);

onMounted(() => {
  if (props.weatherToday) {
    init();
  }
});

const init = () => {
  todayData.value = props.weatherToday.map((item) => {
    if (valueHour.value === "precip_mm") {
      return item[valueHour.value].toFixed(1);
    } else {
      return Math.round(item[valueHour.value]);
    }
  });
  min.value = Math.min(...todayData.value);
  max.value = Math.max(...todayData.value);
  let difStep = min.value - max.value;
  stepSize.value = getStep(difStep);
};

const getStep = (value) => {
  if (value <= 10) {
    return 1;
  } else if (value > 10 && value <= 20) {
    return 2;
  } else if (value > 20 && value <= 30) {
    return 5;
  } else if (value > 30) {
    return 10;
  }
};

const dataToday = computed(() => {
  let colorGradient = "#6b98c6";
  let colorBorder = "#3299ff";

  // разрешение экрана
  if (uiStore.smSmaller) {
    pointRadius.value = 3;
    pointHoverRadius.value = 4;
    borderWidth.value = 1;
  } else {
    pointRadius.value = 4;
    pointHoverRadius.value = 7;
    borderWidth.value = 2;
  }

  // theme
  if (!uiStore.theme) {
    colorGradient = "#18436e";
    colorBorder = "#022e5a";
  }

  return {
    labels: [
      "0:00",
      "1:00",
      "2:00",
      "3:00",
      "4:00",
      "5:00",
      "6:00",
      "7:00",
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ],
    datasets: [
      {
        label: optionsHour.value.find((item) => item.value === valueHour.value)
          .name,
        fill: "start",
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 350);

          gradient.addColorStop(0, `${colorGradient}cb`);
          gradient.addColorStop(0.5, `${colorGradient}75`);
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: colorBorder,
        tension: 0.5,
        pointBackgroundColor: colorBorder,
        pointHoverRadius: pointHoverRadius.value,
        pointRadius: pointRadius.value,
        pointHoverBorderColor: colorBorder,
        pointHoverBackgroundColor: colorBorder,
        pointBorderWidth: 1,
        pointHoverBorderWidth: 1,
        borderWidth: borderWidth.value,
        data: todayData.value,
      },
    ],
  };
});

const optionsToday = computed(() => {
  let colorTicks = "#c0c0c0";
  let colorLabel = "#58a6f3";

  // разрешение экрана
  if (uiStore.smSmaller) {
    ticksFontSize.value = 11;
    ticksPadding.value = 5;
    titleFont.value = 11;
    titleMarginBottom.value = 2;
    bodyFont.value = 11;
  } else {
    ticksFontSize.value = 14;
    ticksPadding.value = 10;
    titleFont.value = 13;
    titleMarginBottom.value = 5;
    bodyFont.value = 13;
  }

  // theme
  if (!uiStore.theme) {
    colorTicks = "#000000";
    colorLabel = "#18436ecb";
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          color: "#464646",
          display: true,
        },
        ticks: {
          color: colorTicks,
          font: {
            size: ticksFontSize.value,
            family: "Montserrat",
            weight: 400,
            lineHeight: 1,
          },
        },
      },
      y: {
        min: min.value - stepSize.value,
        max: max.value + stepSize.value,
        border: {
          display: false,
        },
        grid: {
          color: "#464646",
          display: true,
        },
        ticks: {
          color: colorTicks,
          stepSize: stepSize.value,
          padding: ticksPadding.value,
          font: {
            size: ticksFontSize.value,
            family: "Montserrat",
            weight: 500,
            lineHeight: 1.5,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        intersect: false,
        padding: 7,
        backgroundColor: "#a7a7a77c", // Цвет фона подсказки
        titleColor: "#000", // Цвет заголовка подсказки
        titleFont: {
          size: titleFont.value,
          family: "Montserrat",
          weight: 600,
          lineHeight: 1.2,
        },
        titleMarginBottom: titleMarginBottom.value,
        bodyColor: "#000",
        bodyFont: {
          size: bodyFont.value,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1.2,
        },
        bodyAlign: "center",
        boxWidth: 12,
        boxHeight: 12,
        boxPadding: 5,
        usePointStyle: "circle",
        borderColor: "#000",
        borderWidth: 1,
        callbacks: {
          labelColor: function (tooltipItem, chart) {
            return {
              borderColor: "#000",
              backgroundColor: colorLabel,
            };
          },
          label: function (tooltipItem, chart) {
            return `${tooltipItem.dataset.label}: ${
              tooltipItem.formattedValue
            }${
              optionsHour.value.find((item) => item.value === valueHour.value)
                .measurement
            }`;
          },
        },
      },
    },
  };
});
</script>

<style lang="scss" scoped>
@include HistoryMain();
.history-main {
  display: flex;
  flex-direction: column;
  height: fit-content;
  @include Card();

  &-graph {
    height: 350px;
  }

  canvas {
    object-fit: cover;
    flex-grow: 1;
    color: #464646;
  }
}
.history__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.history__header-left {
}
.history-subtitle {
  line-height: 1;
  margin-bottom: 5px;
  color: var(--blue-600);
}
.history-title {
  font-size: 30px;
  line-height: 1;
}
.history__header-right {
  height: fit-content;
  align-self: center;
}
</style>

<style lang="scss"></style>
