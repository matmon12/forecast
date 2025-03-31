<template>
  <div ref="searchElement" class="search">
    <InputGroup class="search-input-wrap">
      <div class="search-input-icon">
        <i-mingcute:search-line />
      </div>
      <AutoComplete
        v-model="search"
        optionLabel="name"
        :suggestions="foundedLocations"
        @complete="fetchLocations"
        @focus="focusInput = true"
        @blur="focusInput = false"
        @option-select="onSubmit"
        :placeholder="$t('placeholders.search')"
        unstyled
        :delay="1000"
        :emptySearchMessage="$t('search.empty')"
        :appendTo="searchElement"
        :disabled="!enabledSearch.includes($route.name) && searchStore.loading"
        :pt="{
          ...getClasses('search').autocomplete,
          pcinput: {
            ...getClasses('search').inputtext,
          },
        }"
      >
        <template #option="{ option }">
          <i-fluent:location-48-regular />
          <div class="search-autocomplete-option-wrap">
            <span class="search-autocomplete-list-name">{{ option.name }}</span>
            <span class="search-autocomplete-list-country">{{
              option.country
            }}</span>
          </div>
          <FavoriteButton
            v-if="can('update', 'User')"
            :id="option.id"
            :loading="loadingAddress"
            @choose="saveAddress(option)"
            class="search-autocomplete-favorite"
            v-tooltip.bottom="{
              escape: false,
              value: $t('setting.favorite_address'),
            }"
          />
        </template>
      </AutoComplete>
      <InputGroupAddon
        v-if="searchStore.loading || searchLoading"
        class="search-loading"
        unstyled
      >
        <i-svg-spinners:ring-resize />
      </InputGroupAddon>
      <transition>
        <button
          @click="search = ''"
          v-if="search && focusInput"
          class="search-input-clear"
        >
          <i-lets-icons:close-round />
        </button>
      </transition>
    </InputGroup>
  </div>
</template>

<script setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useSearchStore } from "@/stores/search";
import { ref, watch, defineEmits, inject } from "vue";
import { getClasses } from "@/utils/classes";
import { SEARCH_URL } from "@/constants";
import { axiosApiInstance } from "@/server/api";
import { useI18n } from "vue-i18n";
import { useSettingStore } from "@/stores/setting";
import { useAuthStore } from "@/stores/auth";
import { updateToDB } from "@/server/users";
import { useToast } from "primevue/usetoast";
import { deleteField } from "firebase/firestore";
import { useAbility } from "@casl/vue";

const searchElement = ref();
const search = ref();
const searchLoading = ref(false);
const foundedLocations = ref();
const focusInput = ref();
const loadingAddress = ref(null);
const enabledSearch = ref(["Home", "Tomorrow", "History"]);

const emits = defineEmits(["submit"]);
const searchStore = useSearchStore();
const settingStore = useSettingStore();
const authStore = useAuthStore();
const toast = useToast();
const { locale } = useI18n({});
const { can } = useAbility();
const t = inject("t");

const fetchLocations = async (event) => {
  searchLoading.value = true;
  try {
    const res = await axiosApiInstance.get(
      `${SEARCH_URL}?q=${event.query.toLowerCase()}&lang=${locale}&code`
    );
    foundedLocations.value = res.data;
  } catch (err) {
    console.error(err);
  } finally {
    searchLoading.value = false;
  }
};

const onSubmit = () => {
  searchStore.search = search.value.name;
  emits("submit");
};

// update input
watch(
  () => searchStore.input,
  (newValue) => {
    if (newValue) {
      search.value = newValue;
    }
    searchStore.input = "";
  }
);

const saveAddress = async (address) => {
  loadingAddress.value = address.id;

  // если совпадают - удаление
  const isSameAddress = settingStore.savedAddress?.id === address.id;

  const updatedFieldsDB = {
    address: isSameAddress
      ? deleteField()
      : { id: address.id, city: address.name },
  };
  const updatedFieldsStore = isSameAddress
    ? null
    : { id: address.id, city: address.name };

  try {
    await updateToDB(authStore.uid, updatedFieldsDB);
    settingStore.savedAddress = updatedFieldsStore;

    toast.add({
      severity: "success",
      summary: t("success.successfully"),
      detail: isSameAddress ? t("success.city.delete") : t("success.city.save"),
      life: 3000,
    });
  } catch (err) {
    const messageError = JSON.parse(err.message);
    toast.add({
      severity: "error",
      summary: isSameAddress
        ? t("errors.address.delete")
        : t("errors.address.save"),
      detail: `${t(`errors.process.${messageError.process}`)} ${t(
        `error_codes.${messageError.description}`
      )}`,
      life: 5000,
    });
  } finally {
    loadingAddress.value = null;
  }
};
</script>

