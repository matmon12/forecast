<template>
  <div class="breadcrumb">
    <!-- <Button severity="secondary"
      ><i-ic:round-arrow-back-ios-new />
      Back
    </Button> -->

    <ul class="breadcrumb__list">
      <li v-for="item of model" :key="item.label" class="breadcrumb__list-item">
        <router-link v-if="item.route" :to="item.route">
          <component :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else>{{ item.label }}</span>
      </li>
    </ul>

    <!-- <router-link>
      <li
        :class="[
          isActive && 'router-link-active',
          isExactActive && 'router-link-exact-active',
        ]"
      >
      </li>
    </router-link> -->
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";

const props = defineProps({
  model: Array,
});
</script>

<style lang="scss" scoped></style>
