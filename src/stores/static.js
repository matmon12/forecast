import { defineStore } from "pinia";
import { ref } from "vue";

export const useStaticStore = defineStore("static", () => {
  const categories = ref(["weather", "nature", "animals", "auto", "science"]);

  return { categories };
});