<style lang="scss" scoped>
.search {
  z-index: 1100;
  &-input-wrap {
    width: 400px;
    background-color: var(--grey);
    border-radius: 20px;
    padding: 0px 20px 0 5px;
    display: flex;
    align-items: center;
    position: relative;
    height: 50px;
    transition: all 0.3s;
    box-shadow: 0 0 10px #000;
  }
  &-input-icon {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    color: var(--white);
  }
  &-input-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 20px;
      color: var(--grey-light);
      transition: all 0.3s;
    }
    &:hover {
      svg {
        transform: rotate(90deg);
      }
    }
  }
  &-loading {
    display: flex;
    align-items: center;
    margin-left: 10px;
    svg {
      font-size: 20px;
    }
  }
}

:deep(.search-autocomplete-loader) {
  display: none;
}
.search {
  &-autocomplete {
    flex-grow: 1;

    &-favorite {
      width: 23px;
      height: 23px;
    }
    &-input-multiple {
    }
    &-chip-item {
    }
    &-chip-icon {
    }
    &-input-chip {
    }
    &-dropdown {
    }
    &-dropdown-icon {
    }
    &-virtual-scroller {
    }
    &-list-container {
    }
    &-empty-message {
    }
    &-search-result-message {
    }
    &-selected-message {
    }
  }
}

:deep(.search-inputtext) {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: var(--white);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;

  &::placeholder {
    color: var(--grey-light);
    font-size: 14px;
  }
}
</style>

<style lang="scss">
@include Search();
.search-input-wrap {
  &:focus-within {
    border: 1px solid var(--focus);
    box-shadow: 0 0 10px var(--focus);
  }
}

.search-autocomplete {
  &-overlay {
    @include Card();
    left: 0 !important;
    top: 100% !important;
    width: 100%;
    min-width: auto !important;
    padding-right: 10px;
    padding-left: 0;
    box-shadow: 0 0 10px #000;
    overflow: hidden;
    display: flex;
  }
  &-list {
    @include Scroll(10px, 10px, var(--grey-910), var(--grey-360));
    width: 100%;
    overflow-y: auto;
    padding: 0 5px 0 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &-option-group {
  }
  &-option {
    padding: 5px 10px 5px 5px;
    cursor: pointer;
    border-radius: 7px;
    transition: background-color 0.2s;
    position: relative;
    display: flex;
    align-items: center;
    gap: 7px;

    & + & {
      &::after {
        content: "";
        height: 1px;
        width: 100%;
        background-color: var(--grey-400);
        position: absolute;
        left: 0;
        top: -5px;
      }
    }
    &:hover {
      background-color: var(--grey-610);
    }

    svg {
      min-height: 20px;
      min-width: 20px;
      color: var(--blue-2);
    }
  }

  &-option-wrap {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    flex-grow: 1;
  }

  &-list-name {
    font-weight: 500;
    margin-right: 10px;
    @include TextOverflow(1);
  }
  &-list-country {
    font-size: 14px;
    color: var(--grey-340);
    @include TextOverflow(1);
  }
}

// tooltip
.p-tooltip {
  position: absolute;
  padding: 0.25em 0.35rem;
  max-width: 10.5rem;
}
.p-tooltip .p-tooltip-text {
  background: #fff;
  color: #000;
  padding: 7px 8px;
  box-shadow: 0 0 10px #000;
  border-radius: 6px;
  font-weight: 400;
  line-height: 1.1;
  text-align: center;
}
.p-tooltip .p-tooltip-text {
  font-size: 12px;
}
.p-tooltip.p-tooltip-bottom .p-tooltip-arrow {
  border-bottom-color: #fff;
}
.p-tooltip.p-tooltip-top .p-tooltip-arrow {
  border-top-color: #fff;
}
</style>
