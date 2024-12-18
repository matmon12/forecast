<template>
  <div class="chip">
    <p class="chip-label">{{ label }}</p>
    <div class="chip-btn" @click="(e) => $emit('remove', e)">
      <i-gg:close-o />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  label: String,
});
</script>

<style lang="scss" scoped>
@include Chip();
.chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--blue-100);
  border-radius: 5px;
  padding: 3px 8px 3px 10px;
  color: #000;
  height: 30px;

  &-btn {
    display: flex;
    transition: transform 0.3s;
    &:hover {
      transform: rotate(90deg);
    }
  }
  svg {
    font-size: 14px;
  }
}
.chip-label {
  font-size: 15px;
  line-height: 1;
  white-space: nowrap;
  font-weight: 600;
}
</style>
