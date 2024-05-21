<template>
  <label class="switch" :style="{ width: `var(${width})`, height: `var(${height})` }">
    <input
      type="checkbox"
      v-model="checkboxValue"
      @change="toggleCheckbox"
    />
    <div
      class="slider"
      :style="{
        borderRadius: `var(${height})`,
        backgroundColor: checkboxValue ? colors[2] : colors[0],
      }"
    >
      <div
        class="round"
        :style="{
          left: `var(${offset})`,
          top: `var(${offset})`,
          height: `calc(100% - var(${offset}) * 2)`,
          transform: checkboxValue
            ? `translateX(calc(var(${width}) - var(${height})))`
            : 'translateX(0px)',
          backgroundColor: colors[1],
        }"
      >
        <component :is="icons[1]" class="round-img" v-if="icons && checkboxValue" />
        <component :is="icons[0]" class="round-img" v-if="icons && !checkboxValue" />
      </div>
    </div>
  </label>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  icons: {
    type: {
      Array,
    },
    required: false,
  },
  modelValue: {
    type: Boolean,
    required: false
  },
  width: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  offset: {
    type: String,
    required: true,
  },
  colors: {
    type: Array,
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

  input {
    display: none;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: all 0.4s;
}

.round {
  position: absolute;
  aspect-ratio: 1/1;
  background-color: #fff;
  border-radius: 50%;
  transition: all 0.4s;
  display: flex;
  align-items: center;
  justify-content: center;
  &-img {
    width: 90%;
    color: #000;
  }
}

input:checked + .slider {
  background-color: #838383;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}
</style>
