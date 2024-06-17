<template>
  <div class="radar">
    <div class="radar__header">
      <p class="radar-subtitle">Last week</p>
      <h1 class="radar-title">Humidity / chance of rain</h1>
    </div>
    <div class="radar-graph">
      <Radar :data="dataRadar" :options="optionsRadar" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch, onMounted, computed } from "vue";
import { Radar } from "vue-chartjs";

const props = defineProps({
  history: Array,
});

const dataDays = ref([]);
const dataChance = ref([]);
const dataHumidity = ref([]);

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
  dataChance.value = props.history.map((item) => item.day.daily_chance_of_rain);
  dataHumidity.value = props.history.map((item) => item.day.avghumidity);

  dataDays.value = props.history.map((item) => `${item.date.split('-')[1]}.${item.date.split('-')[2]}`);
};

const dataRadar = computed(() => {
  return {
    labels: dataDays.value,
    datasets: [
      {
        label: "Humidity",
        data: dataHumidity.value,
        backgroundColor: "#10b98138",
        borderColor: "#10b981",
        borderWidth: 1,
        hoverBackgroundColor: "#10b981",
        pointBackgroundColor: "#0f835c",
        pointBorderColor: "#000",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Chance of rain",
        data: dataChance.value,
        backgroundColor: "#46627e75",
        borderColor: "#6ea5dc",
        borderWidth: 1,
        hoverBackgroundColor: "#10a0b9",
        pointBackgroundColor: "#6ea5dc",
        pointBorderColor: "#000",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
});

const optionsRadar = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      ticks: {
        color: "#d4d4d4",
        backdropColor: "transparent",
        font: {
          size: 12,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1,
        },
      },
      grid: {
        color: "#5d5d5d",
      },
      angleLines: {
        color: "#5d5d5d",
      },
      pointLabels: {
        color: "#d4d4d4",
        padding: 0,
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1,
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        color: "#c0c0c0",
        font: {
          size: 13,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
        padding: 7,
        usePointStyle: true,
        pointStyle: "rectRounded",
        pointStyleWidth: 35,
        useBorderRadius: true,
        borderRadius: 5,
      },
      title: {
        display: false,
      },
    },
    tooltip: {
      intersect: false,
      padding: 5,
      backgroundColor: "#c5c5c55d", // Цвет фона подсказки
      titleColor: "#000", // Цвет заголовка подсказки
      titleFont: {
        size: 13,
        family: "Montserrat",
        weight: 600,
        lineHeight: 1.2,
      },
      titleMarginBottom: 3,
      bodyColor: "#000",
      bodyFont: {
        size: 12,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 15,
      boxHeight: 15,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.radar {
  @include Card();
  display: flex;
  flex-direction: column;
}
.radar__header {
  line-height: 1;
  margin-bottom: 10px;
  font-size: 14px;
}
.radar-subtitle {
  color: #5d5d5d;
  margin-bottom: 5px;
  color: #6ea5dc;
}
.radar-title {
  font-size: 22px;
}
.radar-graph {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
