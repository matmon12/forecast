<template>
  <div class="history-main">
    <div class="history__header">
      <div class="history__header-left">
        <p class="history-subtitle">Today</p>
        <h1 class="history-title">Weather data by hour</h1>
      </div>
      <div class="history__header-right">
        <SelectButton
          :value="valueHour"
          :options="optionsHour"
          :color-btn="'#6b99c6'"
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
import { ref, defineProps, watch, computed, onMounted } from "vue";
import { Line } from "vue-chartjs";
import { useHistoryStore } from "@/stores/history";

const historyStore = useHistoryStore();

const todayData = ref([]);
const min = ref(0);
const max = ref(50);
const stepSize = ref(5);

const valueHour = ref("temp_c");
const optionsHour = ref([
  { name: "Temperature", value: "temp_c", measurement: "°С" },
  { name: "Humidity", value: "humidity", measurement: "%" },
  { name: "Precip", value: "precip_mm", measurement: "mm" },
]);

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

          gradient.addColorStop(0, "#6b98c6cb");
          gradient.addColorStop(0.5, "#6b98c675");
          gradient.addColorStop(1, "transparent");

          return gradient;
        },
        borderColor: "#3299ff",
        tension: 0.5,
        pointBackgroundColor: "#3299ff",
        pointHoverRadius: 7,
        pointRadius: 4,
        pointHoverBorderColor: "#3299ff",
        pointHoverBackgroundColor: "#3299ff",
        pointBorderWidth: 1,
        pointHoverBorderWidth: 1,
        borderWidth: 2,
        data: todayData.value,
      },
    ],
  };
});

const optionsToday = computed(() => {
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
          color: "#c0c0c0",
          font: {
            size: 14,
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
          color: "#c0c0c0",
          stepSize: stepSize.value,
          padding: 10,
          font: {
            size: 14,
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
              backgroundColor: "#58a6f3",
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
  color: #6ea5dc;
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
