<template>
  <div v-if="can('read', 'User')" @click="isOpen = !isOpen" class="panel">
    <Avatar
      v-if="!authStore.user?.image"
      class="panel-avatar"
      :image="getImageUrl('profile-avatar.svg')"
      shape="circle"
    >
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
  </div>
  <Drawer
    v-model:visible="isOpen"
    position="right"
    :pt="getClasses('panel').drawer"
  >
    <template #header>
      <div class="drawer__header">
        <Avatar
          v-if="!authStore.user?.image"
          class="panel-avatar drawer-avatar"
          shape="circle"
        >
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
          class="panel-avatar drawer-avatar"
        />
        <p class="drawer-name">
          {{
            authStore.user?.name
              ? authStore.user?.name
              : getUsername(authStore.user?.email)
          }}
        </p>
      </div>
    </template>
    <Divider />
    <ul class="panel__list">
      <li
        class="panel__list-item"
        v-for="item in menu"
        :key="item"
        @click.prevent="item.action ? item.action() : null, hideDropdown()"
      >
        <p class="panel__list-icon">
          <component :is="item.icon" />
        </p>
        <p class="panel__list-text">{{ item.label }}</p>
      </li>
    </ul>
    <Divider />
    <template #footer>
      <div class="drawer__footer">
        <Button
          @click="authStore.logoutUser(), hideDropdown()"
          severity="danger"
          outlined
        >
          <i-line-md:logout />
          {{ $t("buttons.logout") }}</Button
        >
      </div>
    </template>
  </Drawer>
  <router-link
    v-if="can('visit', 'SignIn')"
    :to="{ name: 'SignIn' }"
    class="panel"
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
  </router-link>
</template>

<script setup>
import { ref, shallowRef, inject, computed } from "vue";
import TeenyiconsUserCircleSolid from "~icons/teenyicons/user-circle-solid";
import IonSettingsOutline from "~icons/ion/settings-outline";
import { getImageUrl, getUsername } from "@/utils/index";
import { getClasses } from "@/utils/classes";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/router";
import { useAbility } from "@casl/vue";
import Drawer from "primevue/drawer";

const authStore = useAuthStore();
const { can } = useAbility();
const t = inject("t");

const isOpen = ref(false);

const menu = computed(() => [
  {
    label: t("panel.profile"),
    icon: TeenyiconsUserCircleSolid,
    action: () => {
      router.push({ name: "ProfileUser" });
    },
  },
  {
    label: t("setting.title"),
    icon: IonSettingsOutline,
    action: () => {
      router.push({ name: "SettingUser" });
    },
  },
]);

const hideDropdown = () => {
  isOpen.value = false;
};
</script>

<style lang="scss" scoped>
@include Panel();
.panel {
  background-color: var(--grey);
  border-radius: 50%;
  height: 50px;
  width: 50px;
  transition: height 0.3s;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 0 10px #000;
  cursor: pointer;

  &__list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__list-item {
    display: flex;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 10px;
    transition: background-color 0.3s;
    cursor: pointer;
    &:hover {
      background-color: #ffffff1e;
    }
  }

  &__list-icon {
    display: flex;
    color: var(--white);
    svg {
      font-size: 18px;
    }
  }

  &__list-text {
    font-size: 15px;
    color: var(--white);
  }
}
.panel-avatar {
  height: 100%;
  width: 100%;
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
.drawer {
  &__header {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  &-name {
    color: var(--white);
  }
  &-avatar {
    width: 50px;
    height: 50px;
  }
  &__footer {
    display: flex;
    justify-self: flex-end;
  }
}
</style>

<style lang="scss">
.panel {
  &-drawer {
    width: 280px;
    border: none;
    border-left: 1px solid #3c3c3c;
    border-radius: 20px 0 0 20px;
    background-color: var(--modal);

    &-mask {
      z-index: 1500 !important;
    }

    .p-drawer-close-button {
      color: var(--grey-light);
      &:hover {
        background-color: var(--hover-grey);
      }
    }
    .p-button-outlined.p-button-danger {
      border-color: var(--red-dark);
      color: var(--red-light);
    }
  }
}
</style>
