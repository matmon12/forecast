import { ref } from "vue";
import { defineStore } from "pinia";
import { useBreakpoints } from "@vueuse/core";

export const useUiStore = defineStore("ui", () => {
  const breakpoints = useBreakpoints({
    xs4: 320,
    xs3: 360,
    xs2: 500,
    xs: 600,
    sm: 700,
    sm2: 800,
    md: 1000,
    lg: 1150,
    xl: 1200,
  });

  const theme = ref();
  const activeBreakpoint = ref(breakpoints.active());
  const sm2AndLarger = breakpoints.greaterOrEqual("sm2");
  const xsAndLarger = breakpoints.greaterOrEqual("xs");
  const xs2Smaller = breakpoints.smaller("xs2");
  const smSmaller = breakpoints.smaller("sm");
  const mdSmaller =breakpoints.smaller("md");

  return {
    theme,
    activeBreakpoint,
    breakpoints,
    sm2AndLarger,
    xsAndLarger,
    xs2Smaller,
    smSmaller,
    mdSmaller
  };
});
