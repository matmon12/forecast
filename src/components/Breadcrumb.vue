<template>
  <div class="breadcrumb">
    <Button
      v-if="!uiStore.smSmaller"
      severity="secondary"
      @click="$router.go(-1)"
      class="breadcrumb-back"
      ><i-ic:round-arrow-back-ios-new />
      Back
    </Button>

    <ul class="breadcrumb__list">
      <li class="breadcrumb__list-item">
        <router-link :to="{ name: 'Home' }" class="breadcrumb__list-link">
          <component :is="TablerHome"></component>
        </router-link>
        <span class="breadcrumb__list-separator"><i-ep:arrow-right /></span>
      </li>

      <li v-for="item of model" :key="item.label" class="breadcrumb__list-item">
        <router-link
          v-if="item.route?.name"
          :to="item.route"
          class="breadcrumb__list-link"
        >
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else class="breadcrumb__list-text">{{ item.label }}</span>
        <span
          v-if="model[model.length - 1] !== item"
          class="breadcrumb__list-separator"
          ><i-ep:arrow-right
        /></span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import TablerHome from "~icons/tabler/home";
import { useUiStore } from "../stores/ui";

const uiStore = useUiStore();

const props = defineProps({
  model: Array,
});
</script>

<style lang="scss" scoped>
@include Breadcrumb();

.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: auto;
  overflow-x: auto;
  overflow-y: hidden;
}

.breadcrumb-back {
  font-size: 14px;
  padding: 6px 10px 6px 8px;
  border-radius: 5px;
  gap: 6px;
  margin-right: 10px;
  color: #000;
  background-color: var(--blue-100);
  font-weight: 500;
  transition: filter 0.3s;
  border: none;
  svg {
    font-size: 12px;
  }
  &:hover {
    filter: brightness(1.1);
  }
}

.breadcrumb__list {
  display: flex;
  align-items: center;
}
.breadcrumb__list-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
}

.breadcrumb__list-link {
  color: var(--white);
  font-weight: var(--font-weight);
  line-height: 1;
}
.breadcrumb__list-text {
  line-height: 1;
  font-weight: 500;
  color: var(--grey-300);
}
.breadcrumb__list-separator {
  display: flex;
  margin: 0 5px;
  color: var(--grey-300);
}
</style>
