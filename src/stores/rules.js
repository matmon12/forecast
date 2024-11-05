import { defineStore } from "pinia";
import { object, string, ref, boolean, array, number } from "yup";

const stringRules = /^[a-zA-Zа-яА-Я\s]+$/;
const symbolsRules = /^[^<>*\\/|"]+$/;
const emailRules = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

const getTextError = (message) => {
  return `The password must contain at least 1 ${message} character!`;
};

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

  const schemaSearchDashboard = object({
    searchDashboard: string().required("The field must not be empty!"),
  });

  const schemaPostDialog = object({
    image: string().required("Upload an image!"),
    name: string()
      .required("The field must not be empty!")
      .min(5, "The name must contain at least 5 characters!")
      .test({
        name: "symbols",
        skipAbsent: true,
        test(value, ctx) {
          if (!symbolsRules.test(value)) {
            return ctx.createError({
              message: "The name must not contain prohibited characters!",
            });
          }
          return true;
        },
      }),
    lengthDescription: number()
      .min(100, "The description must contain at least 100 characters!")
      .max(
        20000,
        "The description must contain no more than 20000 characters!"
      ),
    category: string().required("Select a category!"),
    tags: array()
      .ensure()
      .min(1, "Select at least 1 tag!")
      .max(5, "There should be no more than 5 tags!"),
    summary: string().required("The field must not be empty!"),
  });

  const schemaSignUp = object({
    password: string()
      .required("Enter your password!")
      .min(6, "The password must contain at least 6 characters!")
      .matches(/[0-9]/, getTextError("numerical"))
      .matches(/[a-z]/, getTextError("lowercase"))
      .matches(/[A-Z]/, getTextError("capital")),
    email: string()
      .required("Enter your email!")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "Email is not valid!" });
          }
          return true;
        },
      }),
    confirmPassword: string()
      .required("Enter your password again!")
      .oneOf([ref("password"), null], "Passwords do not match!"),
  });

  const schemaSignIn = object({
    password: string()
      .required("Enter your password!")
      .min(6, "The password must contain at least 6 characters!")
      .matches(/[0-9]/, getTextError("numerical"))
      .matches(/[a-z]/, getTextError("lowercase"))
      .matches(/[A-Z]/, getTextError("capital")),
    email: string()
      .required("Enter your email!")
      .test({
        name: "test",
        skipAbsent: true,
        test(value, ctx) {
          if (!emailRules.test(value)) {
            return ctx.createError({ message: "Email is not valid!" });
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
    schemaSignIn
  };
});
