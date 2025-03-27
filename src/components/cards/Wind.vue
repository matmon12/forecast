<template>
  <div class="wind">
    <p class="wind-title">
      <i-ph:wind />
      {{ $t("wind.title") }}
    </p>
    <div class="wind-content">
      <div class="wind-compas">
        <div class="wind-img-wrap">
          <i-solar:map-arrow-up-bold
            :style="{ transform: `rotate(${degree + 180}deg)` }"
          />
        </div>
        <div class="wind-compas-box">
          <p class="wind-compas-text">{{ $t("wind.compas.n") }}</p>
          <p class="wind-compas-text">{{ $t("wind.compas.e") }}</p>
          <p class="wind-compas-text">{{ $t("wind.compas.s") }}</p>
          <p class="wind-compas-text">{{ $t("wind.compas.w") }}</p>
        </div>
      </div>
    </div>
    <div class="wind__footer">
      <div class="wind-left">
        {{ settingStore.getWind(props.speed) }}
        <span>{{ t(`wind.measurement.${settingStore.getUnitWind()}`) }}</span>
      </div>
      <div class="wind-right">
        {{ convertDir }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, defineProps, watch, onMounted, inject } from "vue";
import { useSettingStore } from "@/stores/setting";

const settingStore = useSettingStore();
const { anime } = inject("plugins");
const t = inject("t");

const props = defineProps({
  speed: {
    type: Number,
    required: true,
    default: 2,
  },
  degree: {
    type: Number,
    required: true,
    default: 0,
  },
  dir: {
    type: String,
    required: true,
    default: "N",
  },
});

const degree = ref(0);

watch(
  () => props.degree,
  (newValue) => {
    anime({
      targets: degree,
      value: newValue,
      easing: "spring(1, 80, 10, 0)",
      duration: 700,
    });
  }
);

onMounted(() => {
  anime({
    targets: degree,
    value: props.degree,
    easing: "spring(1, 80, 10, 0)",
    duration: 700,
  });
});

const convertDir = computed(() => {
  return props.dir
    .toLowerCase()
    .split("")
    .map((item) => t(`wind.compas.${item}`))
    .join("");
});
</script>

<style lang="scss" scoped>
@include Wind();
.wind {
  @include Card();
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    svg {
      font-size: 18px;
    }
  }
  &-compas {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid var(--white);
    position: relative;
    margin: 0 auto;
    svg {
      font-size: 28px;
      color: var(--focus);
    }
    &-box {
      width: 100%;
      height: 100%;
    }
    &-text {
      position: absolute;
      line-height: 1;
      font-size: 14px;
      &:nth-child(1) {
        top: 5px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &:nth-child(2) {
        top: 50%;
        right: 5px;
        transform: translate(0, -50%);
      }
      &:nth-child(3) {
        bottom: 5px;
        left: 50%;
        transform: translate(-50%, 0);
      }
      &:nth-child(4) {
        top: 50%;
        left: 5px;
        transform: translate(0, -50%);
      }
    }
  }
}
.wind-img-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
}
.wind__footer {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  align-items: flex-end;
  position: relative;
}
.wind-left {
  font-size: 18px;
  line-height: 1;
  span {
    color: var(--grey-300);
    font-size: 14px;
  }
}
.wind-right {
  font-size: 25px;
  color: var(--cyanogen);
  position: absolute;
  line-height: 1;
  right: 0;
  bottom: 0;
}
</style>
