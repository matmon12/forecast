<template>
  <div class="aside">
    <div class="aside__inner">
      <div class="aside__btns">
        <div
          v-for="item in menuPages"
          :key="item.id"
          :class="[
            'aside-btn-wrap',
            {
              'is--active':
                route.matched[0]?.path === `/forecast/${item.router}`,
            },
          ]"
        >
          <button
            @click="
              (isActiveBtn = item.id), router.push(`/forecast/${item.router}`)
            "
            class="aside-btn"
          >
            <component :is="item.icon"></component>
          </button>
        </div>
      </div>
      <div class="aside__bottom">
        <button class="aside__bottom-btn">
          <i-streamline:interface-logout-arrow-exit-frame-leave-logout-rectangle-right />
        </button>
        <Switch
          class="aside-switch"
          @toggle-switch="(value) => onChangeTheme(value)"
          :icons="[
            LineMdMoonToSunnyOutlineLoopTransition,
            LineMdSunnyOutlineToMoonLoopTransition,
          ]"
          :model-value="true"
          :width="'--width'"
          :height="'--height'"
          :offset="'--offset'"
          :colors="['#8d8d8d', '#fff', '#2f2f2f']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, markRaw, watch } from "vue";
import { useRoute } from "vue-router";
import LineMdSunnyOutlineToMoonLoopTransition from "~icons/line-md/sunny-outline-to-moon-loop-transition";
import LineMdMoonToSunnyOutlineLoopTransition from "~icons/line-md/moon-to-sunny-outline-loop-transition";
import PhSquaresFour from "~icons/ph/squares-four";
import CarbonLocation from "~icons/carbon/location";
import QuillCalendar from "~icons/quill/calendar";
import FluentNews20Regular from "~icons/fluent/news-20-regular";
import EpSetting from "~icons/ep/setting";
import router from "@/router/router.js";

const route = useRoute();

const isActiveBtn = ref(1);
const menuPages = markRaw([
  { id: 1, icon: PhSquaresFour, router: "" },
  { id: 2, icon: CarbonLocation, router: "tomorrow" },
  { id: 3, icon: QuillCalendar, router: "history" },
  { id: 4, icon: FluentNews20Regular, router: "news" },
  { id: 5, icon: EpSetting, router: "dashboard" },
]);

const onChangeTheme = (value) => {};
</script>

<style lang="scss" scoped>
.aside {
  background-color: $main;
  width: 70px;
  height: calc(100vh - 60px);
  position: fixed;
  top: 30px;
  border-radius: 20px;
  padding: 20px 0;
  overflow: hidden;

  // переменные для switch
  --width: 45px;
  --height: 26px;
  --offset: 3px;

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
          #c7c7c7a4 0%,
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
      color: #cfcfcf;
    }
  }
  &__bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    svg {
      font-size: 20px;
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
    background-color: $grey;
    box-shadow: 0 0 10px #00000084;

    svg {
      color: #fff;
    }
  }
}
</style>

<style lang="scss"></style>
