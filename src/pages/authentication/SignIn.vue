<template>
  <div class="auth">
    <div class="auth__content">
      <h1 class="auth-title">{{ $t("auth.signin.title") }}</h1>
      <form class="auth__form">
        <Message
          v-if="error"
          severity="warn"
          closable
          :pt="getClasses('auth').message"
        >
          <i-ion:warning-outline />
          <span>{{ $t(`error_codes.${error}`) }}</span>
        </Message>
        <label class="auth__input-label">
          <InputGroup class="auth__inputgroup">
            <InputGroupAddon class="auth__input-icon">
              <i-ic:baseline-alternate-email />
            </InputGroupAddon>
            <InputText
              v-model.trim="email"
              :placeholder="$t('placeholders.email')"
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
              $t(`validation.${errors.email?.key || errors.email}`, {
                ...errors.email?.values,
              })
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
              :placeholder="$t('placeholders.password')"
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
              $t(`validation.${errors.password?.key || errors.password}`, {
                ...errors.password?.values,
              })
            }}</small>
          </transition>
        </label>
        <div class="auth-forgot">
          <a class="auth-forgot-link" href="#">{{ $t("auth.forgot") }}</a>
        </div>
        <Button
          @click="onSubmit"
          :pt="getClasses('auth').button"
          unstyled
          :disabled="loading"
        >
          <i-svg-spinners:180-ring v-if="loading" />
          <i-line-md:person v-else />
          {{ $t("buttons.signin") }}</Button
        >
      </form>
      <p class="auth-line">
        <span>{{ $t("auth.or") }}</span>
      </p>
      <Button class="auth-btn-more"
        ><i-flat-color-icons:google /> {{ $t("buttons.google") }}</Button
      >
      <div class="auth__redirect">
        <span class="auth__redirect-text">{{
          $t("auth.signin.redirect")
        }}</span>
        <router-link :to="{ name: 'SignUp' }" class="auth__redirect-link">{{
          $t("auth.signup.title")
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
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
const t = inject("t");

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
      summary: t("success.successfully"),
      detail: t("success.signin.description"),
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

    router.push({ name: "Home" });
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
