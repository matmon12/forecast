<template>
  <main>
    <div class="container">
      <AsideBar />
      <div class="wrapper">
        <Header />
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script setup></script>

<style scoped lang="scss">
main {
  padding: 30px 0;
}
.wrapper{
  padding-left: calc(70px + $offset-card);
}
</style>
