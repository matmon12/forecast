<template>
  <div class="news">
    <Breadcrumb :model="breadCrumbItems" />
    <div class="news-selectbtn-wrapper">
      <SelectButton
        class="news-selectbtn"
        :value="$route.params.category ? $route.params.category : ''"
        :options="optionsMenu"
        :color-btn="'var(--blue-150)'"
        :color-back="'var(--grey-400)'"
        :color-text="'var(--grey-200)'"
        @toggle-select="
          (menuItem) => {
            $router.push({
              name: 'CategoryNews',
              params: { category: menuItem },
            });
          }
        "
      />
    </div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, markRaw, computed } from "vue";
import TablerHome from "~icons/tabler/home";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();

const optionsMenu = ref([
  { name: "All news", value: "" },
  { name: "Weather", value: "weather" },
  { name: "Nature", value: "nature" },
  { name: "Animals", value: "animals" },
  { name: "Auto", value: "auto" },
  { name: "Science and space", value: "science" },
]);

const breadCrumbItems = computed(() => {
  return [
    { label: "News", route: { name: route.params.category ? "CategoryNews" : "" } },
    {
      label: optionsMenu.value.find(
        (item) => item.value === (route.params.category || "")
      )?.name,
      route: route.params.name
        ? { name: "CategoryNews", params: { category: route.params.category } }
        : "",
    },
    ...(route.params.name
      ? [
          {
            label: "Post",
          },
        ]
      : []),
  ];
});
</script>

<style lang="scss" scoped>
@include News();
.news {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.news-selectbtn {
  width: 100%;
  overflow-x: auto;

  &-wrapper {
    display: flex;
    overflow-x: hidden;
    white-space: nowrap;
    width: 100%;
    margin-bottom: 15px;
  }
  :deep() {
    .selectbtn-text {
      white-space: nowrap;
    }
  }
}
</style>
