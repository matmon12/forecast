<template>
  <div class="selectbtn" :style="{ backgroundColor: props.colorBack }">
    <div
      v-for="(item, id) in options"
      :class="['selectbtn-item', { 'is--active': activeBtn === item.value }]"
      :key="id"
      @click="onClickBtn(item.value)"
      :style="{
        backgroundColor: activeBtn === item.value ? props.colorBtn : colorBack,
      }"
    >
      <p
        class="selectbtn-text"
        :style="{ color: activeBtn === item.value ? '#000' : colorText }"
      >
        {{ item.name }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const emit = defineEmits(["toggleSelect"]);

const props = defineProps({
  options: Array,
  value: String,
  colorBtn: {
    type: String,
    required: false,
  },
  colorBack: {
    type: String,
    required: false,
  },
  colorText: {
    type: String,
    required: false,
  },
});
const activeBtn = ref(props.value);

watch(
  () => props.value,
  (newValue) => {
    activeBtn.value = newValue;
  }
);

const onClickBtn = (value) => {
  activeBtn.value = value;
  emit("toggleSelect", value);
};
</script>

<style lang="scss" scoped>
.selectbtn {
  display: flex;
  gap: 5px;
  padding: 5px 5px;
  background-color: #4f4f4f;
  border-radius: 5px;

  &-text {
    z-index: 10;
    line-height: 1;
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  &-item {
    background-color: #4f4f4f;
    transition: background-color 0.3s, filter .3s;
    border-radius: 5px;
    padding: 5px 12px;
    cursor: pointer;
    color: #d2d2d2;
    position: relative;
    border-radius: 5px;
    display: flex;
    text-align: center;
    height: fit-content;

    &.is--active {
      // background-color: #6b99c6;
      color: #000000;
      box-shadow: 0 0 5px #000;
      font-weight: 500;
    }
    &:not(.is--active):hover {
      filter: brightness(1.3);
    }
  }
}
</style>
