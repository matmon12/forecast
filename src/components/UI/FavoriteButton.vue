<template>
  <button
    @click="onClick"
    :class="[
      'favorite-btn',
      {
        'is-active': settingStore.savedAddress?.id === id,
        'is-loaded': loading && loading === id,
      },
    ]"
    :disabled="loading"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M12.854 3.5a.979.979 0 0 0-1.708 0q-.3.546-.577 1.106a27 27 0 0 0-1.48 3.656c-.139.431-.551.73-1.023.743a29.4 29.4 0 0 0-4.267.425c-.774.136-1.065 1.018-.515 1.556q.188.185.38.365a32 32 0 0 0 3.03 2.527c.367.269.518.73.378 1.152a27 27 0 0 0-1.14 4.927c-.1.755.708 1.288 1.41.928a28.6 28.6 0 0 0 3.98-2.472a1.15 1.15 0 0 1 1.356 0a28.5 28.5 0 0 0 3.98 2.472c.701.36 1.51-.173 1.41-.928q-.058-.425-.127-.845a27 27 0 0 0-1.013-4.082c-.14-.422.01-.883.378-1.152a31.5 31.5 0 0 0 3.41-2.892c.55-.538.26-1.42-.515-1.556a29 29 0 0 0-4.267-.425a1.1 1.1 0 0 1-1.023-.743a27 27 0 0 0-2.057-4.761"
      />
    </svg>
  </button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useSettingStore } from "@/stores/setting";

const props = defineProps({
  id: Number,
  loading: {
    type: Number,
    default: null,
  },
});
const emits = defineEmits(["choose"]);
const settingStore = useSettingStore();

const onClick = (event) => {
  event.stopPropagation();
  emits("choose");
};
</script>

<style lang="scss" scoped>
.favorite {
  &-btn {
    width: 20px;
    height: 20px;
    display: flex;

    &.is-active {
      path {
        fill: var(--blue-2);
      }
    }

    &:disabled {
      cursor: default;
    }

    &:not(:disabled):hover {
      path {
        fill: var(--blue-2);
      }
    }

    &.is-loaded {
      svg {
        animation: spin 2s linear infinite;

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      }
    }

    svg {
      width: 100%;
      height: 100%;
      fill: transparent;

      path {
        color: var(--blue-2);
        transition: fill 0.3s;
      }
    }
  }
}
</style>
