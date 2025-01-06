import { defineStore } from "pinia";
import { object, string, ref, boolean, array, number, setLocale } from "yup";

const stringRules = /^[a-zA-Zа-яА-Я\s]+$/;
const symbolsRules = /^[^<>*\\/|"]+$/;
const emailRules = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const characters = {
  "/[0-9]/": "numerical",
  "/[a-z]/": "lowercase",
  "/[A-Z]/": "capital",
};

setLocale({
  mixed: {
    required: "required",
    oneOf: "oneof",
  },
  number: {
    min: ({ min }) => ({ key: "min", values: { min } }),
    max: ({ max }) => ({ key: "max", values: { max } }),
  },
  string: {
    min: ({ min }) => ({ key: "min", values: { min } }),
    matches: ({ regex, path }) => ({
      key: `matches.${characters[regex]}`,
    }),
  },
  array: {
    min: ({ min }) => ({ key: "array.min", values: { min } }),
    max: ({ max }) => ({ key: "array.max", values: { max } }),
  },
});

export const useRulesStore = defineStore("rules", () => {
  const schemaSearch = object({
    search: string()
      .required()
      .min(3)
      .label("City")
      .test({
        name: "only-literal",
        skipAbsent: true,
        test(value, ctx) {
          if (!stringRules.test(value)) {
            return ctx.createError({
              message: "only_literal",
            });
          }
          return true;
        },
      }),
  });

  const schemaSearchDashboard = object({
    searchDashboard: string().required(),
  });

  const schemaPostDialog = object({
    image: string().required("image.required"),
    name: string()
      .required()
      .min(5)
      .test({
        name: "not-prohibited",
        skipAbsent: true,
        test(value, ctx) {
          if (!symbolsRules.test(value)) {
            return ctx.createError({
              message: "not_prohibited",
            });
          }
          return true;
        },
      }),
    lengthDescription: number().min(100).max(20000),
    category: string().required("category.required"),
    tags: array().ensure().min(1).max(5),
    summary: string().required(),
  });

  const schemaSignUp = object({
    password: string()
      .required()
      .min(6)
      .label("password")
      .matches(/[0-9]/)
      .matches(/[a-z]/)
      .matches(/[A-Z]/),
    email: string()
      .required()
      .test({
        name: "email",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "email" });
          }
          return true;
        },
      }),
    confirmPassword: string()
      .required()
      .oneOf([ref("password"), null]),
  });

  const schemaSignIn = object({
    password: string()
      .required()
      .min(6)
      .label("password")
      .matches(/[0-9]/)
      .matches(/[a-z]/)
      .matches(/[A-Z]/),
    email: string()
      .required()
      .test({
        name: "email",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "email" });
          }
          return true;
        },
      }),
  });

  const schemaProfileSetting = object({
    name: string()
      .required()
      .min(3)
      .test({
        name: "symbols",
        skipAbsent: true,
        test(value, ctx) {
          if (!symbolsRules.test(value)) {
            return ctx.createError({
              message: "symbols",
            });
          }
          return true;
        },
      }),
    lastname: string()
      .required()
      .min(3)
      .test({
        name: "symbols",
        skipAbsent: true,
        test(value, ctx) {
          if (!symbolsRules.test(value)) {
            return ctx.createError({
              message: "symbols",
            });
          }
          return true;
        },
      }),
  });

  return {
    schemaSearch,
    schemaSearchDashboard,
    schemaPostDialog,
    schemaSignUp,
    schemaSignIn,
    schemaProfileSetting,
  };
});
