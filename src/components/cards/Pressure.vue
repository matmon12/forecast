<template>
  <div class="pressure">
    <h6 class="pressure-title">Pressure</h6>
    <Knob
      class="pressure-knob"
      v-model="value"
      :strokeWidth="15"
      :min="0"
      :max="10"
      readonly
    />
  </div>
</template>

<script setup>
import Knob from "primevue/knob";
import { ref } from "vue";

const value = ref(5);
</script>

<style lang="scss" scoped>
.pressure {
  @include Card();
  &-knob {
  }
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
  }
}
</style>
