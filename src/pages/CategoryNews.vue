<template>
  <div class="category">
    <div class="category-wrapper">
      <Post class="category__item" />
      <Post class="category__item" :orientation="'gorizont'" />
      <Post class="category__item" />
      <Post class="category__item" :orientation="'gorizont'" />
      <Post class="category__item" />
      <Post class="category__item" />
    </div>
    <button class="category-btn">{{ posts }}</button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
</script>

<style lang="scss" scoped>
.category {
  display: flex;
  flex-direction: column;
}
.category-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 300px;
  gap: 15px;
}
.category__item {
  &:nth-child(2) {
    grid-column-start: 2;
    grid-column-end: 4;
  }
  &:nth-child(4) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-child(9) {
    grid-column-start: 3;
    grid-column-end: 5;
  }
}
.category-btn {
  padding: 10px 40px;
  background-color: #6b99c6;
  border-radius: 10px;
  margin: 15px auto 0;
  color: #000;
  font-weight: 500;
  transition: filter 0.3s;
  &:hover {
    filter: brightness(0.8);
  }
}
</style>
