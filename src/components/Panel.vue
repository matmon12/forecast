<template>
  <div
    v-if="can('read', 'User')"
    class="panel"
    v-on-click-outside="hideDropdown"
  >
    <div
      @click="isOpen = !isOpen"
      :class="['panel-top', { 'is--open': isOpen }]"
    >
      <Avatar v-if="!authStore.user?.image" class="panel-avatar" shape="circle">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <g fill="currentColor">
              <path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </g>
          </svg>
        </template>
      </Avatar>
      <Image
        v-else
        :name="authStore.user?.image"
        :id="authStore.uid"
        path="images/users/"
        class="panel-avatar"
      />
      <p class="panel-name">
        {{
          authStore.user?.name
            ? authStore.user?.name
            : getUsername(authStore.user?.email)
        }}
      </p>
      <div class="panel-arrow">
        <i-iconamoon:arrow-down-2 />
      </div>
    </div>
    <transition name="panel">
      <div v-if="isOpen" class="panel-content">
        <ul class="panel__list">
          <li
            class="panel__list-item"
            v-for="item of items"
            :key="item.label"
            @click.prevent="item.action ? item.action() : null, hideDropdown()"
          >
            <p class="panel__list-icon">
              <component :is="item.icon" />
            </p>
            <p class="panel__list-text">{{ item.label }}</p>
          </li>
        </ul>
      </div>
    </transition>
  </div>

  <router-link
    v-if="can('visit', 'SignIn')"
    :to="{ name: 'SignIn' }"
    class="panel-top panel__top-login"
  >
    <p class="panel-avatar">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <g fill="currentColor">
          <path d="M11 6a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
          <path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </g>
      </svg>
    </p>
    <p class="panel-name-login">Login</p>
  </router-link>
</template>

<script setup>
import { ref, markRaw, onMounted } from "vue";
import TeenyiconsUserCircleSolid from "~icons/teenyicons/user-circle-solid";
import BitcoinIconsExitFilled from "~icons/bitcoin-icons/exit-filled";
import { getImageUrl, getUsername } from "@/utils/index";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/router";
import { useAbility } from "@casl/vue";
import { vOnClickOutside } from "@vueuse/components";

const authStore = useAuthStore();
const { can } = useAbility();

const isOpen = ref(false);

const items = markRaw([
  {
    label: "Profile",
    icon: TeenyiconsUserCircleSolid,
    action: () => {
      router.push({ name: "ProfileUser" });
    },
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
@include Panel();
.panel {
  z-index: 100;
  position: relative;

  &-top {
    display: flex;
    align-items: center;
    background-color: var(--grey);
    height: 50px;
    padding: 10px 25px 10px 10px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 0 10px #000;
    cursor: pointer;
    transition: filter 0.3s;

    &:hover {
      filter: brightness(var(--brightness-rating));
    }
  }

  &-content {
    width: 100%;
    padding: 10px;
    position: absolute;
    left: 0;
    top: 100%;
    background-color: var(--grey);
    border-radius: 10px;
    box-shadow: 0 0 10px #000;
    transform-origin: top center;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    &:focus {
      outline: none;
    }
  }

  &__list-item {
    display: flex;
    gap: 7px;
    padding: 7px 5px;
    border-radius: 10px;
    transition: background-color 0.3s;
    cursor: pointer;
    &:last-child {
      margin-top: 15px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        background-color: var(--grey-light);
        height: 1px;
        width: calc(100% - 10px);
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &:hover {
      background-color: #ffffff41;
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
  border-radius: 50%;
  background-color: var(--grey-750);
  svg {
    height: 100%;
    width: 100%;
    color: var(--white-3);
  }
}
:deep() {
  .picture-image-img {
    object-fit: cover;
    height: 100%;
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
  color: var(--white);
}
.panel__top-login {
  padding: 10px;
}
</style>
