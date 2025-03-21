<template>
  <div class="tags" ref="tags">
    <div class="tags__wrapper" @click.stop="onShowDropdown()">
      <p v-if="!selectedTags?.length" class="tags-placeholder">
        {{ placeholder }}
      </p>
      <div v-else class="tags__container">
        <div class="tags__content">
          <Chip
            v-for="tag of selectedTags"
            :key="tag"
            :label="
              $te(`tags.items.${formateTag(tag)}`)
                ? $t(`tags.items.${formateTag(tag)}`)
                : formateTag(tag)
            "
            @remove="(e) => remove(e, tag)"
          />
        </div>
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
                  :placeholder="$t('placeholders.tags-input')"
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
              >{{ $t("buttons.add-tag") }}</Button
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
                  <p class="tags__list-group-label">
                    {{
                      $t(
                        `tags.items.${item.label
                          .toLocaleLowerCase()
                          .split(" ")
                          .join("_")}`
                      )
                    }}
                  </p>
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
                    {{
                      $t(
                        `tags.items.${tag.value
                          .toLocaleLowerCase()
                          .split(" ")
                          .join("_")}`
                      )
                    }}
                  </p>
                </label>
              </li>
            </ul>

            <p v-if="filteredTags.length === 0" class="tags-empty">
              {{ $t("tags.no_results") }}
            </p>
          </div>
        </template>

        <template #footer>
          <div class="tags__footer">
            <p v-if="selectedTags && selectedTags.length" class="tags-count">
              {{ $t("tags.selected", { count: selectedTags.length }) }}
            </p>
            <p v-else class="tags-noselected">{{ $t("tags.no_selected") }}</p>
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
  inject,
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

const t = inject("t");
const tags = ref();
const showSelect = ref(false);
const sizeTags = ref({ width: 0, height: 0 });

const searchTags = ref();
const error = ref([]);

const formateTag = (tag) => tag.toLocaleLowerCase().split(" ").join("_");

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
    error.value.push(t("errors.tags.empty"));
  }
  if (sameTags) {
    error.value.push(t("errors.tags.duplicate"));
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
@include Tags();
.tags {
  position: relative;
  &.is-invalid {
    .tags__wrapper {
      @include Invalid();
    }
  }
}

.select-wrapper {
  background-color: var(--modal);
  box-shadow: 0 0 5px #474747;
}

.tags__wrapper {
  min-height: 40px;
  width: 100%;
  background-color: var(--grey-960);
  border: 1px solid #52525b;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px 5px 5px;
  color: var(--grey-320);
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
.tags__container {
  height: 100%;
}
.tags-header {
  display: flex;
  padding: 10px 15px 15px;
  gap: 10px;

  &-btn {
    background-color: var(--blue-100);
    border-color: var(--blue-100);
    font-weight: 500;
    transition: filter 0.3s;
    &:not(:disabled):hover {
      filter: brightness(1.1);
    }
  }
}
.tags-body {
  height: 100%;
  overflow-y: auto;
  @include Scroll(10px, 10px, var(--grey-900), var(--grey-350));
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
  color: var(--grey-340);
  line-height: 1;
  // color: var(--blue);
}
.tags__list-group-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 5px;
  margin-bottom: 7px;
  svg {
    font-size: 16px;
    color: var(--blue-2);
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
  background-color: var(--transparent-3);
}

// input
.tags {
  &-iconfield {
    background-color: var(--black-3);
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
      color: var(--grey-100);
    }
  }
  &-input-wrapper {
    display: flex;
    flex-grow: 1;
    position: relative;
  }
}

:deep() {
  // checkbox
  .tags {
    &-checkbox {
      &.p-checkbox-checked .tags-checkbox-box {
        border-color: #6b99c6;
        background: #6b99c6;
        svg {
          color: #000;
        }
      }

      &.p-disabled .tags-checkbox-box {
        background: var(--grey-760);
        border-color: var(--grey-760);
      }
      &-box {
        background-color: var(--grey-960);
        transition: border-color 0.3s;
        svg {
          color: transparent;
          width: 16px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.tags__list-item:not(:has(.tags-checkbox.p-disabled)):hover {
  .tags-checkbox:not(.p-checkbox-checked) {
    .tags-checkbox-box {
      border-color: #797979;
    }
  }
}
.tags__list-item:not(:has(.tags-checkbox.p-disabled)):hover {
  background-color: var(--grey-970);
}
.tags__list-item:has(.tags-checkbox.p-disabled) {
  cursor: default;
  color: var(--grey-100);
}
</style>
