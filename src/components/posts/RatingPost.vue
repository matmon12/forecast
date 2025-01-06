<template>
  <div class="post__rating">
    <button
      @click="onChangeRating($event, 'like')"
      :disabled="
        loadingRating || errorRating || existingRating?.rating === 'like'
      "
      :class="[
        'post__rating-btn',
        { 'rating-active': existingRating?.rating === 'like' },
      ]"
    >
      <i-fluent:arrow-up-12-filled />
    </button>
    <div class="post__rating-content">
      <p v-if="!loadingRating" class="post__rating-text">{{ ratingSummary }}</p>
      <i-svg-spinners:180-ring v-else />
    </div>
    <button
      @click="onChangeRating($event, 'dislike')"
      :disabled="
        loadingRating || errorRating || existingRating?.rating === 'dislike'
      "
      :class="[
        'post__rating-btn',
        { 'rating-active': existingRating?.rating === 'dislike' },
      ]"
    >
      <i-fluent:arrow-down-12-filled />
    </button>
  </div>
</template>

<script setup>
import { markRaw, ref, defineProps, watch, inject } from "vue";
import { useConfirm } from "primevue/useconfirm";
import router from "@/router/router";
import IcOutlinePerson from "~icons/ic/outline-person";
import { ability } from "@/services/ability";
import {
  writeToDB,
  readToDB,
  deleteFromDB,
  updateToDB as updateToDBRating,
} from "@/server/ratings";
import { updateToDB as updateToDBPost } from "@/server/posts";
import { useAuthStore } from "@/stores/auth";
import { increment, query, where } from "firebase/firestore";
import { ratingsRef } from "@/server/firebase.config";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  idPost: String,
  rating: Number,
});

const confirm = useConfirm();
const authStore = useAuthStore();
const toast = useToast();
const t = inject("t");

const ratingSummary = ref(props.rating);
const existingRating = ref();
let ratingId;
const loadingRating = ref(false);
const errorRating = ref();

const onChangeRating = (event, rating) => {
  if (ability.can("update", "rating")) {
    addRating(rating);
  }
  if (ability.can("visit", "SignIn")) {
    onShowConfirm(event);
  }
};

const onShowConfirm = (event) => {
  const confirmInfo = markRaw({
    target: event.currentTarget,
    group: "headless",
    message: t("rating.message"),
    rejectLabel: t("buttons.cancel"),
    acceptLabel: t("buttons.login"),
    icon: IcOutlinePerson,
    colorIcon: "#85c2ff",
    accept: () => {
      router.push({ name: "SignIn" });
    },
  });
  confirm.require(confirmInfo);
};

const addRating = async (rating) => {
  loadingRating.value = true;
  try {
    if (existingRating.value) {
      if (existingRating.value.rating !== rating) {
        // обновить существующую оценку
        await updateToDBRating(ratingId, { rating });

        const value = rating === "like" ? 2 : -2;
        await updateRating(value);
        existingRating.value.rating = rating;
      }
    } else {
      const newRating = {
        postId: props.idPost,
        userId: authStore.uid,
        rating,
      };
      // создать новую оценку
      ratingId = await writeToDB(newRating);

      const value = rating === "like" ? 1 : -1;
      await updateRating(value);
      existingRating.value = newRating;
    }
  } catch (e) {
    toast.add({
      severity: "error",
      summary: t("errors.summary"),
      detail: t(`error_codes.${e.message}`),
      life: 5000,
    });
  } finally {
    loadingRating.value = false;
  }
};

const updateRating = async (value) => {
  await updateToDBPost(props.idPost, { rating: increment(value) });
  ratingSummary.value += value;
};

const checkRating = async () => {
  let rating, id;
  loadingRating.value = true;
  errorRating.value = null;
  try {
    // проверка существует ли уже оценка
    const querySnapshot = await readToDB(
      query(
        ratingsRef,
        where("userId", "==", authStore.uid),
        where("postId", "==", props.idPost)
      )
    );
    rating = querySnapshot?.docs[0]?.data();
    id = querySnapshot?.docs[0]?.id;
  } catch (e) {
    errorRating.value = t(`error_codes.${e.message}`);
    toast.add({
      severity: "error",
      summary: t("errors.summary"),
      detail: errorRating.value,
      life: 5000,
    });
  } finally {
    loadingRating.value = false;
  }
  return { rating, id };
};

watch(
  () => props.idPost,
  async () => {
    // обновление рейтинга
    ratingSummary.value = props.rating;
    if (authStore.uid) {
      const { rating, id } = await checkRating();
      existingRating.value = rating;
      ratingId = id;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
@include RatingPost();
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
  background-color: var(--grey-600);
  border-radius: 5px;
  color: var(--grey-50);
  transition: filter 0.3s;
  box-shadow: 0 0 10px #0000009d;

  &:hover {
    filter: brightness(var(--brightness-rating));
  }

  &:disabled {
    filter: brightness(0.7);
    cursor: default;
  }
}
.rating-active {
  background-color: var(--blue-3);
  color: #000;
  &:disabled {
    filter: brightness(1);
  }
}
.post__rating-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 27px;
}
.post__rating-text {
  font-size: 16px;
  line-height: 1;
  text-align: center;
}
</style>
