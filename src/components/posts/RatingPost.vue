<template>
  <div class="post__rating">
    <button @click="onChangeRating($event)" class="post__rating-btn">
      <i-fluent:arrow-up-12-filled />
    </button>
    <p class="post__rating-text">{{ rating }}</p>
    <button @click="onChangeRating($event)" class="post__rating-btn">
      <i-fluent:arrow-down-12-filled />
    </button>
  </div>
</template>

<script setup>
import { markRaw, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useConfirm } from "primevue/useconfirm";
import router from "@/router/router";
import IcOutlinePerson from '~icons/ic/outline-person';

const authStore = useAuthStore();
const confirm = useConfirm();

const rating = ref(0);

const onChangeRating = (event) => {
  if (authStore.user) {
    rating.value--;
  } else {
    onShowConfirm(event);
  }
};

const onShowConfirm = (event) => {
  const confirmInfo = markRaw({
    target: event.currentTarget,
    group: "headless",
    message: "Register to rate this post",
    rejectLabel: "Cancel",
    acceptLabel: "Login",
    icon: IcOutlinePerson,
    colorIcon: '#85c2ff',
    accept: () => {
      router.push({ path: "/forecast/signin" });
    },
  });
  confirm.require(confirmInfo);
};
</script>

<style lang="scss" scoped>
.post__rating {
  display: flex;
  align-items: center;
  // justify-content: flex-end;
  gap: 13px;
}
.post__rating-btn {
  display: flex;
  font-size: 16px;
  padding: 7px;
  background-color: $blue;
  border-radius: 5px;
  color: #000;
  transition: filter 0.3s;
  box-shadow: 0 0 10px #0000009d;

  &:hover {
    filter: brightness(1.3);
  }

  &:disabled {
    filter: brightness(0.8);
    cursor: default;
  }
}
.post__rating-text {
  font-size: 16px;
  line-height: 1;
  min-width: 27px;
  text-align: center;
}
</style>
