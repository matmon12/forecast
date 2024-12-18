<template>
  <div class="bar">
    <div class="bar__header">
      <div class="bar__header-left">
        <p class="bar-subtitle">Last week</p>
        <h1 class="bar-title">Weather data by day</h1>
      </div>
      <div class="bar__header-right">
        <SelectButton
          :value="valueDays"
          :options="optionsDays"
          :color-back="'var(--grey-400)'"
          :color-text="'var(--grey-200)'"
          :color-btn="'var(--pink)'"
          @toggle-select="
            (category) => {
              valueDays = category;
              history ? init() : null;
            }
          "
        />
      </div>
    </div>
    <div class="bar-graph">
      <Bar :options="optionsWeek" :data="dataWeek" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch, computed, onMounted } from "vue";
import { Bar } from "vue-chartjs";
import { kphToMph } from "@/utils/index";
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();

const weekData = ref([]);
const dataDays = ref([]);

const valueDays = ref("avgtemp_c");
const optionsDays = ref([
  { name: "Avg temp", value: "avgtemp_c", measurement: "°С" },
  { name: "Total precip", value: "totalprecip_mm", measurement: "mm" },
  { name: "Max wind", value: "maxwind_kph", measurement: "m/s" },
]);

// ui настройки графика
const ticksFontSize = ref(14);
const ticksPadding = ref(10);
const titleFont = ref(13);
const titleMarginBottom = ref(5);
const bodyFont = ref(13);

const props = defineProps({
  history: Array,
});

watch(
  () => props.history,
  (newValue) => {
    if (newValue) {
      init();
    }
  }
);

onMounted(() => {
  if (props.history) {
    init();
  }
});

const init = () => {
  weekData.value = props.history.map((item) => {
    if (valueDays.value === "avgtemp_c") {
      return Math.round(item.day[valueDays.value]);
    } else if (valueDays.value === "totalprecip_mm") {
      return item.day[valueDays.value].toFixed(1);
    } else if (valueDays.value === "maxwind_kph") {
      return kphToMph(item.day[valueDays.value]);
    }
  });

  dataDays.value = props.history.map(
    (item) => `${item.date.split("-")[1]}.${item.date.split("-")[2]}`
  );
};

const dataWeek = computed(() => {
  let colorGradient1 = "#9b6bc6cb";
  let colorGradient2 = "#af6bc675";
  let colorBorder = "#af6bc6";

  if (!uiStore.theme) {
    colorGradient1 = "#18436ecb";
    colorGradient2 = "#18436e75";
    colorBorder = "#022e5a";
  }

  return {
    labels: dataDays.value,
    datasets: [
      {
        label: optionsDays.value.find((item) => item.value === valueDays.value)
          .name,
        data: weekData.value,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(0, 0, 0, 350);

          gradient.addColorStop(0, colorGradient1);
          gradient.addColorStop(0.5, colorGradient2);
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: colorBorder,
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: `${colorBorder}75`,
      },
    ],
  };
});

const optionsWeek = computed(() => {
  let colorTicks = "#c0c0c0";
  let colorLabel = "#af6bc6";

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
        grid: {
          color: "#464646",
        },
        ticks: {
          color: colorTicks,
          font: {
            size: ticksFontSize.value,
            family: "Montserrat",
            weight: 500,
            lineHeight: 1,
          },
          padding: 5,
        },
      },
      y: {
        grid: {
          color: "#464646",
        },
        ticks: {
          color: colorTicks,
          font: {
            size: ticksFontSize.value,
            family: "Montserrat",
            weight: 500,
            lineHeight: 1,
          },
          padding: ticksPadding.value,
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
              optionsDays.value.find((item) => item.value === valueDays.value)
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
@include HistoryBar();
.bar {
  @include Card();
  display: flex;
  flex-direction: column;
  height: fit-content;

  //   canvas {
  //     flex-grow: 1;
  //   }
}
.bar__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.bar__header-left {
}
.bar-title {
  font-size: 30px;
  line-height: 1;
}
.bar-subtitle {
  line-height: 1;
  margin-bottom: 5px;
  color: var(--blue-600);
}
.bar__header-right {
  height: fit-content;
  align-self: center;
}
.bar-graph {
  height: 350px;
}
</style>
