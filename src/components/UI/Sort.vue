<template>
  <Button
    :class="['sort', { 'sort--active': currentOrder !== null }]"
    @click="toggleSortOrder()"
    severity="secondary"
    rounded
  >
    <i-fluent:arrow-sort-20-filled v-if="currentOrder === sortOrders[0]" />
    <i-fluent:arrow-sort-up-lines-20-filled
      v-else-if="currentOrder === sortOrders[1]"
    />
    <i-fluent:arrow-sort-down-lines-20-filled v-else />
  </Button>
</template>

<script setup>
import { ref, defineProps, defineModel, watch } from "vue";

const props = defineProps({
  field: String,
  order: {
    type: [Number, null],
    default: null,
  },
});

const emits = defineEmits(["sort"]);

const currentOrder = defineModel();
const sortOrders = [null, 1, -1];
let currentIndex = sortOrders.findIndex((item) => item === currentOrder.value);

watch(
  () => currentOrder.value,
  (newOrder) => {
    currentIndex = sortOrders.findIndex((item) => item === currentOrder.value);
  }
);

const toggleSortOrder = () => {
  currentIndex = (currentIndex + 1) % sortOrders.length;
  currentOrder.value = sortOrders[currentIndex];
  emits("sort", {
    sortField: props.field,
    sortOrder: sortOrders[currentIndex],
  });
};
</script>

<style lang="scss" scoped>
.sort {
  height: 35px;
  width: 35px;
  display: flex;
  padding: 0;
  font-size: 14px;
}
</style>
