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
import { ref, markRaw, computed, inject } from "vue";
import TablerHome from "~icons/tabler/home";
import { useRoute, onBeforeRouteUpdate } from "vue-router";

const route = useRoute();
const t = inject("t");

const optionsMenu = computed(() => [
  { name: t("news.options.all_news"), value: "" },
  { name: t("news.options.weather"), value: "weather" },
  { name: t("news.options.nature"), value: "nature" },
  { name: t("news.options.animals"), value: "animals" },
  { name: t("news.options.auto"), value: "auto" },
  { name: t("news.options.science"), value: "science" },
]);

const breadCrumbItems = computed(() => {
  return [
    {
      label: t("breadcrumb.news"),
      route: { name: route.params.category ? "CategoryNews" : "" },
    },
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
            label: t("breadcrumb.post"),
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
