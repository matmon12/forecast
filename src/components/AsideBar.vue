<template>
  <div class="aside">
    <div class="aside__inner">
      <div class="aside__btns">
        <div
          :class="[
            'aside-btn-wrap',
            {
              'is--active':
                ($route.name === 'Home' && item.name === 'home') ||
                $route.path.split('/').includes(item.name),
            },
          ]"
          v-for="item in menuPages"
          :key="item.id"
        >
          <router-link :to="{ name: item.router }" class="aside-btn">
            <component :is="item.icon"></component>
          </router-link>
        </div>
      </div>
      <div v-if="uiStore.xsAndLarger" class="aside__bottom">
        <button
          v-if="can('logout')"
          @click="authStore.logoutUser()"
          class="aside__bottom-btn"
        >
          <i-streamline:interface-logout-arrow-exit-frame-leave-logout-rectangle-right />
        </button>
        <ThemeSwitch />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import PhSquaresFour from "~icons/ph/squares-four";
import CarbonLocation from "~icons/carbon/location";
import QuillCalendar from "~icons/quill/calendar";
import FluentNews20Regular from "~icons/fluent/news-20-regular";
import EpSetting from "~icons/ep/setting";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import { useAbility } from "@casl/vue";
import { ability } from "../services/ability";

const authStore = useAuthStore();
const uiStore = useUiStore();
const { can } = useAbility();

const menuPages = computed(() => {
  const menu = [
    { id: 1, icon: PhSquaresFour, router: "Home", name: "home" },
    { id: 2, icon: CarbonLocation, router: "Tomorrow", name: "tomorrow" },
    { id: 3, icon: QuillCalendar, router: "History", name: "history" },
    { id: 4, icon: FluentNews20Regular, router: "CategoryNews", name: "news" },
  ];
  if (ability.can("visit", "Dashboard")) {
    menu.push({
      id: 5,
      icon: EpSetting,
      router: "Dashboard",
      name: "dashboard",
    });
  }
  return menu;
});
</script>

<style lang="scss" scoped>
@include AsideBar();
.aside {
  background-color: var(--blue-dark);
  width: 70px;
  height: calc(100vh - 60px);
  position: fixed;
  top: 30px;
  border-radius: 20px;
  padding: 20px 0;
  overflow: hidden;
  z-index: 1300;

  &__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  &__btns {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  &-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.5s;

    &:hover {
      background-color: #ffffff1e;
    }

    &-wrap {
      z-index: 9;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        background: linear-gradient(
          90deg,
          var(--aside-gradient) 0%,
          rgba(255, 255, 255, 0) 100%
        );
        height: 100%;
        width: 0;
        left: -50%;
        transform: translateX(-100%);
        top: 0;
        z-index: -1;
        opacity: 0;
        border-radius: 5px;
        transition: all 0.5s;
      }
    }
    svg {
      font-size: 17px;
      color: var(--grey-200);
    }
  }
  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    &-btn {
      padding: 10px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s;

      &:hover {
        background-color: #ffffff1e;
      }
      svg {
        font-size: 20px;
      }
    }
  }
}

.is--active {
  &::after {
    opacity: 1;
    width: 100%;
    transform: translateX(-100%);
    left: 50%;
  }
  .aside-btn {
    background-color: var(--aside-active);
    box-shadow: 0 0 10px #00000084;

    svg {
      color: #fff;
    }
  }
}
</style>

<style lang="scss"></style>
