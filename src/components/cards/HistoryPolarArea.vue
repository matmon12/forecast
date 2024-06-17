<template>
  <div class="polar-area">
    <div class="polar-area__header">
      <p class="polar-area-subtitle">Last week</p>
      <h1 class="polar-area-title">Temperature</h1>
    </div>
    <div class="polar-area-graph">
      <PolarArea :data="dataPolarArea" :options="optionsPolarArea" />
    </div>
    <div class="polar-area__footer">
      <div class="footer-item">
        <p class="footer-point" style="background-color: #3d93f5e9"></p>
        <p class="footer-text">Min (°С)</p>
      </div>
      <div class="footer-item">
        <p class="footer-point" style="background-color: #963df5"></p>
        <p class="footer-text">Max (°С)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed, watch, onMounted } from "vue";
import { PolarArea } from "vue-chartjs";

const props = defineProps({
  history: Array,
});

const dataDays = ref([]);
const min = ref(0);
const max = ref(10);

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
  min.value = props.history.map((item) => Math.round(item.day.mintemp_c));
  max.value = props.history.map((item) => Math.round(item.day.maxtemp_c));

  dataDays.value = props.history.map(
    (item) => `${item.date.split("-")[1]}.${item.date.split("-")[2]}`
  );
};

const dataPolarArea = computed(() => {
  return {
    labels: dataDays.value,
    datasets: [
      {
        label: "Min",
        data: min.value,
        backgroundColor: "#3d93f54d",
        borderColor: "#000",
        borderWidth: 1,
        hoverBackgroundColor: "#3d93f5b2",
      },
      {
        label: "Max",
        data: max.value,
        backgroundColor: "#963df571",
        borderColor: "#000",
        borderWidth: 1,
        hoverBackgroundColor: "#963df5a7",
      },
    ],
  };
});

const optionsPolarArea = {
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
    },
  },
  plugins: {
    legend: {
      display: false,
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
        pointStyleColor: "#fff",
        text: ["Min", "Max"],
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
        size: 13,
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
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          if (tooltipItem.datasetIndex === 1) {
            return {
              borderColor: "#000",
              backgroundColor: "#963df5",
            };
          } else {
            return {
              borderColor: "#000",
              backgroundColor: "#3d93f5e9",
            };
          }
        },
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.polar-area {
  @include Card();
  padding-bottom: 20px;
}
.polar-area__header {
  line-height: 1;
  margin-bottom: 10px;
  font-size: 14px;
}
.polar-area-subtitle {
  color: #963df571;
  margin-bottom: 5px;
  color: #6ea5dc;
}
.polar-area-title {
  font-size: 22px;
}
.polar-area-graph {
  margin: 0 auto;
  max-width: 250px;
  display: flex;
  justify-content: center;
}

.polar-area__footer {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
}
.footer-item {
  display: flex;
  gap: 7px;
  align-items: center;
}
.footer-point {
  width: 28px;
  height: 18px;
  border-radius: 5px;
  border: 1px solid #000;
}
.footer-text {
  color: #c0c0c0;
  font-size: 13px;
  line-height: 1;
}
</style>
