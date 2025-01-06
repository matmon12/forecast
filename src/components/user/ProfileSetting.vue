<template>
  <div class="setting">
    <h1 class="setting-title">{{ $t("profile.title") }}</h1>

    <Message
      v-if="saveError"
      severity="error"
      :closable="!uiStore.xs2Smaller"
      :pt="getClasses('setting').message"
    >
      <i-ion:warning-outline />
      <div class="setting-message-info">
        <h6 class="setting-message-title">
          {{
            saveError?.operation === "upload" ||
            saveError?.operation === "update"
              ? $t("errors.info.edit")
              : $t("errors.image.delete")
          }}
        </h6>
        <p class="setting-message-description">
          {{ $t(`errors.process.${saveError?.process}`) }}
          {{ $t(`error_codes.${saveError?.description}`) }}
        </p>
      </div>
    </Message>

    <Message
      v-if="saveSuccess"
      severity="info"
      :closable="!uiStore.xs2Smaller"
      :life="5000"
      :pt="getClasses('setting').message"
    >
      <i-mingcute:check-line />
      <div class="setting-message-info">
        <h6 class="setting-message-title">{{ $t("success.profile.title") }}</h6>
        <p class="setting-message-description">
          {{ $t("success.profile.description") }}
        </p>
      </div>
    </Message>

    <ImageUpload
      v-model:image="image"
      v-model:file="file"
      :id="authStore.uid"
      path="images/users/"
    />
    <form class="setting__form">
      <div class="setting__form-item">
        <label class="setting__form-label field-required" for="name">{{
          $t("profile.labels.name")
        }}</label>
        <IconField class="setting-iconfield">
          <InputText
            v-model.trim="name"
            id="name"
            autofocus
            :placeholder="$t('placeholders.profile-name')"
            :invalid="errors.name ? true : false"
            :pt="getClasses('setting').inputtext"
          />
          <InputIcon
            v-if="name"
            @click="resetField('name')"
            :pt="getClasses('setting').inputicon"
            unstyled
          >
            <i-majesticons:close />
          </InputIcon>
          <transition name="fade">
            <small v-if="errors.name" class="error">{{
              $t(`validation.${errors.name?.key || errors.name}`, {
                ...errors.name?.values,
              })
            }}</small>
          </transition>
        </IconField>
      </div>
      <div class="setting__form-item">
        <label class="setting__form-label field-required" for="lastname">{{
          $t("profile.labels.lastname")
        }}</label>
        <IconField class="setting-iconfield">
          <InputText
            v-model.trim="lastname"
            id="lastname"
            :placeholder="$t('placeholders.profile-lastname')"
            :invalid="errors.lastname ? true : false"
            :pt="getClasses('setting').inputtext"
          />
          <InputIcon
            v-if="lastname"
            @click="resetField('lastname')"
            :pt="getClasses('setting').inputicon"
            unstyled
          >
            <i-majesticons:close />
          </InputIcon>
          <transition name="fade">
            <small v-if="errors.lastname" class="error">{{
              $t(`validation.${errors.lastname?.key || errors.lastname}`, {
                ...errors.lastname?.values,
              })
            }}</small>
          </transition>
        </IconField>
      </div>
      <div class="setting__form-item">
        <label class="setting__form-label">{{
          $t("profile.labels.country")
        }}</label>
        <Select
          ref="select"
          v-model="country"
          :options="countriesList"
          optionLabel="name"
          optionValue="flag"
          :placeholder="$t('placeholders.country')"
          filter
          :filterPlaceholder="$t('placeholders.country-filter')"
          filterMatchMode="startsWith"
          showClear
          autoFilterFocus
          :pt="{
            ...getClasses('setting').select,
            pcFilter: {
              ...getClasses('setting').inputtext,
            },
            overlay: {
              style: {
                width: '200px',
              },
            },
          }"
        >
          <template #value="{ value, placeholder }">
            <div v-if="value" class="setting-select-labelwrap">
              <country-flag
                :country="value"
                rounded
                class="setting-select-optionicon"
              />
              <span class="setting-select-optionlabel">{{
                countries.getName(value, locale)
              }}</span>
            </div>
            <span v-else>
              {{ placeholder }}
            </span>
          </template>
          <template #option="{ option }">
            <country-flag
              :country="option.flag"
              rounded
              class="setting-select-optionicon"
            />
            <span class="setting-select-optionlabel">{{ option.name }}</span>
          </template>
        </Select>
      </div>
      <div class="setting__form-item">
        <label class="setting__form-label">{{
          $t("profile.labels.phone")
        }}</label>
        <div class="setting__form-tel">
          <vue-tel-input
            v-model="phone.number"
            v-bind="telProps"
            :class="{ 'p-invalid': phoneValid === false }"
            @keypress="onValidatePhone"
            @open="onDropdownOpen(true)"
            @close="onDropdownOpen(false)"
            @validate="
              (e) => {
                phoneValid = e.valid;
                phone.country = e.countryCode;
              }
            "
          >
            <template v-slot:arrow-icon>
              <span class="setting__tel-icon">
                <i-ep:arrow-up-bold />
              </span>
            </template>
          </vue-tel-input>
          <button
            v-if="phone.number"
            @click.prevent="phone = { ...phoneDefault }"
            class="setting__form-tel-btn"
          >
            <i-majesticons:close />
          </button>
          <transition name="fade">
            <small v-if="phoneValid === false" class="error">{{
              $t("valid.phone")
            }}</small>
          </transition>
        </div>
      </div>
    </form>
    <div class="setting__btns">
      <Button @click="resetData" :pt="getClasses('no').button" unstyled
        ><i-iconoir:cancel />{{ $t("buttons.cancel") }}</Button
      >
      <Button @click="onSubmit" :pt="getClasses('yes').button" unstyled
        ><i-ic:round-check /> {{ $t("buttons.save") }}</Button
      >
    </div>

    <transition>
      <Spinner v-if="saveLoading" size="50" />
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, inject, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { uploadImage, deleteImage } from "@/server/storage";
import { updateToDB } from "@/server/users";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useServerStore } from "@/stores/server";
import { getClasses } from "@/utils/classes";
import InputIcon from "primevue/inputicon";
import IconField from "primevue/iconfield";
import Select from "primevue/select";
import CountryFlag from "vue-country-flag-next";
import { deleteField } from "firebase/firestore";
import { ability } from "@/services/ability";
import { useUiStore } from "@/stores/ui";
import Tr from "@/i18n/translation";
import { useI18n } from "vue-i18n";
import allCountries from "@/utils/all-countries";

