<template>
  <div class="auth">
    <div class="auth__content">
      <h1 class="auth-title">Sign Up</h1>
      <form class="auth__form">
        <Message
          v-if="error"
          severity="warn"
          :closable="!uiStore.xs2Smaller"
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
              ><i-ic:round-close
            /></Button>
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
              :invalid="!!errors.password"
              placeholder="Password"
              toggleMask
              :mediumRegex="mediumRegex"
              :strongRegex="strongRegex"
              :pt="{
                ...getClasses('auth').password,
                pcinput: { ...getClasses('auth').inputtext },
              }"
            >
              <template #header>
                <h5 class="auth__meter-title">Pick a password</h5>
              </template>
              <template #footer>
                <Divider />
                <ul class="auth__meter-list">
                  <li class="auth__meter-item">At least one lowercase</li>
                  <li class="auth__meter-item">At least one uppercase</li>
                  <li class="auth__meter-item">At least one numeric</li>
                  <li class="auth__meter-item">Minimum 6 characters</li>
                </ul>
              </template>
            </Password>
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
        <label class="auth__input-label">
          <InputGroup class="auth__inputgroup">
            <InputGroupAddon class="auth__input-icon">
              <i-mdi:password-outline />
            </InputGroupAddon>
            <Password
              v-model="confirmPassword"
              placeholder="Confirm password"
              toggleMask
              :invalid="!!errors.confirmPassword"
              :mediumRegex="mediumRegex"
              :strongRegex="strongRegex"
              :pt="{
                ...getClasses('auth').password,
                pcinput: { ...getClasses('auth').inputtext },
              }"
            >
              <template #header>
                <h5 class="auth__meter-title">Pick a password</h5>
              </template>
              <template #footer>
                <Divider />
                <ul class="auth__meter-list">
                  <li class="auth__meter-item">At least one lowercase</li>
                  <li class="auth__meter-item">At least one uppercase</li>
                  <li class="auth__meter-item">At least one numeric</li>
                  <li class="auth__meter-item">Minimum 6 characters</li>
                </ul>
              </template>
            </Password>
            <Button
              v-if="confirmPassword"
              severity="secondary"
              class="auth__input-clear"
              @click="resetField('confirmPassword')"
              ><i-ic:round-close
            /></Button>
          </InputGroup>
          <transition name="auth">
            <small
              v-if="errors.confirmPassword"
              class="error auth-error-text"
              >{{ errors.confirmPassword }}</small
            >
          </transition>
        </label>
        <Button
          @click="onSubmit"
          :pt="getClasses('auth').button"
          unstyled
          :disabled="loading"
        >
          <i-svg-spinners:180-ring v-if="loading" />
          <i-line-md:person v-else />
          Sign Up</Button
        >
      </form>
      <p class="auth-line"><span>OR</span></p>
      <Button class="auth-btn-more"
        ><i-flat-color-icons:google /> Sign in with Google</Button
      >
      <div class="auth__redirect">
        <span class="auth__redirect-text">Are you already registered?</span>
        <router-link :to="{ name: 'SignIn' }" class="auth__redirect-link"
          >Sign in</router-link
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
import { useAuthStore } from "@/stores/auth";
import { signUp } from "@/server/auth";
import { writeToDB } from "@/server/users";
import { useToast } from "primevue/usetoast";
import { useUiStore } from "../../stores/ui";
import router from "@/router/router";

const error = ref();
const loading = ref(false);
const mediumRegex = ref(
  "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{4,})"
);
const strongRegex = ref("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})");

const rulesStore = useRulesStore();
const authStore = useAuthStore();
const toast = useToast();
const uiStore = useUiStore();

const signupUser = async () => {
  error.value = "";
  loading.value = true;
  try {
    const user = await signUp(values.email, values.password);

    const userInfo = {
      email: user.email,
      role: "USER",
      createdAt: new Date().getTime(),
    };

    await writeToDB(user.uid, userInfo);

    // обновление роли
    authStore.defineRole("USER");

    // локальные данные
    authStore.uid = user.uid;
    authStore.user = userInfo;
    localStorage.setItem(
      "auth",
      JSON.stringify({
        uid: user.uid,
      })
    );

    // успех
    toast.add({
      severity: "success",
      summary: "Successfully",
      detail: "Signup successful!",
      life: 3000,
    });

    router.push({ name: "Home" });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

// validate
const { defineField, handleSubmit, errors, values, resetField } = useForm({
  validationSchema: rulesStore.schemaSignUp,
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
const [confirmPassword] = defineField("confirmPassword", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});

const onSubmit = handleSubmit((value) => {
  signupUser();
});
</script>

<style lang="scss" scoped>
@import "@/style/auth";
</style>

<style lang="scss">
.auth-password-overlay {
  font-size: 14px;
  background-color: var(--modal);
  color: var(--white);
}
.auth-password-meter {
  background-color: var(--grey-790);
}
// regex password color
.p-password-meter-weak {
  background-color: var(--blue-170);
}
.p-password-meter-medium {
  background: #68a7ff;
}
.p-password-meter-strong {
  background: #2a6fcf;
}
</style>
