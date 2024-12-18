<template>
  <div class="header">
    <div class="header__inner">
      <Search v-if="!uiStore.xs2Smaller" />
      <SearchMini v-else />

      <Panel v-if="uiStore.sm2AndLarger" />

      <div class="header__right">
        <ThemeSwitch v-if="!uiStore.xsAndLarger" class="header__right-theme" />
        <PanelMini v-if="!uiStore.sm2AndLarger" />
      </div>
    </div>
  </div>
</template>

<script setup>
import PanelMini from "./PanelMini.vue";
import { useUiStore } from "../stores/ui";

const uiStore = useUiStore();
</script>

<style lang="scss" scoped>
@include Header();
.header {
  width: 100%;
  position: sticky;
  top: 30px;
  z-index: 1000;
  border-radius: 20px;

  &::after {
    content: "";
    position: absolute;
    width: calc(100% + 30px);
    height: calc(100% + 30px);
    background-color: #ffffff1d;
    backdrop-filter: blur(10px);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    z-index: -1;
    opacity: 0;
    transition: all 0.3s;
  }

  &.is--active {
    &::after {
      opacity: 1;
    }
  }

  &__inner {
    display: flex;
    justify-content: space-between;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;
    :deep() {
      .slider {
        box-shadow: 0 0 10px #000;
      }
    }
  }
}
</style>
