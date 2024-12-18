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
        :stroke-width="responsiveKnob[uiStore.activeBreakpoint]?.strokeWidth || 10"
        :size-point="responsiveKnob[uiStore.activeBreakpoint]?.sizePoint || 18"
        :width="responsiveKnob[uiStore.activeBreakpoint]?.width || 180"
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
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();

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

const responsiveKnob = {
  md: { width: 150, strokeWidth: 10, sizePoint: 18 },
  sm2: { width: 150, strokeWidth: 10, sizePoint: 18 },
  xs3: { width: 120, strokeWidth: 6, sizePoint: 14 },
  xs4: { width: 100, strokeWidth: 6, sizePoint: 12 },
};
</script>

<style lang="scss" scoped>
@include UvIndex();
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
