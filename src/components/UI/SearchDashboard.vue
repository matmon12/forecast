<template>
  <InputGroup
    :class="[
      'dash-search-input-wrap',
      { 'p-invalid': errors.searchDashboard, 'p-valid': meta.valid },
    ]"
  >
    <InputText
      class="dash-search-input"
      type="text"
      v-model="search"
      placeholder="Search post"
      unstyled
      @focus="focusInput = true"
      @blur="focusInput = false"
      @input="onSubmit"
    />
    <InputGroupAddon v-if="loading" class="dash-search-loading" unstyled>
      <i-svg-spinners:ring-resize />
    </InputGroupAddon>
    <transition>
      <button
        @click="resetForm"
        v-if="search && focusInput"
        class="dash-search-input-clear"
      >
        <i-lets-icons:close-round />
      </button>
    </transition>
    <div class="dash-search-input-icon">
      <i-mingcute:search-line />
    </div>
    <transition name="fade">
      <small class="error" v-if="errors.searchDashboard && focusInput">
        {{ errors.searchDashboard }}
      </small>
    </transition>
  </InputGroup>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import { useForm, useField } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import debounce from "lodash.debounce";

const rulesStore = useRulesStore();
const focusInput = ref();
const loading = ref(false);

const emit = defineEmits(["inputUpdated"]);

// validate
const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: rulesStore.schemaSearchDashboard,
});

const [search] = defineField("searchDashboard");
const { meta } = useField("searchDashboard");

const onSubmit = debounce((event) => {
  emit("inputUpdated", event.target.value);
}, 500);
</script>

<style lang="scss" scoped>
.dash-search {
  &-input-wrap {
    width: 300px;
    background-color: $grey;
    border-radius: 10px;
    padding: 0 0 0 15px;
    display: flex;
    align-items: center;
    position: relative;
    height: 40px;
    transition: all 0.3s;
  }
  &-input-icon {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 10px;
    color: grey;
    cursor: default;
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
      font-size: 18px;
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
      color: #9e9e9e;
      font-size: 16px;
    }
  }
}
</style>
