<template>
  <div class="setting">
    <Breadcrumb :model="breadCrumbItems" />
    <div class="setting__content">
      <h1 class="setting-title">{{ $t("units.title") }}</h1>
      <div class="setting__parameters">
        <div
          v-for="(parameter, indexParam) of parameters"
          :key="`parameter-${indexParam}`"
          class="setting__parameter"
        >
          <h3 class="setting__parameter-title">
            {{ $t(`units.${parameter.value}`) }}
          </h3>
          <ul class="setting__list">
            <li
              v-for="(item, indexValue) of parameter.items"
              :key="`value-${indexParam}${indexValue}`"
              class="setting__list-item"
            >
              <RadioButton
                v-model="settingStore.units[parameter.value]"
                :inputId="`parameter-${indexParam}${indexValue}`"
                :name="parameter.value"
                :value="item.value"
                :pt="getClasses('setting').radiobutton"
                @update:modelValue="(value) => saveUnitsUser(value)"
                unstyled
                :disabled="loading"
                :class="{ 'is-loaded': loading && item.value === lastValue }"
              />
              <label
                :for="`parameter-${indexParam}${indexValue}`"
                class="setting__list-label"
                >{{ $t(`units.${item.value}`) }}</label
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="setting__content">
      <h1 class="setting-title">{{ $t("setting.order.title") }}</h1>
      <p class="setting-text">
        {{ $t("setting.order.description") }}
      </p>
      <button @click="enableDragMode()" class="setting-btn">{{ $t('buttons.gohome') }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, inject } from "vue";
import { getClasses } from "@/utils/classes";
import { useSettingStore } from "@/stores/setting";
import { useAuthStore } from "@/stores/auth";
import { updateToDB } from "@/server/users";
import router from "@/router/router";

const t = inject("t");
const settingStore = useSettingStore();
const authStore = useAuthStore();

const loading = ref(false);
const lastValue = ref();

const parameters = ref([
  {
    label: "Температура",
    value: "temp",
    items: [
      { label: "°C", value: "temp_c" },
      { label: "°F", value: "temp_f" },
    ],
  },
  {
    label: "Ветер",
    value: "wind",
    items: [
      { label: "километры в час (км/ч)", value: "wind_kph" },
      { label: "метры в секунду (м/с)", value: "wind_mps" },
    ],
  },
  {
    label: "Давление",
    value: "pressure",
    items: [
      {
        label: "миллиметры ртутного столба (мм рт. ст.)",
        value: "pressure_mmHg",
      },
      { label: "миллибары (мбар)", value: "pressure_mb" },
    ],
  },
]);

const breadCrumbItems = computed(() => [
  {
    label: t("setting.title"),
  },
]);

const saveUnitsUser = async (value) => {
  loading.value = true;
  lastValue.value = value;

  const updatedField = {
    units: { ...settingStore.units },
  };

  try {
    await updateToDB(authStore.uid, updatedField);
  } catch (err) {
  } finally {
    loading.value = false;
  }
};

const enableDragMode = () => {
  router.push({ name: "Home" });
  settingStore.isDraggable = true;
};
</script>

<style lang="scss" scoped>
@include Setting();

.setting {
  width: 100%;
}
.setting__content {
  @include Card();
  & + & {
    margin-top: 15px;
  }
}
.setting-title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 15px;
}
.setting__parameters {
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
  column-gap: 30px;
}
.setting__parameter {
}
.setting__parameter-title {
  font-weight: 500;
  font-size: 18px;
}
.setting__list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.setting__list-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.setting__list-label {
  line-height: 1.2;
}

.setting-text {
  margin-bottom: 15px;
}

.setting-btn {
  width: fit-content;
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

:deep(.setting-radiobutton) {
  min-width: 20px;
  height: 20px;
  display: flex;
  position: relative;

  &:has(:disabled) {
    & + .setting__list-label {
      cursor: default;
    }

    .setting-radiobutton-input {
      cursor: default;
      & + .setting-radiobutton-box {
        opacity: 0.6;
        cursor: default;
      }
    }
  }

  &:has(:checked) {
    .setting-radiobutton-box {
      border-color: var(--blue-2);
      .setting-radiobutton-icon {
        background-color: var(--blue-2);
        transform: translateZ(0) scale(1);
      }
    }
  }

  &:hover:not(:has(input:checked, input:disabled)) {
    .setting-radiobutton-box {
      border-color: var(--grey-370);
    }
  }

  &.is-loaded {
    .setting-radiobutton-box .setting-radiobutton-icon {
      background-color: transparent;
      border: 2px solid var(--blue-2);
      border-bottom-color: transparent;
      animation: rotation 1s linear infinite;

      @keyframes rotation {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  .setting-radiobutton-input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .setting-radiobutton-box {
    border: 2px solid var(--grey-730);
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.3s;
    background-color: var(--black-3);
  }
  .setting-radiobutton-icon {
    width: 10px;
    height: 10px;
    background-color: transparent;
    border-radius: 50%;
    transition: transform 0.3s;
    transform: translateZ(0) scale(0.1);
  }
}
</style>
