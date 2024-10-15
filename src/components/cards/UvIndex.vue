<template>
  <div class="uv">
    <p class="uv-title">UV Index</p>
    <div class="uv-wrapper">
      <Knob
        class="uv-bar"
        :min="0"
        :max="13"
        :model-value="uvIndex"
        :colors-line="['#aec5ee', '#788aa3', '#4f6378', '#3c4d5b', '#2c3a45']"
        :color-point="'#fff'"
        :stroke-width="10"
        :size-point="18"
        :width="180"
      />
      <div class="uv-box">
        <p class="uv-value">{{ Math.round(uvIndex) }}/13</p>
        <p class="uv-text">{{ textLevel[uvIndex] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
const screenWidth = ref(window.innerWidth);

const textLevel = ref({
  0: "Low",
  1: "Low",
  2: "Low",
  3: "Moderate",
  4: "Moderate",
  5: "Moderate",
  6: "High",
  7: "High",
  8: "Very High",
  9: "Very High",
  10: "Very High",
  11: "Extreme",
  12: "Extreme",
  13: "Extreme",
});

const props = defineProps({
  uvIndex: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>

<style lang="scss" scoped>
.uv {
  @include Card();
  display: flex;
  flex-direction: column;
}
.uv-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}
.uv-bar {
}
.uv-title {
  margin-bottom: 15px;
}
.uv-box {
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.uv-value {
  line-height: 1;
  font-size: 17px;
  font-weight: 500;
}
.uv-text {
  line-height: 1;
  font-size: 19px;
  font-weight: 500;
}
</style>
