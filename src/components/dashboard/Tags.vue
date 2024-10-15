<template>
  <div class="tags" ref="tags">
    <div class="tags__wrapper" @click.stop="onShowDropdown()">
      <p v-if="!selectedTags?.length" class="tags-placeholder">
        {{ placeholder }}
      </p>
      <div v-else class="tags__content">
        <Chip
          v-for="tag of selectedTags"
          :key="tag"
          :label="tag"
          @remove="(e) => remove(e, tag)"
        />
      </div>
      <span :class="['tags-arrow', { 'is-open': showSelect }]"
        ><i-ep:arrow-down-bold
      /></span>
    </div>

    <resize-observer
      @notify="
        (sizes) => {
          sizeTags.width = sizes.width;
          sizeTags.height = sizes.height;
        }
      "
    />

    <Teleport to="body">
      <Select
        ref="select"
        :show="showSelect"
        :tags="tags"
        :size-tags="sizeTags"
        :class="classSelect"
        @hide-select="(showSelect = false), (error = [])"
        @show-select="showSelect = true"
      >
        <template #header>
          <div class="tags-header">
            <div class="tags-input-wrapper">
              <IconField
                :pt="getClasses('tags').iconfield"
                :class="{ 'is-invalid': error.length }"
                unstyled
              >
                <InputText
                  v-model="searchTags"
                  :placeholder="'Enter tags...'"
                  :pt="getClasses('tags').inputtext"
                  unstyled
                  @update:modelValue="search"
                  @keyup.enter="
                    selectedTags?.length < limitTags ? handleClick() : undefined
                  "
                />
                <InputIcon :pt="getClasses('tags').inputicon" unstyled
                  ><i-octicon:search-16
                /></InputIcon>
              </IconField>
              <transition name="fade">
                <small v-if="error.length" class="error">{{
                  error[error.length - 1]
                }}</small>
              </transition>
            </div>
            <Button
              @click="handleClick"
              class="tags-header-btn"
              :disabled="error.length || selectedTags?.length >= limitTags"
              >Add tag</Button
            >
          </div>
        </template>

        <template #body>
          <div class="tags-body">
            <ul class="tags__list">
              <li
                v-for="item of filteredTags"
                :key="item.label"
                class="tags__list-group"
              >
                <div class="tags__list-group-header">
                  <component :is="item.icon"></component>
                  <p class="tags__list-group-label">{{ item.label }}</p>
                </div>
                <label
                  v-for="tag of item.items"
                  :key="tag.value"
                  class="tags__list-item"
                  :for="tag.value"
                >
                  <Checkbox
                    v-model="selectedTags"
                    :inputId="tag.value"
                    name="tag"
                    :value="tag.value"
                    :pt="getClasses('tags').checkbox"
                    :disabled="isDisabled(tag.value)"
                    @change="emits('change')"
                  >
                    <template #icon>
                      <i-ph:check-bold />
                    </template>
                  </Checkbox>
                  <p class="tags__list-item-text">
                    {{ tag.value }}
                  </p>
                </label>
              </li>
            </ul>

            <p v-if="filteredTags.length === 0" class="tags-empty">
              No results found
            </p>
          </div>
        </template>

        <template #footer>
          <div class="tags__footer">
            <p v-if="selectedTags && selectedTags.length" class="tags-count">
              {{ selectedTags.length }} tags selected
            </p>
            <p v-else class="tags-noselected">No selected item</p>
          </div>
        </template>
      </Select>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ref,
  shallowRef,
  computed,
  watch,
  onMounted,
  defineModel,
  defineEmits,
} from "vue";
import debounce from "lodash.debounce";
import { FilterMatchMode, FilterService } from "@primevue/core/api";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { getClasses } from "@/utils/classes";

// icons multiselect
import MaterialSymbolsWeatherMix from "~icons/material-symbols/weather-mix";
import PhPlantFill from "~icons/ph/plant-fill";
import TeenyiconsPawSolid from "~icons/teenyicons/paw-solid";
import F7CarFill from "~icons/f7/car-fill";
import EosIconsScience from "~icons/eos-icons/science";

const tags = ref();
const showSelect = ref(false);
const sizeTags = ref({ width: 0, height: 0 });

const searchTags = ref();
const error = ref([]);

const props = defineProps({
  placeholder: String,
  limitTags: Number,
  classSelect: String,
});

const emits = defineEmits(["change"]);

const selectedTags = defineModel({ default: [] });
const filteredTags = shallowRef([
  {
    label: "Weather",
    icon: MaterialSymbolsWeatherMix,
    items: [
      { value: "Forecast" },
      { value: "Meteorology" },
      { value: "Records" },
      { value: "Current weather" },
    ],
  },
  {
    label: "Nature",
    icon: PhPlantFill,
    items: [
      { value: "Plants" },
      { value: "Anomalies" },
      { value: "Adviсe" },
      { value: "Ecology" },
    ],
  },
  {
    label: "Animals",
    icon: TeenyiconsPawSolid,
    items: [
      { value: "Pets" },
      { value: "Animals and people" },
      { value: "Facts" },
      { value: "Help" },
    ],
  },
  {
    label: "Auto",
    icon: F7CarFill,
    items: [
      { value: "Cars" },
      { value: "Safety" },
      { value: "Rules" },
      { value: "Laws" },
    ],
  },
  {
    label: "Science and space",
    icon: EosIconsScience,
    items: [
      { value: "Space" },
      { value: "Events" },
      { value: "Space exploration" },
      { value: "Inventions" },
    ],
  },
]);
const filterTags = shallowRef([...filteredTags.value]);

