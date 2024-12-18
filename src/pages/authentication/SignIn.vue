<template>
  <div class="auth">
    <div class="auth__content">
      <h1 class="auth-title">Sign In</h1>
      <form class="auth__form">
        <Message
          v-if="error"
          severity="warn"
          closable
          :pt="getClasses('auth').message"
        >
          <i-ion:warning-outline />
          <span>{{ error }}</span>
        </Message>
        <label class="auth__input-label">
          <InputGroup class="auth__inputgroup">
            <InputGroupAddon class="auth__input-icon">
              <i-ic:baseline-alternate-email />
            </InputGroupAddon>
            <InputText
              v-model.trim="email"
              placeholder="Your Email"
              autofocus
              :invalid="!!errors.email"
              :pt="getClasses('auth').inputtext"
            />
            <Button
              v-if="email"
              severity="secondary"
              class="auth__input-clear"
              @click="resetField('email')"
            >
              <i-ic:round-close />
            </Button>
          </InputGroup>
          <transition name="auth">
            <small v-if="errors.email" class="error auth-error-text">{{
              errors.email
            }}</small>
          </transition>
        </label>
        <label class="auth__input-label">
          <InputGroup class="auth__inputgroup">
            <InputGroupAddon class="auth__input-icon">
              <i-mdi:password />
            </InputGroupAddon>
            <Password
              v-model="password"
              placeholder="Password"
              toggleMask
              :invalid="!!errors.password"
              :feedback="false"
              :pt="{
                ...getClasses('auth').password,
                pcinput: { ...getClasses('auth').inputtext },
              }"
            />
            <Button
              v-if="password"
              severity="secondary"
              class="auth__input-clear"
              @click="resetField('password')"
              ><i-ic:round-close
            /></Button>
          </InputGroup>
          <transition name="auth">
            <small v-if="errors.password" class="error auth-error-text">{{
              errors.password
            }}</small>
          </transition>
        </label>
        <div class="auth-forgot">
          <a class="auth-forgot-link" href="#">Forgot password?</a>
        </div>
        <Button
          @click="onSubmit"
          :pt="getClasses('auth').button"
          unstyled
          :disabled="loading"
        >
          <i-svg-spinners:180-ring v-if="loading" />
          <i-line-md:person v-else />
          Sign In</Button
        >
      </form>
      <p class="auth-line"><span>OR</span></p>
      <Button class="auth-btn-more"
        ><i-flat-color-icons:google /> Sign in with Google</Button
      >
      <div class="auth__redirect">
        <span class="auth__redirect-text">Don't have an account?</span>
        <router-link to="/forecast/signup" class="auth__redirect-link"
          >Sign up</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Password from "primevue/password";
import { getClasses } from "@/utils/classes";
import { useForm } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { signIn } from "../../server/auth";
import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";
import router from "@/router/router";

const error = ref();
const loading = ref(false);

const rulesStore = useRulesStore();
const authStore = useAuthStore();
const toast = useToast();

const signinUser = async () => {
  error.value = "";
  loading.value = true;
  try {
    const user = await signIn(values.email, values.password);

    // успех
    toast.add({
      severity: "success",
      summary: "Successfully",
      detail: "Signin successful!",
      life: 3000,
    });

    // локальные данные
    authStore.uid = user.uid;
    localStorage.setItem(
      "auth",
      JSON.stringify({
        uid: user.uid,
      })
    );

    router.push({ path: "/forecast/" });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

// validate
const { defineField, handleSubmit, errors, values, resetField } = useForm({
  validationSchema: rulesStore.schemaSignIn,
});

const [email] = defineField("email", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [password] = defineField("password", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});

const onSubmit = handleSubmit((value) => {
  signinUser();
});
</script>

<style lang="scss" scoped>
@import "@/style/auth";

.auth-forgot {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.auth-forgot-link {
  color: var(--blue-160);
  font-weight: 500;
  font-size: 15px;
}
</style>
