<template>
  <Button
    :class="['sort', { 'sort--active': currentOrder !== null }]"
    @click="toggleSortOrder()"
    severity="secondary"
  >
    <p class="sort-field">{{ uppercaseFirst(field) }}</p>
    <div class="sort-icon">
      <i-fluent:arrow-sort-up-lines-20-filled
        v-if="currentOrder === sortOrders[0]"
      />
      <i-fluent:arrow-sort-down-lines-20-filled
        v-else-if="currentOrder === sortOrders[1]"
      />
      <i-fluent:arrow-sort-20-filled v-else />
    </div>
  </Button>
</template>

<script setup>
import { ref, defineProps, defineModel, watch } from "vue";
import { uppercaseFirst } from "@/utils/index";

const props = defineProps({
  field: String,
  order: {
    type: [Number, null],
    default: null,
  },
});

const emits = defineEmits(["sort"]);

const currentOrder = ref(props.order);
const sortOrders = [1, -1];
let currentIndex = sortOrders.findIndex((item) => item === currentOrder.value);

watch(
  () => props.order,
  (newValue) => {
    currentOrder.value = newValue;
  }
);

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
  padding: 7px 17px;
  gap: 15px;
  background-color: var(--grey-1010);
  border: none;
  transition: box-shadow .3s;

  &:hover{
    box-shadow: 0 0 5px #6a6a6a;
  }

  &-field {
    font-weight: 500;
    font-size: 14px;
    color: var(--grey-50);
  }
  &-icon {
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    font-size: 14px;
    background-color: var(--blue-660);
    border-radius: 50%;
    color: #000;
    box-shadow: 0 0 5px #000;
  }
  &.sort--active {
    background-color: var(--blue-660);
    color: #fff;
    .sort-icon {
      background-color: var(--grey-1010);
      color: var(--white);
    }
  }
}
</style>
