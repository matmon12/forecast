<template>
  <div class="header">
    <div class="header__inner">
      <Search />
      <Panel />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.header {
  width: 100%;
  position: sticky;
  top: 30px;
  z-index: 100;
  border-radius: 20px;

  &::after{
    content: '';
    position: absolute;
    width: calc(100% + 30px);
    height: calc(100% + 30px);
    background-color: #ffffff1d;
    backdrop-filter: blur(10px);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    z-index: -1;
    opacity: 0;
    transition: all .3s;
  }

  &.is--active {
    &::after{
      opacity: 1;
    }
  }

  &__inner {
    display: flex;
    justify-content: space-between;
  }
}
</style>
