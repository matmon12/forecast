<template>
  <InputGroup
    :class="[
      'search-input-wrap',
      { 'p-invalid': errors.search, 'p-valid': meta.valid },
    ]"
  >
    <button
      @click="onSubmit"
      class="search-input-icon"
      :disabled="searchStore.loading || !enabledSearch.includes($route.name)"
    >
      <i-mingcute:search-line />
    </button>
    <InputText
      ref="searchInput"
      class="search-input"
      type="text"
      v-model="search"
      placeholder="Search City"
      unstyled
      autofocus
      @keyup.enter="!searchStore.loading ? onSubmit() : undefined"
      @focus="focusInput = true"
      @blur="focusInput = false"
      :disabled="!enabledSearch.includes($route.name)"
    />
    <InputGroupAddon v-if="searchStore.loading" class="search-loading" unstyled>
      <i-svg-spinners:ring-resize />
    </InputGroupAddon>
    <transition>
      <button
        @click="resetForm"
        v-if="search && focusInput"
        class="search-input-clear"
      >
        <i-lets-icons:close-round />
      </button>
    </transition>
    <transition name="fade">
      <small class="error search-error" v-if="errors.search && focusInput">
        {{ errors.search }}
      </small>
    </transition>
  </InputGroup>

</template>

<script setup>
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useForm, useField } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useSearchStore } from "@/stores/search";
import { ref, toValue, watch } from "vue";

const rulesStore = useRulesStore();
const searchStore = useSearchStore();
const focusInput = ref();
const enabledSearch = ref(["Home", "Tomorrow", "History"]);

// validate
const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaSearch,
});

const [search] = defineField("search");

const { meta } = useField("search");

const onSubmit = handleSubmit((value) => {
  searchStore.search = value.search;
});

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
</script>

<style lang="scss" scoped>
.search {
  &-input-wrap {
    width: 400px;
    background-color: $grey;
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
    cursor: pointer;
    padding: 15px;
    &:disabled {
      color: grey;
      cursor: default;
    }
  }
  &-input {
    font-size: 14px;
    flex-grow: 1;
    &::placeholder {
      color: $grey-light;
      font-size: 14px;
    }
  }
  &-input-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 20px;
      color: rgb(185, 185, 185);
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
  &-error {
    font-weight: 500;
  }
}
</style>

<style lang="scss">
.search-input-wrap {
  &.p-invalid:focus-within {
    border: 1px solid rgb(255, 26, 26);
    box-shadow: 0 0 10px rgb(255, 124, 124);
  }
  &.p-valid:focus-within {
    border: 1px solid #57a6f5;
    box-shadow: 0 0 10px #57a6f5;
  }
}
</style>