const authStore = useAuthStore();
const rulesStore = useRulesStore();
const serverStore = useServerStore();
const uiStore = useUiStore();
const t = inject("t");
const countries = inject("countries");
const countriesList = ref();
const { locale } = useI18n();

const file = ref();
const image = ref();
const select = ref();
const country = ref();
const phoneDefault = {
  number: null,
  country: "RU",
};
const phone = ref({ ...phoneDefault });
const phoneValid = ref();
const openDropdownTel = ref(false);
const saveError = ref();
const saveLoading = ref(false);
const saveSuccess = ref(false);
const countriesPhone = ref();
const telProps = computed(() => ({
  allCountries: countriesPhone.value,
  preferredCountries: ["US", "RU"],
  mode: "auto",
  inputOptions: {
    showDialCode: true,
    placeholder: t("placeholders.phone"),
  },
  disabledFormatting: false,
  defaultCountry: authStore.user?.phone?.country
    ? authStore.user.phone.country
    : "RU",
  wrapperClasses: "setting",
}));

// validate
const {
  defineField,
  resetField,
  handleSubmit,
  values,
  errors,
  resetForm,
  setFieldValue,
} = useForm({
  validationSchema: rulesStore.schemaProfileSetting,
});

const [name] = defineField("name", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [lastname] = defineField("lastname", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});

