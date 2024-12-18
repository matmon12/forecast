<template>
  <div class="categoryfilter">
    <MultiSelect
      v-model="categoryFilter"
      :options="categories"
      placeholder="Not selected"
      :pt="{
        ...getClasses('category').multiselect,
        pcHeaderCheckbox: { ...getClasses('dashboard').checkbox },
        pcOptionCheckbox: { ...getClasses('dashboard').checkbox },
      }"
      @change="emits('change', categoryFilter)"
    >
      <template #value="{ value, placeholder }">
        <p v-if="!value.length" class="category-multiselect-placeholder">
          {{ placeholder }}
        </p>
        <div class="category-multiselect-tags" v-auto-animate>
          <Tag
            class="category-multiselect-tag"
            v-for="item in value"
            :key="item"
            :value="uppercaseFirst(item)"
            :style="{
              backgroundColor: colorsTags[item.toLowerCase()].colorBack,
              color: colorsTags[item.toLowerCase()].color,
            }"
          />
        </div>
      </template>
      <template #option="{ option }">
        {{ uppercaseFirst(option) }}
      </template>
    </MultiSelect>
  </div>
</template>

<script setup>
import { getClasses } from "@/utils/classes";
import { ref, defineProps, defineEmits, watch } from "vue";
import { uppercaseFirst } from "@/utils/index";

const categoryFilter = ref([]);
const emits = defineEmits(["change"]);

const props = defineProps({
  categories: Array,
  category: Array,
});

watch(
  () => props.category,
  (newValue) => {
    categoryFilter.value = newValue;
  },
  {
    immediate: true,
  }
);

const colorsTags = {
  weather: { color: "var(--weather-color)", colorBack: "var(--weather-back)" },
  nature: { color: "var(--nature-color)", colorBack: "var(--nature-back)" },
  animals: { color: "var(--animals-color)", colorBack: "var(--animals-back)" },
  auto: { color: "var(--auto-color)", colorBack: "var(--auto-back)" },
  science: { color: "var(--science-color)", colorBack: "var(--science-back)" },
};
</script>

<style lang="scss" scoped>
.categoryfilter {
  height: 100%;
}
:deep() {
  // multiselect
  .category {
    &-multiselect {
      width: 180px;
      height: 100%;
      background-color: var(--grey-1050);
      border-color: var(--grey-740);
      &:not(:disabled):focus-within {
        border-color: #3f3f46;
        box-shadow: none;
        outline: none;
      }
      &.p-multiselect-open {
        .category-multiselect-dropdown-icon {
          transform: rotate(180deg);
        }
      }
      &-placeholder {
        padding: 0 5px;
        line-height: 1;
        color: var(--placeholder-filter);
      }
      &-label-container {
      }
      &-label {
        padding: 5px;
        font-size: 14px;
        height: 100%;
        overflow: hidden;
        align-items: center;
      }
      &-dropdown {
        width: 30px;
        color: var(--placeholder-filter);
      }
      &-loading-icon {
      }
      &-dropdown-icon {
        width: 10px;
        transition: transform 0.3s;
      }
      &-overlay {
      }
      &-header {
      }
      &-header-checkbox {
      }
      &-filter-container {
      }
      &-filter {
      }
      &-filter-icon-container {
      }
      &-filter-icon {
      }
      &-list-container {
      }
      &-virtualscroller {
      }
      &-list {
      }
      &-option-group {
      }
      &-option {
        padding: 8px;
        gap: 10px;
      }
      &-option-label {
        font-size: 14px;
      }
      &-option-checkbox {
      }
      &-empty-message {
      }
      &-hidden-input-container {
      }
      &-hidden-input {
      }
      &-hidden-first-focusable-el {
      }
      &-hidden-filter-result {
      }
      &-hidden-selected-message {
      }
      &-hidden-last-focusable-el {
      }
      &-tags {
        display: flex;
        align-items: center;
        gap: 3px;
      }
      &-tag {
        height: 100%;
        font-size: 14px;
        font-weight: 600;
        padding: 5px 10px;
        line-height: 1;
      }
    }
  }
}
</style>

<style lang="scss">
.category {
  &-multiselect {
    &-overlay {
      background-color: var(--modal);
    }
    &-header {
    }
    &-header-checkbox {
    }
    &-filter-container {
    }
    &-filter {
    }
    &-filter-icon-container {
    }
    &-filter-icon {
    }
    &-list-container {
    }
    &-virtualscroller {
    }
    &-list {
    }
    &-option-group {
    }
    &-option {
      padding: 8px;
      gap: 10px;
      font-size: 14px;
      align-items: center;
      line-height: 1;
      color: var(--white);
      &:not(.p-multiselect-option-selected):not(.p-disabled).p-focus {
        background: var(--grey-970);
        color: var(--white);
      }
    }
    &-option-label {
      font-size: 14px;
    }
    &-option-checkbox {
    }
    &-empty-message {
    }
    &-hidden-input-container {
    }
    &-hidden-input {
    }
    &-hidden-first-focusable-el {
    }
    &-hidden-filter-result {
    }
    &-hidden-selected-message {
    }
    &-hidden-last-focusable-el {
    }
  }
}

// checkbox
.dashboard {
  &-checkbox {
    &-input {
      &:checked {
        & + .dashboard-checkbox-box {
          background: #6b99c6;
          border-color: #6b99c6;
        }
      }
    }
    &:not(.p-disabled):has(.dashboard-checkbox-input:focus-visible)
      .dashboard-checkbox-box {
      outline: transparent;
      outline-offset: 0;
    }
    &.p-disabled {
      .dashboard-checkbox-box {
        border-color: #5d5d5d;
      }
    }
    &-box {
      background-color: var(--grey-960);
    }
    &-icon {
      stroke: #000;
      display: none;
      path {
        stroke-width: 1px;
      }
    }
  }
}
</style>