const onShowDropdown = () => {
  showSelect.value = !showSelect.value;
  error.value = [];

  // сброс фильтра
  resetFilter();
};

const resetFilter = () => {
  searchTags.value = null;
  filteredTags.value = filterTags.value;
};

const search = debounce((data) => {
  let newFilteredTags = [];

  for (let tag of filterTags.value) {
    let filteredItems = FilterService.filter(
      tag.items,
      ["value"],
      data,
      FilterMatchMode.CONTAINS
    );

    if (filteredItems && filteredItems.length) {
      newFilteredTags.push({ ...tag, ...{ items: filteredItems } });
    }
  }

  filteredTags.value = newFilteredTags;

  // delete error
  if (data) {
    error.value = [];
  }
}, 500);

const remove = (e, tag) => {
  e.stopPropagation();

  const indexOfRemove = selectedTags.value.findIndex((item) => item === tag);

  // такого тега уже нет, для валидации
  if (selectedTags.value[indexOfRemove] === searchTags.value) {
    error.value = [];
  }

  selectedTags.value.splice(indexOfRemove, 1);
  emits("change");
};

const handleClick = () => {
  let sameTags;
  const formattedInput = searchTags.value
    ? searchTags.value.trim().replace(/\s+/g, " ")
    : searchTags.value;

  if (selectedTags.value) {
    sameTags = selectedTags.value.find((item) => item === formattedInput);
  }

  if (formattedInput && !sameTags) {
    addItem(formattedInput);
  }
  if (!formattedInput) {
    error.value.push("The field must not be empty!");
  }
  if (sameTags) {
    error.value.push("This tag has already been added!");
  }
};

const addItem = (input) => {
  selectedTags.value.push(input);
  emits("change");
};

const isDisabled = (tag) => {
  return (
    selectedTags.value &&
    selectedTags.value.length >= props.limitTags &&
    selectedTags.value.findIndex((item) => item === tag) === -1
  );
};
</script>

<style lang="scss" scoped>
.tags {
  position: relative;
  &.is-invalid {
    .tags__wrapper {
      @include Invalid();
    }
  }
}
.tags__wrapper {
  min-height: 40px;
  width: 100%;
  background-color: #09090b;
  border: 1px solid #52525b;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px 5px 5px;
  color: #a5a5ab;
  cursor: pointer;
  transition: box-shadow 0.3s, border-color 0.3s;
}
.tags-placeholder {
  font-size: 16px;
  line-height: 1;
  padding-left: 10px;
  line-height: 30px;
}
.tags-arrow {
  font-size: 12px;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
  &.is-open {
    transform: rotate(180deg);
  }
}

.tags__content {
  height: 100%;
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tags-header {
  display: flex;
  padding: 10px 15px 15px;
  gap: 10px;
  &-btn {
    background-color: $blue;
    border-color: $blue;
    font-weight: 500;
    transition: filter 0.3s;
    &:hover {
      filter: brightness(1.1);
    }
  }
}
.tags-body {
  height: 100%;
  overflow-y: auto;
  @include Scroll(10px, 10px, #333333, #7d7d7d);
  padding: 0 5px 10px;
}

// list
.tags__list {
}
.tags__list-group {
  margin-bottom: 7px;
}
.tags__list-group-label {
  font-size: 16px;
  font-weight: 600;
  color: #858585;
  line-height: 1;
  // color: $blue;
}
.tags__list-group-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 5px;
  margin-bottom: 7px;
  svg {
    font-size: 16px;
    color: $blue;
  }
}
.tags__list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 5px;
  border-radius: 5px;
  transition: background-color 0.2s;
  & + & {
    margin-top: 3px;
  }
}
.tags__list-item-text {
  font-size: 14px;
  letter-spacing: 0.5px;
}

.tags-empty {
  padding: 5px 15px;
}

// footer
.tags__footer {
  font-size: 14px;
  padding: 5px 15px;
  border-top: 1px solid #4e4e51;
}

// input
.tags {
  &-iconfield {
    background-color: $black;
    border-radius: 7px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    border: 1px solid #52525b;
    transition: box-shadow 0.3s, border-color 0.3s;
    flex-grow: 1;
    position: relative;

    &:not(.is-invalid):has(.tags-inputtext:focus) {
      @include Focus();
    }

    &.is-invalid {
      @include Invalid();
    }
  }
  &-inputicon {
    padding: 0 0 0 10px;
    display: flex;
  }
  &-inputtext {
    flex-grow: 1;
    &::placeholder {
      color: #a5a5ab;
    }
  }
  &-input-wrapper {
    display: flex;
    flex-grow: 1;
    position: relative;
  }
}
</style>

<style lang="scss">
// checkbox
.tags {
  &-checkbox {
    &.p-checkbox-checked .tags-checkbox-box {
      border-color: $blue;
      background: $blue;
      svg {
        color: $black;
      }
    }

    &.p-disabled .tags-checkbox-box {
      background: #3f3f46;
      border-color: #3f3f46;
    }
    &-box {
      transition: border-color 0.3s;
      svg {
        color: transparent;
        width: 16px;
      }
    }
  }
}
.tags__list-item:not(:has(.tags-checkbox.p-disabled)):hover {
  .tags-checkbox:not(.p-checkbox-checked) {
    .tags-checkbox-box {
      border-color: #797979;
    }
  }
}
.tags__list-item:not(:has(.tags-checkbox.p-disabled)):hover {
  background-color: #303030;
}
.tags__list-item:has(.tags-checkbox.p-disabled) {
  cursor: default;
  color: rgb(178, 178, 178);
}
</style>
