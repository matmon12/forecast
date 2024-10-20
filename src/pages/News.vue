<template>
  <div class="news">
    <Breadcrumb :model="items" />
    <SelectButton
      class="news-selectbtn"
      :value="$route.params.category ? $route.params.category : ''"
      :options="optionsMenu"
      :color-btn="'#6b99c6'"
      @toggle-select="
        (menuItem) => {
          $router.push(`/forecast/news/${menuItem}`);
        }
      "
    />
    {{ $route.params.category }}
    <router-view />
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from "vue";
import HeroiconsHome from "~icons/heroicons/home";
import { useRoute } from "vue-router";

const route = useRoute();

const optionsMenu = ref([
  { name: "All news", value: "" },
  { name: "Weather", value: "weather" },
  { name: "Nature", value: "nature" },
  { name: "Animals", value: "animals" },
  { name: "Auto", value: "auto" },
  { name: "Science and space", value: "science" },
]);

// const items = markRaw([
//   {
//     icon: HeroiconsHome,
//     route: "/forecast/",
//   },
//   { label: "News", route: "/forecast/news" },
//   {
//     label: optionsMenu.value.find(
//       (item) => item.value === route.params.category
//     ).name,
//     route: route.fullPath,
//   },
// ]);

const items = computed(() => {
  return [
    {
      icon: HeroiconsHome,
      route: "/forecast/",
    },
    { label: "News", route: "/forecast/news" },
    {
      label: optionsMenu.value.find(
        (item) => item.value === route.params.category
      )?.name,
      route: `/forecast/news/${route.params.category}`,
    },
  ];
});
</script>

<style lang="scss" scoped>
.news {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.news-selectbtn {
  width: 100%;
  margin-bottom: 15px;
}
</style>