// проверка роли
const onCheckRole = () => {
  if (ability.can("update", "User")) {
    saveInfoUser();
  }
};

const saveInfoUser = async () => {
  saveError.value = null;
  saveLoading.value = true;
  saveSuccess.value = false;
  let success = false;

  // проверка дублирования для всех и проверка наличия для опциональных свойств
  const infoUser = {
    ...(authStore.user?.name !== values.name && { name: values.name }),
    ...(authStore.user?.lastname !== values.lastname && {
      lastname: values.lastname,
    }),
    ...(country.value &&
      authStore.user?.country !== country.value && {
        country: country.value,
      }),
    ...(phoneValid.value === true &&
      authStore.user?.phone?.number !== phone.value.number && {
        phone: { number: phone.value.number, country: phone.value.country },
      }),
    ...(image.value &&
      authStore.user?.image !== image.value && { image: image.value }),
  };

  try {
    if (file.value) {
      await uploadImage(image.value, file.value, "images/users/");
    }

    // удаление свойств для очищенных опциональных полей (удаленно)
    const infoUserDB = {
      ...infoUser,
      ...(!country.value && authStore.user?.country
        ? { country: deleteField() }
        : {}),
      ...(!phone.value.number && authStore.user?.phone
        ? { phone: deleteField() }
        : {}),
      ...(!image.value && authStore.user?.image
        ? { image: deleteField() }
        : {}),
    };

    await updateToDB(authStore.uid, infoUserDB);

    success = true;

    // если загруженное изображение удалено или заменено другим
    if (
      (!image.value && authStore.user?.image) ||
      (file.value &&
        authStore.user?.image &&
        image.value !== authStore.user?.image)
    ) {
      await deleteImage(authStore.user?.image, "images/users/");
    }
  } catch (e) {
    const stringToObject = JSON.parse(e.message);
    saveError.value = stringToObject;
  } finally {
    if (success) {
      // локальные данные
      Object.assign(authStore.user, infoUser);
      // удаление свойств для очищенных опциональных полей (локально)
      if (!image.value && authStore.user?.image) {
        delete authStore.user.image;
      }
      if (!country.value && authStore.user?.country) {
        delete authStore.user.country;
      }
      if (!phone.value.number && authStore.user?.phone) {
        delete authStore.user.phone;
      }

      // удаление url на старую картинку
      serverStore.setUrl(authStore.uid, null);
      // для получения изображения из storage
      file.value = null;

      saveSuccess.value = true;
    }
    saveLoading.value = false;
  }
};

const onSubmit = handleSubmit((value) => {
  if (phoneValid.value !== false) {
    onCheckRole();
  }
});

// dropdown tel
const onDropdownOpen = (value) => {
  openDropdownTel.value = value;
};

onMounted(() => {
  initValues();
});

// init values
const initValues = () => {
  image.value = authStore.user?.image;
  country.value = authStore.user?.country;
  authStore.user?.phone && (phone.value = { ...authStore.user.phone });
  setFieldValue("name", authStore.user?.name, false);
  setFieldValue("lastname", authStore.user?.lastname, false);
};

// load locales counties
const switchLanguageCountries = async (locale) => {
  await Tr.loadLocaleCountries(locale);

  const countriesName = countries.getNames(locale, { select: "official" });
  const keys = Object.keys(countriesName);
  const values = Object.values(countriesName);
  countriesList.value = keys.map((item, index) => ({
    flag: item,
    name: values[index],
  }));

  // для телефона
  countriesPhone.value = allCountries.map(([iso2, dialCode]) => ({
    name: countries.getName(iso2, locale),
    iso2: iso2.toUpperCase(),
    dialCode,
  }));
};

watch(
  () => locale.value,
  (newLocale) => {
    switchLanguageCountries(newLocale);
  },
  {
    immediate: true,
  }
);

