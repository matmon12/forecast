<template>
  <div class="humidity">
    <p class="humidity-title">
      <i-carbon:humidity />
      Humidity
    </p>
    <div class="humidity-wrap">
      <img class="humidity-img" src="@/img/Humidity.png" alt="picture" />
    </div>
    <div class="humidity-footer">
      <p class="humidity-left">{{ props.humidity }}<span>%</span></p>
      <div class="humidity-right">
        <p class="humidity-status-text">Status</p>
        <p class="humidity-status-value">{{ getTextDesc(props.humidity) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  humidity: {
    type: Number,
    required: true,
    default: 0,
  },
});

const getTextDesc = (value) => {
  if (value < 30) {
    return "Very Low";
  } else if (value >= 30 && value < 50) {
    return "Satisfactory";
  } else if (value >= 50 && value < 70) {
    return "Good Quality";
  } else if (value >= 70 && value < 90) {
    return "High Humidity";
  } else {
    return "Excessively ";
  }
};
</script>

<style lang="scss" scoped>
.humidity {
  @include Card();
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
    color: #acacac;
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
  color: #87e8fa;
}
.humidity-status-value {
  font-size: 10px;
  line-height: 1;
}
</style>
