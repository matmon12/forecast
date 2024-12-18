<template>
  <Button
    @click="isOpen = !isOpen"
    severity="secondary"
    text
    rounded
    class="search-btn"
    ><i-octicon:search-16
  /></Button>
  <Drawer
    v-model:visible="isOpen"
    position="top"
    :pt="getClasses('search').drawer"
  >
    <template #header>
      <p class="search-drawer-header-text">Enter name city:</p>
    </template>
    <Search @submit="hideDrawer()" />
  </Drawer>
</template>

<script setup>
import { ref } from "vue";
import Drawer from "primevue/drawer";
import { getClasses } from "@/utils/classes";

const isOpen = ref(false);

const hideDrawer = () => {
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.search-btn {
  width: 40px;
  height: 40px;
  font-size: 20px;
  padding: 0;
  color: var(--white);
  &:hover {
    background-color: transparent;
  }
}
</style>

<style lang="scss">
.search {
  position: relative;
  &-drawer {
    border-radius: 0 0 20px 20px;
    border: none;
    border-bottom: 1px solid #404040;
    height: auto;
    background-color: var(--modal);

    &-header {
      padding: 20px 20px 15px;
      &-text {
        font-size: 20px;
        color: var(--white);
      }
    }
    .p-drawer-close-button {
      color: var(--grey-light);
      &:hover{
        background-color: var(--hover-grey);
      }
    }
    &-content {
      overflow: visible;
      padding-bottom: 30px;
    }

    .search-input-wrap {
      width: 100%;
    }

    &-mask{
      z-index: 1500 !important;
    }
  }
}
</style>
