<template>
  <div class="namefilter">
    <IconField :pt="getClasses('dashboard-search').iconfield" unstyled>
      <InputIcon :pt="getClasses('dashboard-search').inputicon" unstyled>
        <i-octicon:search-16 />
      </InputIcon>
      <InputText
        v-model="nameFilter"
        type="text"
        :placeholder="$t('placeholders.name')"
        @input="searchByName()"
        :pt="getClasses('dashboard-search').inputtext"
        unstyled
      />
    </IconField>
  </div>
</template>

<script setup>
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { getClasses } from "@/utils/classes";
import { ref, defineModel, defineEmits, defineProps, watch } from "vue";
import debounce from "lodash.debounce";

const nameFilter = ref();
const emits = defineEmits(["search"]);

const props = defineProps({
  name: String,
});

watch(
  () => props.name,
  (newValue) => {
    nameFilter.value = newValue;
  }
);

// поиск
const searchByName = debounce(() => {
  emits("search", nameFilter.value);
}, 2000);
</script>

<style lang="scss" scoped>
.namefilter {
  height: 100%;
}

:deep() {
  // search
  .dashboard-search {
    &-iconfield {
      display: flex;
      align-items: center;
      background-color: var(--grey-1050);
      border-radius: 6px;
      gap: 10px;
      padding: 0 10px;
      height: 100%;
      border: 1px solid var(--grey-740);
    }
    &-inputicon {
      font-size: 14px;
      line-height: 1;
      color: var(--white);
    }
    &-inputtext {
      line-height: 1;
      color: var(--white);
      font-size: 14px;
      &::placeholder {
        color: var(--placeholder-filter);
      }
    }
  }
}
</style>
