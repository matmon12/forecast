<template>
  <div class="uv">
    <p class="uv-title">{{ $t("uv.title") }}</p>
    <div class="uv-wrapper">
      <Knob
        class="uv-bar"
        :min="0"
        :max="13"
        :model-value="uvIndex"
        :colors-line="['#aec5ee', '#788aa3', '#4f6378', '#3c4d5b', '#2c3a45']"
        :color-point="'#fff'"
        :stroke-width="
          responsiveKnob[uiStore.activeBreakpoint]?.strokeWidth || 10
        "
        :size-point="responsiveKnob[uiStore.activeBreakpoint]?.sizePoint || 18"
        :width="responsiveKnob[uiStore.activeBreakpoint]?.width || 180"
      />
      <div class="uv-box">
        <p class="uv-value">{{ Math.round(uvIndex) }}/13</p>
        <p class="uv-text">{{ textLevel[Math.round(uvIndex)] }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, inject } from "vue";
import { useUiStore } from "@/stores/ui";
import { computed } from "vue";

const uiStore = useUiStore();
const t = inject("t");

const screenWidth = ref(window.innerWidth);

const textLevel = computed( () => ({
  0: t("uv.levels.low"),
  1: t("uv.levels.low"),
  2: t("uv.levels.low"),
  3: t("uv.levels.moderate"),
  4: t("uv.levels.moderate"),
  5: t("uv.levels.moderate"),
  6: t("uv.levels.high"),
  7: t("uv.levels.high"),
  8: t("uv.levels.very_high"),
  9: t("uv.levels.very_high"),
  10: t("uv.levels.very_high"),
  11: t("uv.levels.extreme"),
  12: t("uv.levels.extreme"),
  13: t("uv.levels.extreme"),
}));

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
  white-space: nowrap;
}
</style>
