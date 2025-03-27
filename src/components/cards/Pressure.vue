<template>
  <div class="pressure">
    <p class="pressure-title">
      <i-mdi:speedometer-slow />
      {{ $t("pressure.title") }}
    </p>
    <Knob
      class="pressure-knob"
      v-model="pressure"
      :strokeWidth="15"
      :min="630"
      :max="850"
      :size="110"
      :valueColor="'var(--blue-400)'"
      :rangeColor="'#404040'"
      :valueTemplate="`${settingStore.getPressure(props.pressure)}`"
      readonly
    />
    <div class="pressure__footer">
      <div class="pressure__left">
        {{ settingStore.getPressure(props.pressure)
        }}<span v-if="!uiStore.xs2Smaller">{{
          t(`pressure.measurement.${settingStore.getUnitPressure()}`)
        }}</span>
      </div>
      <div class="pressure-right">{{ getTextDesc(mmHgPressure) }}</div>
    </div>
  </div>
</template>

<script setup>
import Knob from "primevue/knob";
import { ref, defineProps, computed, watch, inject, onMounted } from "vue";
import { mbToMmHg } from "@/utils/index";
import { useUiStore } from "../../stores/ui";
import { useSettingStore } from "@/stores/setting";

const uiStore = useUiStore();
const settingStore = useSettingStore();
const { anime } = inject("plugins");
const t = inject("t");

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
    return t("pressure.status.low");
  } else if (value >= 740 && value < 760) {
    return t("pressure.status.normal");
  } else if (value >= 760 && value < 780) {
    return t("pressure.status.high");
  } else {
    return t("pressure.status.very_high");
  }
};
</script>

<style lang="scss" scoped>
@include Pressure();
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
    color: var(--grey-300);
    font-size: 13px;
    margin-left: 3px;
  }
}
.pressure-right {
  line-height: 1;
  font-size: 14px;
  color: var(--cyanogen);
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
  fill: var(--white);
}
</style>
