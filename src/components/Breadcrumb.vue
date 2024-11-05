<template>
  <div class="breadcrumb">
    <Button severity="secondary" @click="$router.go(-1)" class="breadcrumb-back"
      ><i-ic:round-arrow-back-ios-new />
      Back
    </Button>

    <ul class="breadcrumb__list">
      <li class="breadcrumb__list-item">
        <router-link :to="{ path: '/forecast/' }" class="breadcrumb__list-link">
          <component :is="TablerHome"></component>
        </router-link>
        <span class="breadcrumb__list-separator"><i-ep:arrow-right /></span>
      </li>

      <li v-for="item of model" :key="item.label" class="breadcrumb__list-item">
        <router-link
          v-if="item.route"
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

const props = defineProps({
  model: Array,
});
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.breadcrumb-back {
  font-size: 14px;
  padding: 6px 10px 6px 8px;
  border-radius: 5px;
  gap: 6px;
  margin-right: 10px;
  color: #000;
  background-color: $blue;
  font-weight: 500;
  transition: filter 0.3s;
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
}

.breadcrumb__list-link {
  color: #fff;
  line-height: 1;
}
.breadcrumb__list-text {
  line-height: 1;
  font-weight: 500;
  color: #9b9b9b;
}
.breadcrumb__list-separator {
  display: flex;
  margin: 0 5px;
  color: #afafaf;
}
</style>
