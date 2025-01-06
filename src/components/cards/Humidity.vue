<template>
  <div class="humidity">
    <p class="humidity-title">
      <i-carbon:humidity />
      {{ $t("humidity.title") }}
    </p>
    <div class="humidity-wrap">
      <img class="humidity-img" src="@/img/Humidity.png" alt="picture" />
    </div>
    <div class="humidity-footer">
      <p class="humidity-left">{{ props.humidity }}<span>%</span></p>
      <div class="humidity-right">
        <p class="humidity-status-text">{{ $t("humidity.subtitle") }}</p>
        <p class="humidity-status-value">
          {{ getTextDesc(props.humidity, uiStore.xs2Smaller) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, inject } from "vue";
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();
const t = inject("t");

const props = defineProps({
  humidity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const getTextDesc = (value, responsive) => {
  if (responsive) {
    if (value < 30) {
      return t("humidity.status.short.low");
    } else if (value >= 30 && value < 50) {
      return t("humidity.status.short.normal");
    } else if (value >= 50 && value < 70) {
      return t("humidity.status.short.good");
    } else if (value >= 70 && value < 90) {
      return t("humidity.status.short.high");
    } else {
      return t("humidity.status.short.overly");
    }
  } else {
    if (value < 30) {
      return t("humidity.status.long.low");
    } else if (value >= 30 && value < 50) {
      return t("humidity.status.long.normal");
    } else if (value >= 50 && value < 70) {
      return t("humidity.status.long.good");
    } else if (value >= 70 && value < 90) {
      return t("humidity.status.long.high");
    } else {
      return t("humidity.status.long.overly");
    }
  }
};
</script>

<style lang="scss" scoped>
@include Humidity();
.humidity {
  @include Card();
  display: flex;
  flex-direction: column;

}
.humidity-title {
  margin-bottom: 15px;
  display: flex;
  gap: 5px;
  svg {
    font-size: 18px;
  }
}
.humidity-wrap {
  height: 80px;
  width: min-content;
  margin: 0 auto;
  position: relative;
  z-index: 0;
  flex-grow: 1;
  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: -1;
    width: 50%;
    height: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: 0 0 30px 20px var(--shadow-img-1);
    background-color: var(--shadow-img-2);
  }
}
.humidity-img {
  // width: 100%;
  height: 100%;
  object-fit: contain;
}
.humidity-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 15px;
}
.humidity-left {
  font-size: 18px;
  line-height: 1;
  span {
    color: var(--grey-300);
    font-size: 14px;
    margin-left: 3px;
  }
}
.humidity-right {
}
.humidity-status-text {
  font-size: 12px;
  line-height: 1;
  margin-bottom: 2px;
  font-weight: 500;
  color: var(--cyanogen);
}
.humidity-status-value {
  font-size: 10px;
  line-height: 1;
}
</style>
