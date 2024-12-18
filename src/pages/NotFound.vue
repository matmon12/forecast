<template>
  <div class="notfound">
    <div class="notfound__content">
      <i-tabler:error-404 class="notfound-img" />
      <h1 class="notfound-title">Not Found</h1>
      <div class="notfound__btns">
        <Button @click="$router.push('/forecast/')" class="notfound-btn notfound-btn-home" unstyled >Home</Button>
        <Button @click="$router.go(-1)" class="notfound-btn notfound-btn-back" unstyled >Back</Button>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@include NotFound();
.notfound {
  @include Card();
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notfound__content {
  text-align: center;
}
.notfound-img {
  font-size: 10em;
  color: var(--blue-160);
  filter: drop-shadow(5px 5px 5px #000000);
}
.notfound-title {
  font-size: 30px;
  line-height: 1;
  font-weight: 600;
}
.notfound__btns {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}
.notfound-btn {
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  border-radius: 7px;
  padding: 0 10px;
  transition: background-color 0.3s, color 0.3s;
  height: 35px;

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }

  &-home {
    color: #000;
    font-weight: 500;
    background-color: var(--blue-380);
    transition: filter .3s;
    &:not(:disabled):hover {
      filter: brightness(var(--brightness-rating));
    }
  }

  &-back {
    color: #fff;
    border: 2px solid var(--blue-370);
    background-color: var(--transparent-5);
    transition: filter .3s, background-color .3s;
    &:not(:disabled):hover {
      background-color: var(--blue-370);
      filter: brightness(var(--brightness-moon));
      color: var(--black-3);
      font-weight: var(--font-weight-2);
    }
  }
}
</style>
