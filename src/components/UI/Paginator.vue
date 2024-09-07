<template>
  <Button @click="onClickPrev" :disabled="currentPage <= 1"
    ><i-ep:arrow-left-bold
  /></Button>
  <div>{{ currentPage }}</div>
  <Button @click="onClickNext" :disabled="length <= rowsPerPage"
    ><i-ep:arrow-right-bold
  /></Button>
</template>

<script setup>
import { ref, defineEmits, defineProps } from "vue";

const emits = defineEmits(["prev", "next"]);
const props = defineProps({
  length: Number,
  rowsPerPage: Number
});
const currentPage = defineModel();

const onClickNext = () => {
  ++currentPage.value;
  emits("next");
};
const onClickPrev = () => {
  --currentPage.value;
  emits("prev");
};
</script>

<style lang="scss" scoped></style>
