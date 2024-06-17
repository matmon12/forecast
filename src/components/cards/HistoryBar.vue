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
          :color-btn="'#af6bc6'"
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

const weekData = ref([]);
const dataDays = ref([]);

const valueDays = ref("avgtemp_c");
const optionsDays = ref([
  { name: "Avg temp", value: "avgtemp_c", measurement: "°С" },
  { name: "Total precip", value: "totalprecip_mm", measurement: "mm" },
  { name: "Max wind", value: "maxwind_kph", measurement: "m/s" },
]);

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

          gradient.addColorStop(0, "#9b6bc6cb");
          gradient.addColorStop(0.5, "#af6bc675");
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: "#af6bc6",
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: "#af6bc675",
      },
    ],
  };
});
const optionsWeek = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        color: "#464646",
      },
      ticks: {
        color: "#c0c0c0",
        font: {
          size: 14,
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
        color: "#c0c0c0",
        font: {
          size: 14,
          family: "Montserrat",
          weight: 500,
          lineHeight: 1,
        },
        padding: 10,
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
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 5,
      bodyColor: "#000",
      bodyFont: {
        size: 13,
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
            backgroundColor: "#af6bc6",
          };
        },
        label: function (tooltipItem, chart) {
          return `${tooltipItem.dataset.label}: ${tooltipItem.formattedValue}${
            optionsDays.value.find((item) => item.value === valueDays.value)
              .measurement
          }`;
        },
      },
    },
  },
};
</script>

<style lang="scss" scoped>
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
  color: #6ea5dc;
}
.bar__header-right {
  height: fit-content;
  align-self: center;
}
.bar-graph {
  height: 350px;
}
</style>
