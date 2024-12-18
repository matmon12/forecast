<template>
  <div class="category" v-if="!errorPosts">
    <div class="category-wrapper">
      <div
        v-if="loadingPosts && posts.length === 0"
        v-for="(item, index) of countSkeletons"
        :key="index"
        :class="[
          'category__skeleton',
          {
            'category__skeleton-gorizont': generateSequence.includes(index),
          },
        ]"
      >
        <div class="category__skeleton-imgwrap">
          <Skeleton height="100%" class="category__skeleton-img" />
        </div>
        <div class="category__skeleton-texts">
          <Skeleton
            :height="uiStore.xs2Smaller ? '0.8rem' : '1.1rem'"
            class="category__skeleton-text"
          />
          <Skeleton
            :height="uiStore.xs2Smaller ? '0.8rem' : '1.1rem'"
            width="70%"
            class="category__skeleton-text"
          />
          <Skeleton
            :height="uiStore.xs2Smaller ? '0.8rem' : '1.1rem'"
            width="50%"
            class="category__skeleton-text"
          />
        </div>
      </div>
      <PostCard
        v-for="(post, index) of posts"
        :key="post.id"
        :id="post.id"
        :title="post.name"
        :image="post.image"
        :summary="post.summary"
        :orientation="generateSequence.includes(index) ? 'gorizont' : ''"
        @click="navigateToPost(post)"
        class="category__item"
      />
    </div>
    <button
      v-if="countLoadedPosts > postsPerPage"
      @click="moveNextPage"
      class="category-btn"
      :disabled="loadingPosts"
    >
      <i-svg-spinners:3-dots-fade v-if="loadingPosts && posts.length > 0" />
      <span v-else>Show more...</span>
    </button>
  </div>
  <Error
    class="category-error"
    v-else
    :message="errorPosts.description"
    retry
    @to-back="onToBack"
    @retry="onErrorHandler"
  />
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import {
  query,
  limit,
  startAt,
  orderBy,
  endAt,
  where,
} from "firebase/firestore";
import { postsRef } from "@/server/firebase.config";
import { readToDB } from "@/server/posts";
import { onToBack } from "@/utils/index";
import { useRoute } from "vue-router";
import { useUiStore } from "../stores/ui";
import router from "@/router/router";

const countSkeletons = ref(6);
const countPosts = ref(countSkeletons.value);
const postsPerPage = ref(6);
const route = useRoute();
const uiStore = useUiStore();

// posts
const posts = ref([]);
const errorPosts = ref();
const loadingPosts = ref(false);
const cursorNextPage = ref(null);
const countLoadedPosts = ref(0);
let lastVisible;

const postQuery = computed(() => {
  return query(
    postsRef,
    limit(postsPerPage.value + 1),
    categorySource.value
      ? where("category", "==", categorySource.value)
      : where("category", "!=", null),
    orderBy("date", "desc"),
    cursorNextPage.value ? startAt(cursorNextPage.value) : endAt(null)
  );
});

const categorySource = computed(() => {
  moveToStart();

  return route.params.category;
});

const moveToStart = () => {
  posts.value = [];
  cursorNextPage.value = null;
  countLoadedPosts.value = 0;
};

const getPosts = async () => {
  errorPosts.value = null;
  loadingPosts.value = true;
  try {
    const querySnapshot = await readToDB(postQuery.value);

    querySnapshot.docs.forEach((doc, index) => {
      if (index < postsPerPage.value) {
        posts.value.push(doc.data());
      }
    });

    // получение последнего видимого поста
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    // рассчет индексов постов для которых горизонтальная ориентация (для этого)
    countPosts.value = posts.value.length;

    // количество загруженных постов
    countLoadedPosts.value = querySnapshot.docs.length;
  } catch (error) {
    const stringToObject = JSON.parse(error.message);

    errorPosts.value = stringToObject;
  } finally {
    loadingPosts.value = false;
  }
};

watch(
  () => postQuery.value,
  () => {
    getPosts();
  },
  { immediate: true }
);

const onErrorHandler = () => {
  getPosts();
};

const moveNextPage = () => {
  cursorNextPage.value = lastVisible;
};

const generateSequence = computed(() => {
  let current = 0;
  const indices = [current];
  let numberOne = 3;
  let numberTwo = 1;
  let numberThree = 4;

  if (uiStore.mdSmaller) {
    numberOne = 2;
    numberThree = 3;
  }
  if (uiStore.smSmaller) {
    numberTwo = 3;
    numberThree = 3;
  }

  while (current <= countPosts.value) {
    if (indices.length % numberOne === 0) {
      current += numberTwo;
    } else {
      current += numberThree;
    }
    indices.push(current);
  }

  return indices;
});

const navigateToPost = (post) => {
  router.push({
    name: "Post",
    params: {
      category: post.category,
      name: post.slug,
    },
  });
};
</script>

<style lang="scss" scoped>
@include CategoryNews();
.category {
  display: flex;
  flex-direction: column;
}
.category-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 300px;
  gap: 15px;
}
.category__item {
}
.category-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 38px;
  padding: 4px 10px;
  background-color: var(--blue-100);
  border-radius: 10px;
  margin: 15px auto 0;
  color: #000;
  font-weight: 500;
  transition: filter 0.3s;
  &:hover,
  &:disabled {
    filter: brightness(0.8);
  }
  &:disabled {
    cursor: default;
  }

  svg {
    font-size: 18px;
  }
}
.category__skeleton {
  padding: 15px;
  background-color: var(--skeleton-back);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  &-imgwrap {
    height: 60%;
  }
  &-img {
    border-radius: 10px;
  }
  &-text {
    margin-bottom: 7px;
  }
  &-img,
  &-text {
    background-color: var(--skeleton-text);
    &::after {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0),
        var(--skeleton-animation),
        rgba(255, 255, 255, 0)
      );
    }
  }
}
.category__skeleton-gorizont {
  grid-column: span 2;
  flex-direction: row;
  .category__skeleton-imgwrap {
    width: 55%;
    height: 100%;
    order: 1;
  }
  .category__skeleton-texts {
    width: 45%;
  }
}
.category-error {
  flex-grow: 1;
}
</style>
