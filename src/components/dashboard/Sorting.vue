<template>
  <div class="sorting">
    <Sort
      v-for="item of fields"
      :key="item"
      :field="item"
      :order="currentField === item ? currentOrder : null"
      @sort="
        (value) => {
          currentField = value.sortField;
          currentOrder = value.sortOrder;
          emits('sort');
        }
      "
    />
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from "vue";

const emits = defineEmits(["sort"]);

const fields = ["date", "name", "rating", "time"];
const currentField = defineModel("sortField");
const currentOrder = defineModel("sortOrder");
</script>

<style lang="scss" scoped>
.sorting {
  width: 100%;
  display: flex;
  gap: 10px;
}
</style>
