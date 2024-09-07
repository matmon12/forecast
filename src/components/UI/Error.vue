<template>
  <div class="error-page">
    <i-bxs:error />
    <p class="error-page-text">{{ message }}</p>
    <button @click="$emit('toBack')" class="error-page-btn">Back</button>
  </div>
</template>

<script setup>
import {ref, defineProps} from 'vue';


const props = defineProps({
  message: String
})
</script>

<style lang="scss" scoped>
.error-page {
  width: 100%;
  background-color: $grey;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  svg {
    font-size: 10em;
    color: rgb(255, 173, 58);
  }
}
.error-page-text {
  color: $white;
  font-size: 20px;
}

.error-page-btn {
  color: $white;
  padding: 10px;
  width: 300px;
  border-radius: 8px;
  margin-top: 40px;
  font-size: 16px;
  transition: all 0.3s;
  border: 1px solid $main;
  &:hover {
    background-color: #7ea5dfbc;
  }
}
</style>
