<template>
  <div class="profile">
    <Breadcrumb :model="breadCrumbItems" />

    <div class="profile__content">
      <ProfileSetting class="profile__setting" />
      <InfoUser class="profile__info" />
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from "vue";

const t = inject("t");

const breadCrumbItems = computed(() => [
  {
    label: t("panel.profile"),
  },
]);
</script>

<style lang="scss" scoped>
@include ProfileUser();
.profile {
  width: 100%;
  &__info {
    width: 400px;
  }
  &__setting {
    flex-grow: 1;
  }
  &__content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 10px;
  }
}
</style>
