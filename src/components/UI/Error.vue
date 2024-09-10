<template>
  <div class="error-page">
    <i-bxs:error />
    <p class="error-page-text">{{ message }}</p>
    <div class="error-page-btns" >
      <button @click="$emit('toBack')" class="error-page-btn">Back</button>
      <button v-if="retry" @click="$emit('retry')" class="error-page-btn">Retry</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  message: String,
  retry: {
    type: Boolean,
    default: false
  }
});
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

.error-page-btns {
  display: flex;
  gap: 20px;
  width: 300px;
}

.error-page-btn {
  flex-grow: 1;
  color: $white;
  padding: 10px;
  border-radius: 8px;
  margin-top: 40px;
  font-size: 16px;
  transition: background-color 0.3s;
  border: 1px solid $main;
  &:nth-child(1) {
    &:hover {
      background-color: $blue;
    }
  }
  &:nth-child(2) {
    font-weight: 500;
    color: $black;
    background-color: $blue;
    &:hover{
      background-color: #7ea5dfbc;
    }
  }
}
</style>
