<template>
  <Switch
    class="aside-switch"
    @toggle-switch="changeTheme"
    :icons="[
      LineMdMoonToSunnyOutlineLoopTransition,
      LineMdSunnyOutlineToMoonLoopTransition,
    ]"
    :model-value="isDark"
    :width="'--width'"
    :height="'--height'"
    :offset="'--offset'"
    :colors="['#8d8d8d', '#fff', '#2f2f2f']"
  />
</template>

<script setup>
import LineMdSunnyOutlineToMoonLoopTransition from "~icons/line-md/sunny-outline-to-moon-loop-transition";
import LineMdMoonToSunnyOutlineLoopTransition from "~icons/line-md/moon-to-sunny-outline-loop-transition";
import { useToggle, useDark } from "@vueuse/core";
import { useUiStore } from "../../stores/ui";

const uiStore = useUiStore();

const isDark = useDark({
  selector: "body",
  attribute: "class",
  // disableTransition: false,
});

const toggleDark = useToggle(isDark);

const setThemeValue = () => (isDark.value ? true : false);
uiStore.theme = setThemeValue();

const changeTheme = () => {
  toggleDark();
  uiStore.theme = setThemeValue();
};
</script>

<style lang="scss" scoped>
.aside-switch {
  // переменные для switch
  --width: 45px;
  --height: 26px;
  --offset: 3px;
}
:deep() {
  .round{
    transition: all .4s !important;
  }
}
</style>
