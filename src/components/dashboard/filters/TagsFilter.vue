<template>
  <div class="tagsfilter">
    <Tags
      class="dashboard-filter-tags"
      v-model="tagsFilter"
      class-select="dashboard-filter"
      :limit-tags="5"
      :placeholder="$t('placeholders.tags')"
      @change="emits('change', tagsFilter)"
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from "vue";

const tagsFilter = ref([]);

const emits = defineEmits(["change"]);

const props = defineProps({
  tags: Array,
});

watch(
  () => props.tags,
  (newValue) => {
    tagsFilter.value = newValue;
  }
);
</script>

<style lang="scss" scoped>
.tagsfilter {
  height: 100%;
}
:deep() {
  // tags container
  .dashboard-filter-tags {
    height: 100%;
    .tags__wrapper {
      min-height: auto;
      height: 100%;
      background-color: var(--grey-1050);
      color: var(--placeholder-filter);
      padding: 5px 0 5px 5px;
      border-color: var(--grey-740);
    }
    .tags-placeholder {
      font-size: 14px;
      padding-left: 5px;
    }
    .tags-arrow {
      width: 30px;
      padding: 0 10px;
    }
    .tags__content {
      gap: 5px;
      flex-wrap: nowrap;
      overflow: hidden;
    }
    .tags__container {
      overflow: hidden;
    }
    .chip {
      gap: 6px;
      border-radius: 5px;
      padding: 0 5px 0 8px;
      height: 100%;
      svg {
        font-size: 12px;
      }
    }
    .chip-label {
      font-size: 14px;
    }
  }
}
</style>

<style lang="scss">
// tags select
.dashboard-filter {
  &.select-wrapper {
    z-index: 999;
    background-color: var(--modal);
  }
  .tags-header {
    flex-direction: column;
    padding: 7px 7px 10px;
    gap: 5px;
  }
  .tags-iconfield {
    padding: 0 8px;
    height: 35px;
    font-size: 14px;
    border-radius: 5px;
  }
  .tags-inputtext {
    width: 100%;
  }
  .tags-inputicon {
    padding: 0 0 0 7px;
  }
  .tags-header-btn {
    height: 30px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 14px;
  }
  .tags-body {
    @include Scroll(7px, 7px, var(--grey-890), var(--grey-350));
  }
  .tags__list-group-label {
    font-size: 15px;
  }
  .tags__list-item-text {
    font-size: 13px;
    @include TextOverflow(2);
  }
  .tags__footer {
    padding: 5px 10px;
  }
  .tags-empty {
    padding: 5px 10px;
    font-size: 14px;
  }
  .tags-input-wrapper {
    flex-direction: column;
    gap: 5px;
  }
  .error {
    position: static;
    font-size: 11px;
  }
}
</style>
