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
import { ref, onMounted, onUnmounted } from "vue";
import { useSearchStore } from "@/stores/search";
import Toast from "primevue/toast";
import ConfirmPopup from "primevue/confirmpopup";
import { getClasses } from "@/utils/classes";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuthStore } from "@/stores/auth";

const auth = getAuth();
const authStore = useAuthStore();
const isHeaderActive = ref(false);

onMounted(() => {
  checkUser();
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

const checkUser = () => {
  // ранний доступ
  const userInfo = JSON.parse(localStorage.getItem("auth"));
  if (userInfo) {
    authStore.user = userInfo.token;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStore.user = user;
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: user.accessToken,
        })
      );
    } else {
      authStore.user = null;
      localStorage.removeItem("auth");
    }
  });
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
    &-message.p-toast-message-success {
      background-color: #6b98c65d;
      color: #53a9ff;
      border-color: #4583c2;
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
  color: #dedede;
  background-color: #353535;
  &:not(:disabled):hover {
    background-color: #545454;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
.accept-btn {
  color: #000;
  background-color: #7b9dcf;
  &:not(:disabled):hover {
    background-color: #a9caff;
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}
</style>
