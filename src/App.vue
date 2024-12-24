<template>
  <main>
    <div class="container">
      <AsideBar />
      <div class="wrapper">
        <Header :class="{ 'is--active': isHeaderActive }" />
        <div class="content">
          <router-view>
            <router-view v-slot="{ Component }">
              <Spinner v-if="authStore.loading" :size="50" />
              <keep-alive :include="['Dashboard']">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </router-view>
        </div>
      </div>

      <Toast :pt="getClasses('app').toast" />
      <ConfirmPopup group="headless" :pt="getClasses('app').confirmpopup">
        <template #container="{ message, acceptCallback, rejectCallback }">
          <div class="app-confirmpopup-content">
            <component
              :is="message.icon"
              :style="{ color: message.colorIcon }"
            ></component>
            <p class="app-confirmpopup-message">{{ message.message }}</p>
          </div>
          <div class="app-confirmpopup-footer">
            <Button
              class="app-confirmpopup-btn"
              @click="rejectCallback"
              :pt="getClasses('reject').button"
              unstyled
              >{{ message.rejectLabel }}</Button
            >
            <Button
              class="app-confirmpopup-btn"
              @click="acceptCallback"
              :pt="getClasses('accept').button"
              unstyled
              >{{ message.acceptLabel }}</Button
            >
          </div>
        </template>
      </ConfirmPopup>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useSearchStore } from "@/stores/search";
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";
import { getClasses } from "@/utils/classes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";

const auth = getAuth();
const authStore = useAuthStore();
const uiStore = useUiStore();

const isHeaderActive = ref(false);

// адаптив
watch(
  () => uiStore.activeBreakpoint,
  (newValue) => {
    document.body.className = newValue;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  getUserId();
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

const getUserId = () => {
  // получить id пользоваателя
  const userInfo = JSON.parse(localStorage.getItem("auth"));
  if (userInfo) {
    authStore.uid = userInfo.uid;
  }
};
</script>

<style scoped lang="scss">
@include App();
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
@include App();
.app {
  &-confirmpopup {
    padding: 10px;
    font-size: 14px;
    background-color: var(--grey-1050);
    border-color: var(--grey-340);

    &.p-confirmpopup-flipped:before {
      border-top-color: var(--grey-340);
      border-bottom-color: transparent;
    }
    &.p-confirmpopup-flipped:after {
      border-top-color: var(--grey-1050);
      border-bottom-color: transparent;
    }
    &:before {
      border-bottom-color: var(--grey-340);
    }
    &:after {
      border-bottom-color: var(--grey-1050);
    }
    &-content {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      color: var(--white);
      svg {
        font-size: 20px;
        path {
        }
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
    &-btn {
      height: 25px;
      line-height: 1;
      border-radius: 7px;
      padding: 0 10px;
      font-weight: 500;
      height: 30px;
      transition: background-color 0.3s, color 0.3s;
    }
  }
  &-toast {
    width: 300px;
    z-index: 1600 !important;
    &-message.p-toast-message-success {
      background-color: var(--blue-40);
      color: var(--blue-450);
      border-color: #4583c2;
    }
    &-message.p-toast-message-error {
      background-color: var(--toast-error);
      color: var(--red-300);
    }
    &-message-content {
      align-items: center;
      gap: 15px;
      padding: 10px;
    }
    &-message-icon {
      width: 25px;
      height: 25px;
    }
    &-message-text {
      gap: 5px;
    }
    &-summary {
      font-size: 14px;
      line-height: 1.2;
      font-weight: 500;
    }
    &-detail {
      font-size: 13px;
      font-weight: 400;
      line-height: 1.2;
      color: var(--white-4);
    }
    &-close-button {
      width: 20px;
      height: 20px;
    }
    &-close-icon {
      width: 14px;
      height: 14px;
    }
  }
}

.reject-btn {
  color: var(--grey-50);
  background-color: var(--grey-900);
  transition: filter 0.3s;
  &:not(:disabled):hover {
    filter: brightness(var(--brightness-rating));
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
.accept-btn {
  color: var(--black-3);
  background-color: var(--blue-360);
  transition: filter 0.3s;
  &:not(:disabled):hover {
    filter: brightness(1.3);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}
</style>
