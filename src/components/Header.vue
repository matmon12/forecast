<template>
  <div class="header">
    <div class="header__inner">
      <Search/>
      <Panel/>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.header {
  width: 100%;
  position: sticky;
  top: 30px;

  &__inner {
    display: flex;
    justify-content: space-between;
  }
}
</style>
