<template>
  <div class="news">
    <SelectButton
      class="news-selectbtn"
      :value="$route.fullPath"
      :options="optionsMenu"
      :color-btn="'#6b99c6'"
      @toggle-select="
        (menuItem) => {
          $router.push(menuItem)
        }
      "
    />
    <router-view />
  </div>
</template>

<script setup>
import {ref} from 'vue';

const optionsMenu = ref([
  {name: 'All news', value: '/forecast/news'},
  {name: 'Weather', value: '/forecast/news/weather'},
  {name: 'Nature', value: '/forecast/news/nature'},
  {name: 'Animals', value: '/forecast/news/animals'},
  {name: 'Auto', value: '/forecast/news/auto'},
  {name: 'Science and space', value: '/forecast/news/science'},
])
</script>

<style lang="scss" scoped>
.news {
  width: 100%;
}
.news-selectbtn{
  width: 100%;
  margin-bottom: 15px;
}
</style>
