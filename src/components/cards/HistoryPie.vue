<template>
  <div class="pie">
    <div class="pie__header">
      <p class="pie-subtitle">Today</p>
      <h1 class="pie-title">Day length</h1>
    </div>
    <div class="pie-graph">
      <Doughnut :data="dataPie" :options="optionsPie" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch, computed } from "vue";
import { Doughnut } from "vue-chartjs";

const props = defineProps({
  weatherToday: Array,
});

const countHourDay = ref(0);
const countHourNight = ref(0);

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
  let data = props.weatherToday.map((item) => item.is_day);
  countHourDay.value = 0;
  countHourNight.value = 0;
  data.forEach((item) => {
    item === 1 ? ++countHourDay.value : ++countHourNight.value;
  });
};

const dataPie = computed(() => {
  return {
    labels: ["Night", "Day"],
    datasets: [
      {
        backgroundColor: ["#2b7be4bc", "#6b99c6"],
        data: [countHourNight.value, countHourDay.value],
        spacing: 2,
        hoverOffset: 20,
        borderWidth: 1,
        hoverBorderWidth: 2,
        borderRadius: 5,
        borderColor: "#000",
      },
    ],
  };
});

const optionsPie = {
  responsive: true,
  maintainAspectRatio: true,
  layout: {
    padding: {
      top: 10,
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
        display: true,
        text: "Hours",
        padding: {
          top: 15,
        },
        color: "#fff",
        font: {
          size: 15,
          family: "Montserrat",
          weight: 400,
          lineHeight: 1.2,
        },
      },
    },
    tooltip: {
      intersect: false,
      padding: 5,
      backgroundColor: "#c5c5c5b6", // Цвет фона подсказки
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
        size: 13,
        family: "Montserrat",
        weight: 500,
        lineHeight: 1.2,
      },
      bodyAlign: "left",
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 5,
      borderColor: "#000",
      borderWidth: 1,
      usePointStyle: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.pie {
  @include Card();
  display: flex;
  flex-direction: column;
}
.pie__header {
  line-height: 1;
  margin-bottom: 10px;
  font-size: 14px;
}
.pie-subtitle {
  color: #2b7be4bc;
  margin-bottom: 5px;
  color: #6ea5dc;
}
.pie-title {
  font-size: 22px;
}
.pie-graph {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
