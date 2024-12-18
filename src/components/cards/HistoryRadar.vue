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
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();

const props = defineProps({
  history: Array,
});

const dataDays = ref([]);
const dataChance = ref([]);
const dataHumidity = ref([]);

// ui настройки графика
const titleFont = ref(13);
const bodyFont = ref(13);

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

  dataDays.value = props.history.map(
    (item) => `${item.date.split("-")[1]}.${item.date.split("-")[2]}`
  );
};

const dataRadar = computed(() => {
  let colorBackH = "#10b981";
  let colorBackC = "#6ea5dc";
  let colorBackAlphaH = "#10b98138";
  let colorBackAlphaC = "#46627e75";

  if (!uiStore.theme) {
    colorBackH = "#085b3f";
    colorBackAlphaH = "#1f98705e";
    colorBackC = "#0a58a7";
    colorBackAlphaC = "#156dbf7a"
  }

  return {
    labels: dataDays.value,
    datasets: [
      {
        label: "Humidity",
        data: dataHumidity.value,
        backgroundColor: colorBackAlphaH,
        borderColor: colorBackH,
        borderWidth: 1,
        hoverBackgroundColor: colorBackH,
        pointBackgroundColor: "#0f835c",
        pointBorderColor: "#000",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: "Chance of rain",
        data: dataChance.value,
        backgroundColor: colorBackAlphaC,
        borderColor: colorBackC,
        borderWidth: 1,
        hoverBackgroundColor: colorBackC,
        pointBackgroundColor: colorBackC,
        pointBorderColor: "#000",
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };
});

const optionsRadar = computed(() => {
  let colorTicks = "#d4d4d4";
  let colorLegend = "#c0c0c0";
  let colorLines = "#5d5d5d";

  // разрешение экрана
  if (uiStore.xs2Smaller) {
    titleFont.value = 11;
    bodyFont.value = 11;
  } else {
    titleFont.value = 13;
    bodyFont.value = 13;
  }

  // theme
  if (!uiStore.theme) {
    colorTicks = "#000000";
    colorLegend = "#000000";
    colorLines = "#464646";
  }

  return {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        ticks: {
          color: colorTicks,
          backdropColor: "transparent",
          font: {
            size: 12,
            family: "Montserrat",
            weight: 400,
            lineHeight: 1,
          },
        },
        grid: {
          color: colorLines,
        },
        angleLines: {
          color: colorLines,
        },
        pointLabels: {
          color: colorTicks,
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
          color: colorLegend,
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
          size: titleFont.value,
          family: "Montserrat",
          weight: 600,
          lineHeight: 1.2,
        },
        titleMarginBottom: 3,
        bodyColor: "#000",
        bodyFont: {
          size: bodyFont.value,
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
});
</script>

<style lang="scss" scoped>
@include HistoryRadar();
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
  color: var(--blue-600);
}
.radar-title {
  font-size: 22px;
}
.radar-graph {
  flex-grow: 1;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
