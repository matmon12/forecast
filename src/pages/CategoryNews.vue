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
            'category__skeleton-gorizont': indicesGorizont.includes(index),
          },
        ]"
      >
        <div class="category__skeleton-imgwrap">
          <Skeleton height="100%" class="category__skeleton-img" />
        </div>
        <div class="category__skeleton-texts">
          <Skeleton height="1.1rem" class="category__skeleton-text" />
          <Skeleton
            height="1.1rem"
            width="70%"
            class="category__skeleton-text"
          />
          <Skeleton
            height="1.1rem"
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
        :orientation="indicesGorizont.includes(index) ? 'gorizont' : ''"
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
import { readToDB } from "@/server/index";
import { onToBack } from "../utils/index";
import { useRoute } from "vue-router";
import router from "../router/router";

const countSkeletons = ref(6);
const postsPerPage = ref(6);
const indicesGorizont = ref([]);
const route = useRoute();

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

    // рассчет индексов постов для которых горизонтальная ориентация
    indicesGorizont.value = generateSequence(posts.value.length);

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

onMounted(() => {
  // рассчет индексов скелетонов для которых горизонтальная ориентация
  indicesGorizont.value = generateSequence(countSkeletons.value);
});

const onErrorHandler = () => {
  getPosts();
};

const moveNextPage = () => {
  cursorNextPage.value = lastVisible;
};

const generateSequence = (count) => {
  let current = 0;
  const indices = [current];

  while (current <= count) {
    if (indices.length % 3 === 0) {
      current += 1;
    } else {
      current += 4;
    }
    indices.push(current);
  }

  return indices;
};

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
  background-color: #6b99c6;
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
  background-color: #ffffff10;
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
  height: 100%;
}
</style>
