import { ref } from "vue";
import { defineStore } from "pinia";
import { logOut } from "@/server/auth";
import router from "@/router/router";
import { useToast } from "primevue/usetoast";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();

  const user = ref();

  const logoutUser = async () => {
    try {
      await logOut();

      toast.add({
        severity: "success",
        summary: "Successfully",
        detail: "Logout successful!",
        life: 3000,
      });

      router.push({ path: "/forecast/" });
    } catch (e) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: e.message,
        life: 3000,
      });
    }
  };

  return { user, logoutUser };
});
