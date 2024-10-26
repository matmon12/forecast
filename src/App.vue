<template>
  <main>
    <div class="container">
      <AsideBar />
      <div class="wrapper">
        <Header :class="{ 'is--active': isHeaderActive }" />
        <div class="content">
          <router-view v-slot="{ Component }">
            <keep-alive :include="['Dashboard']">
              <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </div>
      </div>

      <Toast />
      <ConfirmPopup group="headless" :pt="getClasses('app').confirmpopup">
        <template #container="{ message, acceptCallback, rejectCallback }">
          <div class="app-confirmpopup-content">
            <i-ion:warning-outline />
            <p class="app-confirmpopup-message">{{ message.message }}</p>
          </div>
          <div class="app-confirmpopup-footer">
            <Button
              class="app-confirmpopup-reject-button"
              @click="rejectCallback"
              :pt="getClasses('no').button"
              unstyled
              >Cancel</Button
            >
            <Button
              class="app-confirmpopup-accept-button"
              @click="acceptCallback"
              :pt="getClasses('yes').button"
              unstyled
              >OK</Button
            >
          </div>
        </template>
      </ConfirmPopup>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useSearchStore } from "@/stores/search";
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";
import { getClasses } from "@/utils/classes";

const searchStore = useSearchStore();
const header = ref(null);
const isHeaderActive = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

const handleScroll = () => {
  if (window.scrollY > 30) {
    isHeaderActive.value = true;
  } else {
    isHeaderActive.value = false;
  }
};
</script>

<style scoped lang="scss">
main {
  padding: 30px 0;
}
.wrapper {
  min-height: calc(100vh - 60px);
  padding-left: calc(70px + $offset-card);
  display: flex;
  flex-direction: column;
}
.content {
  margin-top: $offset-card;
  position: relative;
  flex-grow: 1;
  display: flex;
}
</style>

<style lang="scss">
.app {
  &-confirmpopup {
    padding: 10px;
    font-size: 14px;
    background-color: #18181b;
    border-color: #6b6b6b;
    &.p-confirmpopup-flipped:before {
      border-top-color: #6b6b6b;
      border-bottom-color: transparent;
    }
    &.p-confirmpopup-flipped:after {
      border-top-color: #18181b;
      border-bottom-color: transparent;
    }
    &:before {
      border-bottom-color: #6b6b6b;
    }
    &:after {
      border-bottom-color: #18181b;
    }
    &-content {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      svg {
        font-size: 20px;
        color: rgb(255, 217, 0);
      }
    }
    &-icon {
    }
    &-message {
    }
    &-footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    &-reject-button {
      height: 30px;
    }
    &-accept-button {
      height: 30px;
    }
  }
}
</style>
