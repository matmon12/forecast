<template>
  <div class="error-page">
    <i-bxs:error />
    <p class="error-page-text">Oooops! Nothing found</p>
    <div class="error-page__btns">
      <button @click="onToBack" class="error-page-btn">Back</button>
      <button class="error-page-btn">Go home</button>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();

const onToBack = () => {
  searchStore.error = "";
};
</script>

<style lang="scss" scoped>
.error-page {
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
.error-page__btns {
  display: flex;
  gap: 15px;
}
.error-page-btn {
  color: $white;
  padding: 10px 40px;
  border-radius: 8px;
  margin-top: 40px;
  font-size: 16px;
  &:nth-child(1) {
    border: 1px solid $main;
  }
  &:nth-child(2) {
    background-color: $main;
  }
}
</style>
