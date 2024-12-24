<template>
  <div class="lang">
    <Select
      v-model="selectedLocale"
      @change="({ value }) => switchLanguage(value)"
      :options="supportedLocales"
      appendTo="self"
      :pt="getClasses('lang').select"
    >
      <template #option="{ option }">
        <CountryFlag :country="option" rounded />
      </template>
      <template #value="{ value }">
        <CountryFlag :country="value" rounded />
      </template>
      <template #dropdownicon><i-iconamoon:arrow-down-2 /></template>
    </Select>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import Tr from "@/i18n/translation";
import router from "@/router/router";
import Select from "primevue/select";
import { watch, ref } from "vue";
import { getClasses } from "@/utils/classes";
import CountryFlag from "vue-country-flag-next";

const { t, locale } = useI18n({});
const supportedLocales = Tr.supportedLocales;

const selectedLocale = ref();
watch(
  () => locale.value,
  () => {
    selectedLocale.value = locale.value;
  },
  {
    immediate: true,
  }
);

const switchLanguage = async (newLocale) => {
  await Tr.switchLanguage(newLocale);

  // изменить локаль в маршруте
  try {
    await router.replace({ params: { locale: newLocale } });
  } catch (err) {
    console.error(err);
    router.push({ name: "Home" });
  }
};
</script>

<style lang="scss" scoped>
@include LanguageSwitcher();
.lang {
  height: 50px;

  &-select {
    background: var(--grey);
    border: none;
    border-radius: 20px;
    outline: none;
    box-shadow: 0 0 10px #000;
    height: 100%;
    transition: background-color 0.3s;

    &:hover {
      background-color: #ffffff25;
    }

    &-label {
    }
    &-dropdown {
    }
    &-dropdownicon {
    }
    &-overlay {
    }
    &-listcontainer {
    }
    &-list {
    }
    &-option {
    }
    &-optionlabel {
    }
  }
  :deep() {
    .lang-select.p-select-open {
      .lang-select-dropdown svg {
        transform: rotate(180deg);
      }
    }
    .lang-select-label {
      display: flex;
      align-items: center;
    }
    .lang-select-dropdown {
      width: min-content;
      padding-right: 10px;
      color: var(--white);
      svg {
        transition: transform 0.3s;
      }
    }
    .normal-flag {
      margin: -0.5em -0.9em -0.6em -0.7em;
      border: 1px solid #000;
    }
    .lang-select-overlay {
      background-color: var(--grey);
      border: none;
      box-shadow: 0 0 10px #000;
      border-radius: 10px;
    }
    .lang-select-option {
      justify-content: center;
      padding: var(--p-select-option-padding);
      border-radius: 8px;
      transition: background-color .3s, filter .3s;
      .normal-flag {
        margin: -0.6em -0.7em;
      }
      &:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background-color: var(--grey);
        filter: brightness(var(--brightness-rating));
      }
      &.p-select-option-selected {
        background-color: var(--blue-630);
      }
    }
  }
}
</style>
