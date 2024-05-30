<template>
  <div ref="knob" class="knob">
    <svg
      class="chart"
      :width="props.width + props.strokeWidth"
      :height="props.width / 2 + props.strokeWidth"
    >
      <defs>
        <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            v-if="props.colorsLine"
            v-for="(item, id) in props.colorsLine"
            :key="id"
            :offset="`${setOffset(id)}%`"
            :stop-color="item"
          />
          <stop v-else class="color" offset="100%" stop-color="#696969" />
        </linearGradient>
      </defs>
      <path
        class="knob-back"
        :stroke-width="props.strokeWidth"
        :d="`M ${props.strokeWidth / 2},${
          props.width / 2 + props.strokeWidth / 2
        } a ${props.width / 2},${props.width / 2} 0 0,1 ${props.width},0`"
        :stroke="props.colorBack"
        stroke-linecap="round"
        fill="none"
      />
      <path
        class="arc"
        :stroke-width="props.strokeWidth"
        :d="`M ${props.strokeWidth / 2},${
          props.width / 2 + props.strokeWidth / 2
        } a ${props.width / 2},${props.width / 2} 0 0,1 ${props.width},0`"
        stroke="url(#arc-gradient)"
        stroke-linecap="round"
        fill="none"
        :stroke-dasharray="`${angleInRadiansLine * (props.width / 200)} ${
          props.width * 2
        }`"
      />
    </svg>

    <div
      :style="{
        left: `${roundPosX}px`,
        bottom: `${roundPosY}px`,
        background: props.colorPoint,
        height: `${props.sizePoint}px`,
        width: `${props.sizePoint}px`,
      }"
      class="round"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import anime from 'animejs/lib/anime.es.js';

const props = defineProps({
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  colorsLine: {
    type: Array,
    required: false,
  },
  colorBack: {
    type: String,
    required: false,
    default: "#404040",
  },
  colorPoint: {
    type: String,
    required: false,
  },
  strokeWidth: {
    type: Number,
    required: false,
    default: 15,
  },
  sizePoint: {
    type: Number,
    required: false,
    default: 25,
  },
  width: {
    type: Number,
    required: false,
    default: 200,
  },
});

const curValue = ref(0);

watch(
  () => props.modelValue,
  (newValue) => {
    checkValue();
    anime({
      targets: curValue,
      value: newValue,
      easing: 'spring(1, 80, 10, 0)',
      duration: 500,
      update: () => {
        setRoundPos()
      }
    });
  }
);

onMounted(() => {
  checkValue();
    anime({
      targets: curValue,
      value: props.modelValue,
      easing: 'spring(1, 80, 10, 0)',
      duration: 500,
      update: () => {
        setRoundPos()
      }
    });
});

const setOffset = (id) => {
  if (props.colorsLine.length === 1) {
    return 100;
  }
  return id * (100 / (props.colorsLine.length - 1));
};

const checkValue = () => {
  if (curValue.value < props.min) {
    curValue.value = props.min;
  }
  if (curValue.value > props.max) {
    curValue.value = props.max;
  }
};

const knob = ref();
const roundPosX = ref(0);
const roundPosY = ref(0);
const angleInRadiansLine = ref(0);

const setRoundPos = () => {
  var radius = props.width / 2;

  // percent
  var sum = props.max - props.min;
  var part = curValue.value - props.min;
  var angleLine = (1 / sum) * part * 100;
  var angleRound = (1 / sum) * part;
  angleInRadiansLine.value = angleLine * Math.PI;
  var angleInRadiansRound = angleRound * Math.PI;

  roundPosX.value =
    radius - radius * Math.cos(angleInRadiansRound) + props.strokeWidth / 2;
  roundPosY.value =
    radius * Math.sin(angleInRadiansRound) + props.strokeWidth / 2;
};

</script>

<style lang="scss" scoped>
.knob {
  display: flex;
  width: min-content;
  position: relative;
}

.arc {
}

.knob-back {
  fill: none;
  stroke-linecap: round;
}

.round {
  transform: translate(-50%, 50%);
  border-radius: 50%;
  position: absolute;
  box-shadow: 0 0 10px #000000a3;
  background: conic-gradient(
        #a9a9a9,
        #a0a0a0,
        #c4c4c4,
        #a6a6a6,
        #c1c1c1,
        #a9a9a9,
        #acacac,
        #a9a9a9,
        #b5b5b5,
        #7c7c7c,
        #828282,
        #b8b8b8,
        #888888,
        #bbbbbb,
        #7a7a7a,
        #7c7c7c,
        #a3a3a3,
        #a9a9a9,
        #acacac,
        #8b8b8b,
        #919191,
        #bbbbbb,
        #dcdcdc,
        #7c7c7c,
        #7c7c7c,
        #8b8b8b,
        #a9a9a9,
        #bbbbbb,
        #a9a9a9
      )
      content-box,
    linear-gradient(#d4d4d4, #d4d4d4) padding-box,
    radial-gradient(rgba(#787878, 0.9), rgba(#787878, 0) 70%) 50% bottom / 80%
      0.75 * 0.1 * 6.25em no-repeat border-box;
}
</style>
