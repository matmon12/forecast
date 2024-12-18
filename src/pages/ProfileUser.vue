<template>
  <div class="profile">
    <ProfileSetting class="profile__setting" />
    <InfoUser class="profile__info" />
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@include ProfileUser();
.profile {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 10px;
  &__info {
    width: 400px;
  }
  &__setting {
    flex-grow: 1;
  }
}
</style>