// reset
const resetData = () => {
  image.value = null;
  file.value = null;
  country.value = null;
  phone.value = { ...phoneDefault };
  setFieldValue("name", null, false);
  setFieldValue("lastname", null, false);
};

// only numbers and "+" for phone
const onValidatePhone = (e) => {
  const key = e.key;
  if (!/^[0-9+]*$/.test(key)) {
    e.preventDefault();
  }
};
</script>

<style lang="scss" scoped>
@include ProfileSetting();
.setting {
  @include Card();
  height: min-content;
  padding-bottom: 20px;
  overflow: visible;
  position: relative;
}
.setting-title {
  font-size: 28px;
  font-weight: 500;
  margin-bottom: 15px;
}

:deep() {
  .no,
  .yes {
    &-btn {
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
    }
  }
  .yes-btn {
    background-color: var(--blue-360);
    &:not(:disabled):hover {
      filter: brightness(1.1);
    }
    &:disabled {
      opacity: 0.7;
      cursor: default;
    }
  }
  .no-btn {
    background-color: var(--grey-900);
    color: var(--grey-50);
    &:not(:disabled):hover {
      background-color: var(--cancel-hover);
    }
    &:disabled {
      cursor: default;
      opacity: 0.6;
    }
  }
}

.setting-iconfield {
  z-index: 0;
}
.setting__form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 20px 0 40px;
}
.setting__form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.setting__form-label {
  font-size: 14px;
  line-height: 1;
}
.field-required {
  &::after {
    content: "*";
    color: rgb(255, 62, 62);
    font-size: 16px;
    margin-left: 5px;
  }
}
.setting__btns {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

:deep() {
  .setting {
    &-inputtext {
      width: 100%;
      height: 40px;
      font-size: 15px;
      padding-right: 35px;
      background-color: var(--grey-960);
      color: var(--white);

      &::placeholder {
        color: var(--placeholder-filter);
      }

      &:not(.p-invalid):enabled:focus {
        @include Focus();
      }
      &.p-invalid {
        @include Invalid();
      }
    }
    &-inputicon {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      justify-content: center;
      font-size: 18px;
      color: var(--grey-100);
      cursor: pointer;
      height: 100%;
      width: 35px;
    }
    &-select {
      height: 40px;
      background-color: var(--grey-960);

      &:not(.p-disabled).p-focus {
        @include Focus();
      }
      &.p-select-open {
        .setting-select-dropdownicon {
          transform: rotate(180deg);
        }
      }
      &-label {
        font-size: 15px;
        color: var(--white);

        .setting-select-optionlabel {
          max-width: 150px;
        }
      }
      &-labelwrap {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      &-dropdown {
      }
      &-dropdownicon {
        transition: transform 0.3s;
      }
      svg {
        width: 14px;
        color: var(--placeholder-filter);
      }
    }
  }
}
// flag
.setting-select-optionicon.normal-flag {
  margin: -0.6em -0.9em -0.6em -0.7em;
  border: 1px solid #000;
}

// tel
.setting__form-tel {
  position: relative;
  z-index: 100;
  &-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 18px;
    height: 100%;
    width: 35px;
    color: var(--grey-100);
  }
}
.vue-tel-input {
  border-radius: 6px;
  border-color: #3f3f46;
  background-color: var(--grey-960);
  height: 40px;
  transition: border 0.3s, box-shadow 0.3s;
  position: relative;

  &:focus-within {
    @include Focus();
  }
  &.p-invalid {
    @include Invalid();
  }
}
.setting__tel-icon {
  font-size: 10px;
  display: flex;
}
:deep() {
  .vti__dropdown {
    border-radius: 6px;
    transition: background-color 0.3s;
    position: static;
    &:hover {
      background-color: var(--blue-100);
      color: #000;
    }
    &.open {
      background-color: var(--blue-100);
      color: #000;
      .setting__tel-icon {
        transform: rotate(180deg);
      }
    }
  }
  .vti__selection {
    gap: 3px;
  }
  .setting__tel-icon {
    transition: transform 0.3s;
  }
  .vti__input {
    padding-right: 35px;
    font-size: 15px;
    &::placeholder {
      color: var(--placeholder-filter);
    }
  }
  .vti__flag {
    border-radius: 4px;
    // border: 1px solid #000;
  }
  .vti__dropdown-list {
    max-height: 200px;
    background-color: var(--modal);
    border-color: #3f3f46;
    width: 100%;
    border-radius: 6px;
    z-index: 1000 !important;
    @include Scroll(7px, 7px, var(--grey-880), var(--grey-350));
  }
  .vti__dropdown-item {
    padding: 10px 5px;
    color: var(--white);
    font-size: 13px;
    transition: background-color 0.3s;
    border-radius: 5px;

    strong {
      font-weight: 400;
    }
    span {
      color: var(--blue-200);
    }
    &.highlighted {
      background-color: var(--blue-670);
    }
    &.last-preferred {
      border: none;
      position: relative;
      &::after {
        content: "";
        width: 100%;
        height: 1px;
        background-color: #3f3f46;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
    .vti__flag {
      margin-right: 10px;
    }
  }
}

// error
.error {
  font-size: 12px;
  font-weight: 500;
  // white-space: nowrap;
}

// error message
:deep() {
  .setting {
    &-message {
      overflow: hidden;
      margin-bottom: 20px;
      &-content {
        padding-top: 15px;
        padding-bottom: 15px;
        display: flex;
      }
      &-title {
        font-weight: 600;
        font-size: 17px;
      }
      &-text {
        display: flex;
        font-size: 14px;
        align-items: center;
        gap: 10px;
        svg {
          font-size: 20px;
          min-width: 40px;
        }
        span {
          width: 100%;
        }
      }
      &-description {
        color: var(--white-4);
      }
      &.p-message-error {
        color: #ef4444;
        outline-color: var(--message-error);
        background-color: var(--toast-error);
        .setting-message-content {
          border-left: 4px solid #ef4444;
        }
        .setting-message-close-button:hover {
          background-color: var(--white-1);
        }
      }
      &.p-message-info {
        color: #3b82f6;
        outline-color: var(--message-info);
        background-color: var(--success-back-2);
        .setting-message-content {
          border-left: 4px solid #3b82f6;
        }
        .setting-message-close-button:hover {
          background-color: var(--white-0);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.setting-select {
  &-overlay {
  }
  &-listcontainer {
    @include Scroll(7px, 7px, var(--grey-880), var(--grey-350));
  }
  &-list {
    gap: 5px;
  }
  &-option {
    align-items: center;
    gap: 15px;
    color: var(--white);

    &:not(.p-select-option-selected):not(.p-disabled).p-focus {
      background: var(--grey-970);
    }

    &.p-select-option-selected {
      background-color: var(--blue-670);
      transition: filter 0.3s;
      &:hover {
        filter: brightness(var(--brightness-rating));
      }
    }
  }
  &-optionlabel {
    line-height: 1;
    display: block;
    font-size: 14px;
    white-space: wrap;
    @include TextOverflow(1);
  }
  &-optionicon {
    &.flag {
      display: flex;
      min-width: 52px;
    }
  }
}
.p-select-overlay {
  background-color: var(--modal);
  color: var(--white);
}
.setting-inputtext {
  background-color: var(--grey-960);
  color: var(--white);

  &::placeholder {
    color: var(--placeholder-filter);
  }
}
.p-inputicon {
  color: var(--placeholder-filter);
}

// select dropdown filter
.setting {
  &-inputtext {
    width: 100%;
    height: 40px;
    font-size: 15px;
    padding-right: 35px;
    &:not(.p-invalid):enabled:focus {
      @include Focus();
    }
  }
}
</style>
