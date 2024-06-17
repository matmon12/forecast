<template>
  <main>
    <div class="container">
      <AsideBar />
      <div class="wrapper">
        <Header :class="{ 'is--active': isHeaderActive }" />
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useSearchStore } from "@/stores/search";

const searchStore = useSearchStore();
const header = ref(null);
const isHeaderActive = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
})

const handleScroll = () => {
  if (window.scrollY > 30) {
    isHeaderActive.value = true;
  } else {
    isHeaderActive.value = false;
  }
};
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
