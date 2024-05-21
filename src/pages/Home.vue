<template>
  <div class="home">
    <TodayWeather class="card-item"/>
  </div>
</template>

<script setup>
import { ref } from "vue";

</script>


<style scoped lang="scss">
.home{
  margin-top: $offset-card;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.card-item{

}
</style>
