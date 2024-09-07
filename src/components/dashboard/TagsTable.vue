<template>
  <div class="dashboard-table-tags" v-auto-animate>
    <Tag
      v-for="(item, index) in tags.slice(0, limitTags)"
      :key="index"
      :value="item"
      severity="secondary"
      :pt="getClasses('dashboard').tag"
    ></Tag>
    <Tag
      v-if="tags.length > defaultLimitTags"
      @click="onShowTags(tags.length)"
      severity="info"
      class="dashboard-table-tags-btn"
      ><i-mdi:hide-outline v-if="tags.length === limitTags" />
      <span v-else>+{{ tags.length - limitTags }}</span>
    </Tag>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from "vue";
import { getClasses } from "@/utils/classes";

const defaultLimitTags = ref(3);
const limitTags = ref(3);

const props = defineProps({
  tags: Array,
});

watch(
  () => props.tags,
  (newValue) => {
    limitTags.value = defaultLimitTags.value;
  }
);

// limit tags
const onShowTags = (countTags) => {
  countTags === limitTags.value
    ? (limitTags.value = defaultLimitTags.value)
    : (limitTags.value = countTags);
};
</script>

<style lang="scss" scoped>
.dashboard-table {
  &-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    &-btn {
      cursor: pointer;
      transition: filter 0.3s;
      height: 27px;
      // padding: 0 7px;
      svg {
        font-size: 16px;
      }
      &:hover {
        filter: brightness(1.2);
      }
    }

    overflow: hidden;
  }
}
</style>

<style lang="scss">
// tag
.dashboard {
  &-tag {
    padding: 0px 8px;
    height: 27px;
    width: min-content;
    overflow: hidden;
    display: flex;
    justify-content: left;

    &-label {
      font-weight: 500;
      white-space: nowrap;
    }
  }
}
</style>
