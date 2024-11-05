<template>
  <router-link
    v-if="!authStore.user"
    :to="{ path: '/forecast/signin' }"
    class="panel"
  >
    <div class="panel__top panel__top-login">
      <img class="panel-avatar" src="@/img/avatar.svg" alt="avatar" />
      <p class="panel-name-login">Login</p>
    </div>
  </router-link>
  <div
    v-else
    ref="panel"
    :class="['panel', { 'is--open': isOpen }]"
    :style="{ height: isOpen ? `${panel?.scrollHeight}px` : undefined }"
    v-on-click-outside="hideDropdown"
  >
    <div @click="isOpen = !isOpen" class="panel__top">
      <Avatar
        class="panel-avatar"
        :image="getImageUrl('avatar.svg')"
        shape="circle"
      />
      <p class="panel-name">Teddy Harper</p>
      <div class="panel-arrow">
        <i-iconamoon:arrow-down-2 />
      </div>
    </div>
    <div class="panel__content">
      <ul class="panel__list">
        <li
          class="panel__list-item"
          v-for="item in menu"
          :key="item"
          @click.prevent="item.action ? item.action() : null"
        >
          <p class="panel__list-icon">
            <component :is="item.icon" />
          </p>
          <p class="panel__list-text">{{ item.label }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, shallowRef } from "vue";
import IcRoundControlPoint from "~icons/ic/round-control-point";
import BitcoinIconsExitFilled from "~icons/bitcoin-icons/exit-filled";
import { getImageUrl } from "@/utils/index";
import { useAuthStore } from "@/stores/auth";
import { vOnClickOutside } from "@vueuse/components";

const authStore = useAuthStore();

const panel = ref();
const isOpen = ref(false);

const menu = shallowRef([
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Menu",
    icon: IcRoundControlPoint,
  },
  {
    label: "Exit",
    icon: BitcoinIconsExitFilled,
    action: authStore.logoutUser,
  },
]);

const hideDropdown = () => {
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
.panel {
  background-color: $grey;
  border-radius: 20px;
  height: 50px;
  transition: height 0.3s;
  overflow: hidden;
  position: absolute;
  right: 0;
  z-index: 100;
  box-shadow: 0 0 10px #000;

  &__top {
    padding: 10px 25px 10px 10px;
    display: flex;
    align-items: center;
    height: 50px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 20px;

    &:hover {
      background-color: #ffffff1c;
    }
  }

  &__content {
    padding: 10px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__list-item {
    display: flex;
    gap: 5px;
    padding: 7px 5px;
    border-radius: 10px;
    transition: background-color 0.3s;
    cursor: pointer;
    &:hover {
      background-color: #ffffff41;
    }
    &:last-child {
      margin-top: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        background-color: $grey-light;
        height: 1px;
        width: calc(100% - 10px);
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  &__list-icon {
    display: flex;
    svg {
      font-size: 16px;
    }
  }

  &__list-text {
    font-size: 14px;
  }
}
.panel-avatar {
  height: 35px;
  width: 35px;
  img {
    height: 100%;
    width: 100%;
  }
}
.panel-name {
  padding: 0 20px 0 5px;
  font-size: 14px;
}
.panel-arrow {
  display: flex;
  align-items: center;
  svg {
    transition: all 0.3s;
  }
}

.is--open {
  .panel-arrow {
    svg {
      transform: rotate(180deg);
    }
  }
}

// login
.panel-name-login {
  padding: 0 10px;
  font-size: 16px;
  color: $white;
}
.panel__top-login {
  padding: 10px;
}
</style>
