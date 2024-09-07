<template>
  <div class="spinner">
    <i-svg-spinners:clock :style="{fontSize: `${size}px`}"/>
  </div>
</template>

<script setup>
import {ref, defineProps} from 'vue'; 

const props = defineProps({
  size: {
    type: [Number, String],
    required: false,
    default: 20
  } 
})
</script>

<style lang="scss" scoped>
.spinner {
  background-color: #404040b0;
  position: absolute;
  inset: 0;
  border-radius: 20px;
  z-index: 9999;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50% );
  }
}
</style>
