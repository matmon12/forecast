<template>
  <label class="switch">
    <input type="checkbox" v-model="checkboxValue" @change="toggleCheckbox" />
    <div class="slider">
      <div class="round"></div>
      <p :class="['slider-text', { 'is--active': !checkboxValue }]">F</p>
      <p :class="['slider-text', { 'is--active': checkboxValue }]">C</p>
    </div>
  </label>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: false,
  },
});

const checkboxValue = ref(props.modelValue ? props.modelValue : false);
const emit = defineEmits(["toggleSwitch"]);

const toggleCheckbox = () => {
  emit("toggleSwitch", checkboxValue.value);
};
</script>

<style lang="scss" scoped>

.switch {
  position: relative;
  display: inline-block;
  transition: all 0.4s;
  width: 75px;
  height: 33px;

  input {
    display: none;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--white-2);
  transition: all 0.4s;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 13px;

  &-text {
    z-index: 10;
    color: var(--grey);
    font-weight: 500;
    font-size: 20px;
    line-height: 1;
    transition: color 0.3s;
    &.is--active {
      color: var(--white-2);
    }
  }
}

.round {
  position: absolute;
  background-color: var(--grey-2);
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
  left: -1px;
  top: 0;
  height: 100%;
  width: 42px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px #000;
}

input:checked + .slider {
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider .round {
  transform: translateX(35px);
}
</style>
