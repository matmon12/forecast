<template>
  <div class="news">
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
    <router-view />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const optionsMenu = ref([
  { name: "All news", value: "" },
  { name: "Weather", value: "weather" },
  { name: "Nature", value: "nature" },
  { name: "Animals", value: "animals" },
  { name: "Auto", value: "auto" },
  { name: "Science and space", value: "science" },
]);

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
