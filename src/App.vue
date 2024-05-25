<template>
  <main>
    <div class="container">
      <AsideBar />
      <div class="wrapper">
        <Header />
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();
</script>

<style scoped lang="scss">
main {
  padding: 30px 0;
}
.wrapper {
  min-height: calc(100vh - 60px);
  padding-left: calc(70px + $offset-card);
  display: flex;
  flex-direction: column;
}
.content {
  margin-top: $offset-card;
  position: relative;
  flex-grow: 1;
  display: flex;
}
</style>
