<template>
  <div class="error-page">
    <i-bxs:error />
    <p class="error-page-text">{{ message }}</p>
    <div class="error-page-btns">
      <button @click="$emit('toBack')" class="error-page-btn">
        {{ $t("buttons.back") }}
      </button>
      <button v-if="retry" @click="$emit('retry')" class="error-page-btn">
        {{ $t("buttons.retry") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps({
  message: String,
  retry: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
@include Error();

.error-page {
  width: 100%;
  background-color: var(--grey);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  svg {
    font-size: 10em;
    color: var(--yellow-6);
    filter: drop-shadow(5px 5px 5px #000000);
  }
}
.error-page-text {
  color: var(--white);
  font-size: 20px;
  font-weight: 500;
}

.error-page-btns {
  display: flex;
  gap: 20px;
  width: 300px;
}

.error-page-btn {
  width: 150px;
  flex-grow: 1;
  color: var(--white);
  padding: 10px;
  border-radius: 8px;
  margin-top: 40px;
  font-size: 16px;
  transition: background-color 0.3s, filter 0.3s, font-weight 0.3s;
  &:nth-child(1) {
    border: 1px solid var(--blue-630);
    background-color: var(--transparent-6);
    font-weight: var(--font-weight);

    &:hover {
      color: #000;
      background-color: var(--blue-110);
      font-weight: 500;
      filter: brightness(var(--brightness-btn));
    }
  }
  &:nth-child(2) {
    font-weight: 500;
    color: var(--black-3);
    background-color: var(--blue-160);
    &:hover {
      filter: brightness(1.2);
    }
  }
}
</style>
