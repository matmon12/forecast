p
<template>
  <div class="set">
    <button class="set-btn" @click="visible = true">
      <i-mingcute:settings-6-line />
      {{ $t("buttons.dataset") }}
    </button>

    <Drawer
      v-model:visible="visible"
      position="right"
      :pt="getClasses('set').drawer"
    >
      <template #header>
        <h1 class="set-drawer-title">{{ $t("dataset.title") }}</h1>
      </template>
      <p class="set-drawer-text">
        {{ $t("dataset.text") }}
      </p>
      <Divider />
      <div class="data__list">
        <div
          v-for="item of Object.keys(parametersModel)"
          :key="item"
          class="data__list-item"
        >
          <label class="data__list-label">
            <ToggleSwitch
              v-model="parametersModel[item].enabled"
              :pt="getClasses('set').toggleswitch"
              @update:modelValue="(value) => saveParametersUser(item, value)"
              :disabled="loading"
            />
            <p class="data__list-text">
              {{ $t(`dataset.parameters.${item}`) }}
            </p>
          </label>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script setup>
import { ref, defineModel, onMounted } from "vue";
import Drawer from "primevue/drawer";
import ToggleSwitch from "primevue/toggleswitch";
import { getClasses } from "@/utils/classes";
import { updateToDB } from "@/server/users";
import { useAuthStore } from "@/stores/auth";

const visible = ref(false);
const loading = ref(false);
const parametersModel = defineModel();

const authStore = useAuthStore();

const saveParametersUser = async () => {
  loading.value = true;

  const updatedField = {
    parameters: Object.keys(parametersModel.value).reduce((acc, key) => {
      acc[key] = parametersModel.value[key].enabled;
      return acc;
    }, {}),
  };

  try {
    await updateToDB(authStore.uid, updatedField);
  } catch (err) {
  } finally {
    loading.value = false;
  }
};

const getParametersUser = () => {
  const parametersUser = authStore.user?.parameters;
  if (parametersUser) {
    Object.entries(parametersUser).forEach((parameter) => {
      parametersModel.value[parameter[0]].enabled = parameter[1];
    });
  }
};

onMounted(() => {
  getParametersUser();
});
</script>

<style lang="scss" scoped>
@include DataSet();

.set {
}
.set-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1;
  border-radius: 7px;
  padding: 0 10px;
  color: var(--black-3);
  font-weight: 500;
  transition: background-color 0.3s, color 0.3s, filter 0.3s;
  height: 35px;

  background-color: var(--blue-360);
  &:not(:disabled):hover {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.set-drawer {
  &-title {
    color: var(--white);
    font-weight: 600;
    font-size: 20px;
  }
  &-text {
    color: var(--white);
    font-size: 14px;
  }
}

.data__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  &-label {
    display: flex;
    gap: 10px;
  }
  &-text {
    color: var(--white);
    font-size: 14px;
  }
}
</style>

<style lang="scss">
.set {
  &-drawer {
    width: 280px;
    border: none;
    border-left: 1px solid #3c3c3c;
    border-radius: 20px 0 0 20px;
    background-color: var(--modal);

    &-mask {
      z-index: 1500 !important;
    }

    &-header {
      padding-bottom: 5px;
    }

    .p-drawer-close-button {
      min-width: 30px;
      height: 30px;
      color: var(--grey-light);
      align-self: flex-start;
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

.set {
  &-toggleswitch {
    height: 22px;
    --p-toggleswitch-width: 38px;
    min-width: var(--p-toggleswitch-width);

    &-slider {
      background-color: var(--switch-slider);

      &::before {
        background-color: #fff;
        box-shadow: 0 0 7px #000;
        --p-toggleswitch-handle-size: 17px;
        --p-toggleswitch-gap: 3px;
      }
    }

    &.p-toggleswitch-checked &-slider {
      background-color: var(--blue-2);
      &::before {
        background-color: #fff;
      }
    }

    &.p-disabled {
      &:not(.p-toggleswitch-checked) .set-toggleswitch-slider {
        opacity: var(--switch-slider-disabled-opacity);
      }

      &.p-toggleswitch-checked .set-toggleswitch-slider {
        opacity: var(--switch-slider-checked-disabled-opacity);
      }
    }
  }
}
</style>
