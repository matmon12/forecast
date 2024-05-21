<template>
  <InputGroup class="search-input-wrap" >
    <InputGroupAddon class="search-input-icon" unstyled
      ><i-mingcute:search-line />
    </InputGroupAddon>
    <InputText
      class="search-input"
      type="text"
      v-model="inputValue"
      placeholder="Search City"
      unstyled
      autofocus 
    />
  </InputGroup>
</template>

<script setup>
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import { ref } from "vue";

const inputValue = ref();
</script>

<style lang="scss" scoped>
.search {
  &-input-wrap {
    width: 400px;
    background-color: $grey;
    border-radius: 20px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 50px;
  }
  &-input-icon {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  &-input {
    font-size: 14px;
    flex-grow: 1;
    &::placeholder {
      color: $grey-light;
      font-size: 14px;
    }
  }
}
</style>
