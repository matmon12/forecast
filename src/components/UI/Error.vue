<template>
  <div class="error-page">
    <i-bxs:error />
    <p class="error-page-text">Oooops! Nothing found</p>
    <button @click="onToBack" class="error-page-btn">Back</button>
  </div>
</template>

<script setup>
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();

const onToBack = () => {
  searchStore.error = "";
  searchStore.search = searchStore.searchSuccess;  
  searchStore.input = searchStore.searchSuccess;
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
