import { ref } from "vue";
import { defineStore } from "pinia";
import { logOut } from "@/server/auth";
import router from "@/router/router";
import { useToast } from "primevue/usetoast";
import { getDocFromDB } from "@/server/users";
import { ability, defineAbilityFor } from "../services/ability";

export const useAuthStore = defineStore("auth", () => {
  const toast = useToast();

  const user = ref();
  const uid = ref();
  const loading = ref(false);

  const logoutUser = async () => {
    if (ability.can("logout")) {
      try {
        await logOut();

        // обновление роли
        defineRole("GUEST")

        // локальные данные
        uid.value = null;
        user.value = null;
        localStorage.removeItem("auth");

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
    }
  };

  const getUserInfo = async () => {
    try {
      loading.value = true;

      const response = await getDocFromDB(uid.value);
      user.value = response;

      // обновление роли
      defineRole(user.value.role);
    } catch (e) {
      const stringToObject = JSON.parse(e.message);

      toast.add({
        severity: "error",
        summary: "Error",
        detail: stringToObject.description,
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  };

  const defineRole = (role) => {
    ability.update(defineAbilityFor(role));
  };

  return { user, uid, loading, logoutUser, getUserInfo, defineRole };
});
