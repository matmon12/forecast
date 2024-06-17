<template>
  <div class="pressure">
    <p class="pressure-title">
      <i-mdi:speedometer-slow />
      Pressure
    </p>
    <Knob
      class="pressure-knob"
      v-model="pressure"
      :strokeWidth="15"
      :min="630"
      :max="850"
      :size="110"
      :valueColor="'#68a2ff'"
      :rangeColor="'#404040'"
      :valueTemplate="`${mmHgPressure}`"
      readonly
    />
    <div class="pressure__footer">
      <div class="pressure__left">{{ mmHgPressure }}<span>mmHg</span></div>
      <div class="pressure-right">{{ getTextDesc(mmHgPressure) }}</div>
    </div>
  </div>
</template>

<script setup>
import Knob from "primevue/knob";
import { ref, defineProps, computed, watch, inject, onMounted } from "vue";
import { mbToMmHg } from "@/utils/index";

const { anime } = inject("plugins");

const props = defineProps({
  pressure: {
    type: Number,
    required: true,
    default: 630,
  },
});

const mmHgPressure = computed(() => mbToMmHg(props.pressure));
const pressure = ref(630);

watch(
  () => mmHgPressure.value,
  (newValue) => {
    anime({
      targets: pressure,
      value: newValue,
      easing: "spring(1, 80, 10, 0)",
      duration: 700,
    });
  }
);

onMounted(() => {
  anime({
    targets: pressure,
    value: mmHgPressure.value,
    easing: "spring(1, 80, 10, 0)",
    duration: 700,
  });
});

const getTextDesc = (value) => {
  if (value < 740) {
    return "Low";
  } else if (value >= 740 && value < 760) {
    return "Normal";
  } else if (value >= 760 && value < 780) {
    return "High";
  } else {
    return "Very High";
  }
};
</script>

<style lang="scss" scoped>
.pressure {
  @include Card();
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-knob {
  }
}
.pressure-title {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
  svg {
    font-size: 18px;
  }
}
.pressure-knob {
  width: min-content;
  display: flex;
  margin: 0 auto;
}
.pressure__footer {
  display: flex;
  justify-content: space-between;
}
.pressure__left {
  line-height: 1;
  span {
    color: #acacac;
    font-size: 13px;
    margin-left: 3px;
  }
}
.pressure-right {
  line-height: 1;
  font-size: 14px;
  color: #87e8fa;
}
</style>

<style lang="scss">
.p-knob-range,
.p-knob-value {
  stroke-linecap: round;
}
.p-knob svg {
  &:focus {
    outline: none;
    color: #68a2ff;
  }
}
.p-knob-text {
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: 18px;
  fill: #fff;
}
</style>
