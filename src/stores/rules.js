import { defineStore } from "pinia";
import { object, string, ref, boolean } from "yup";

const stringRules = /^[a-zA-Zа-яА-Я\s]+$/;

export const useRulesStore = defineStore("rules", () => {
  const schemaSearch = object({
    search: string()
      .required("The field must not be empty!")
      .min(3, "The name must contain at least 3 characters!")
      .label("City")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!stringRules.test(value)) {
            return ctx.createError({
              message: "Name must include only literal values!",
            });
          }
          return true;
        },
      }),
  });

  return {
    schemaSearch,
  };
});
