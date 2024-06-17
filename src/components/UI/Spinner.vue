<template>
  <div class="spinner">
    <i-svg-spinners:clock />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.spinner {
  background-color: #404040b0;
  position: absolute;
  inset: 0;
  border-radius: 20px;
  svg {
    font-size: 60px;
    position: fixed;
    top: 50%;
    left: 50%;
  }
}
</style>
