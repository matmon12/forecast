<template>
  <Transition name="select">
    <div
      ref="select"
      v-if="show"
      v-on-click-outside.bubble="hideSelect"
      class="select-wrapper"
      :style="{
        top:
          positionSelect.top === 'auto'
            ? positionSelect.top
            : `${positionSelect.top}px`,
        left: `${positionTags.left}px`,
        width: `${positionTags.width}px`,
      }"
    >
      <div class="select-container">
        <div class="select-header">
          <slot name="header"></slot>
        </div>

        <div class="select-body">
          <slot name="body"></slot>
        </div>

        <div class="select-footer">
          <slot name="footer"></slot>
        </div>
      </div>

      <resize-observer @notify="handleResize" />
    </div>
  </Transition>
</template>

<script setup>
import {
  watch,
  defineProps,
  onMounted,
  ref,
  onUnmounted,
  defineEmits,
  computed,
} from "vue";
import { vOnClickOutside } from "@vueuse/components";

const select = ref();
let classes = [];
const positionSelect = ref({
  left: 0,
  right: 0,
  bottom: "auto",
  top: 0,
});
const positionTags = ref({
  left: 0,
  bottom: 0,
  top: 0,
  width: 0,
  height: 0,
});

const props = defineProps({
  show: Boolean,
  tags: Element,
  sizeTags: Object,
});

const emits = defineEmits(["hideSelect", "showSelect"]);

watch(
  () => select.value,
  (newValue) => {
    if (newValue) {
      setPositionSelect();
      getScrollableParent();

      classes.forEach((el) => {
        el.addEventListener("scroll", hideSelect);
      });

      window.addEventListener("resize", handleResize);
    } else {
      classes.forEach((el) => {
        el.removeEventListener("scroll", hideSelect);
      });
      window.removeEventListener("resize", handleResize);
    }
  }
);

watch(
  () => props.sizeTags,
  () => handleResize(),
  { deep: true }
);

const getScrollableParent = () => {
  let currentEl = props.tags.parentElement;
  while (currentEl) {
    const overflowY = window.getComputedStyle(currentEl).overflowY;
    if (overflowY === "scroll" || overflowY === "auto") {
      classes.push(currentEl);
    }
    currentEl = currentEl.parentElement;
  }
};

// resize select
const handleResize = () => {
  // если select отрисован 
  if (select.value) {
    setPositionSelect();
  }
};

const setPositionSelect = () => {
  positionTags.value = {
    left: props.tags.getBoundingClientRect().left + window.scrollX,
    bottom: props.tags.getBoundingClientRect().bottom + window.scrollY,
    top: props.tags.getBoundingClientRect().top + window.scrollY,
    width: props.tags.getBoundingClientRect().width,
    height: props.tags.getBoundingClientRect().height,
  };

  const heightSelect = select.value.offsetHeight;
  const heightWindow = window.innerHeight;
  const heightBottomSelect =
    heightWindow - props.tags.getBoundingClientRect().bottom;

  if (heightBottomSelect > heightSelect + 5) {
    positionSelect.value.top = positionTags.value.bottom;
    select.value.classList.remove("select-top"); // анимация скрытия
  } else {
    positionSelect.value.top = positionTags.value.top - heightSelect;
    select.value.classList.add("select-top");
  }
};

const hideSelect = (event) => {
  emits("hideSelect");
};

onUnmounted(() => {
  classes.forEach((el) => {
    el.removeEventListener("scroll", hideSelect);
  });
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.select-wrapper {
  z-index: 1110;
  background-color: #18181b;
  border: 1px solid #4e4e51;
  position: absolute;
  display: flex;
  border-radius: 6px;
  max-height: 300px;
  overflow: hidden;
}
.select-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.select-header {
}
.select-body {
  flex-grow: 1;
  overflow: hidden;
}
.select-footer {
}

// transition
.select-enter-from,
.select-leave-to {
  opacity: 0;
  transform: scaleY(0.97);
  transform-origin: top center;
}

.select-enter-from.select-top,
.select-leave-to.select-top {
  transform-origin: bottom center;
}

.select-enter-active,
.select-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
</style>
