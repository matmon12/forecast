<template>
  <div v-if="!errorPost" class="post">
    <div class="post__left">
      <div v-if="!loadingPost && !errorPost" class="post-block post__content">
        <h1 class="post-title">{{ post?.name }}</h1>
        <div class="post__header">
          <p class="post__header-item">
            <i-fluent:calendar-ltr-32-filled />
            <span>
              {{ getFormatedDate(post?.date) }}
            </span>
          </p>
          <p class="post__header-item">
            <i-tabler:clock-filled />
            <span> {{ getFormatedTime(post?.time) }} мин </span>
          </p>
        </div>
        <div v-html="post?.description" lang="ru" class="post-text"></div>
        <div class="post__tags">
          <h5 class="post__tags-title">Теги</h5>
          <div class="post__tags-list">
            <Tag
              v-for="(tag, index) of post?.tags"
              :key="index"
              severity="secondary"
              class="post__tags-item"
              >{{ tag }}</Tag
            >
          </div>
        </div>
        <Divider />
        <RatingPost/>
      </div>
      <div v-if="loadingPost" class="post-block post__skeleton">
        <Skeleton height="30px" class="post__skeleton-title" />
        <Skeleton height="30px" width="60%" class="post__skeleton-title" />
        <div class="post__skeleton-header">
          <div class="post__skeleton-header-item">
            <Skeleton width="20px" height="20px" />
            <Skeleton
              width="110px"
              height="10px"
              class="post__skeleton-header-text"
            />
          </div>
          <div class="post__skeleton-header-item">
            <Skeleton width="20px" height="20px" />
            <Skeleton
              width="110px"
              height="10px"
              class="post__skeleton-header-text"
            />
          </div>
        </div>
        <div class="post__skeleton-text">
          <Skeleton />
          <Skeleton />
          <Skeleton width="40%" />
        </div>
        <div class="post__skeleton-imgwrap">
          <Skeleton height="300px" />
          <Skeleton class="post__skeleton-subtext" width="180px" />
        </div>
        <div class="post__skeleton-text">
          <Skeleton />
          <Skeleton />
          <Skeleton width="70%" />
          <Skeleton width="40%" />
        </div>
      </div>
      <div class="post__left-footer">
        <div class="post-block post__share">
          <h4 class="post__share-title">Поделитесь новостью</h4>
          <div class="post-links">
            <a
              v-for="(link, index) of shareLinks"
              :key="index"
              class="post-link"
              :href="link.link"
            >
              <component :is="link.icon"></component>
            </a>
          </div>
        </div>
        <div class="post-block post__subscribe">
          <h4 class="post__subscribe-title">Подпишитесь на нас</h4>
          <div class="post__subscribe-list">
            <a
              v-for="(link, index) of subscribeLinks"
              :key="index"
              :href="link.link"
              :class="['post__subscribe-item', link.class]"
            >
              <img :src="link.icon" alt="zen" class="post__subscribe-img" />
              <span class="post__subscribe-text">{{ link.text }}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="post__right">
      <div class="post-block post__category">
        <h3 class="post__category-title">Читайте также</h3>
        <div class="post__category-list">
          <SimilarPost
            v-if="!loadingCategory && !errorCategory"
            v-for="(post, index) of postsCategory"
            :key="index"
            :id="post.id"
            :title="post.name"
            :image="post.image"
            class="post__category-item"
            @click="navigateToPost(post)"
          />
          <div
            v-if="loadingCategory"
            v-for="(post, index) of limitCategory"
            :key="index"
            class="post__category-skeleton"
          >
            <Skeleton height="100%" width="120px" />
            <div class="post__category-skeleton-texts">
              <Skeleton class="post__category-skeleton-text" height="15px" />
              <Skeleton
                class="post__category-skeleton-text"
                height="15px"
                width="60%"
              />
            </div>
          </div>
          <div v-if="errorCategory" class="post__category-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-width="1"
              >
                <path
                  d="M15 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10"
                />
                <path
                  stroke-linejoin="round"
                  d="M2 7h20M5 5.01l.01-.011M8 5.01l.01-.011M11 5.01l.01-.011M18 22.243l2.121-2.122m0 0L22.243 18m-2.122 2.121L18 18m2.121 2.121l2.122 2.122"
                />
              </g>
            </svg>
            <span class="post__category-error-text">{{ errorCategory }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Error
    v-else
    :message="errorPost"
    @to-back="onToBack()"
    retry
    @retry="getData()"
    class="post-error"
  />
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, markRaw, defineProps, onMounted, watch } from "vue";
import { readToDB } from "@/server/posts";
import { query, where, limit } from "firebase/firestore";
import { postsRef } from "@/server/firebase.config";
import { onToBack } from "@/utils/index";
import router from "@/router/router";
import AkarIconsVkFill from "~icons/akar-icons/vk-fill";
import FormkitWhatsapp from "~icons/formkit/whatsapp";
import FileIconsTelegram from "~icons/file-icons/telegram";
import zen from "@/img/zen.svg";
import tg from "@/img/tg.svg";

const route = useRoute();

const post = ref();
const postsCategory = ref([]);
const loadingPost = ref(false);
const loadingCategory = ref(false);
const errorPost = ref();
const errorCategory = ref();
const limitCategory = 3;
const currentUrl = window.location.href;

const shareLinks = markRaw([
  {
    icon: AkarIconsVkFill,
    link: `https://vk.com/share.php?url=${currentUrl}`,
  },
  {
    icon: FormkitWhatsapp,
    link: `https://api.whatsapp.com/send?text=${currentUrl}`,
  },
  {
    icon: FileIconsTelegram,
    link: `https://t.me/share/url?url=${currentUrl}`,
  },
]);

const subscribeLinks = markRaw([
  {
    icon: zen,
    link: "https://dzen.ru/gismeteo.ru",
    text: "Дзен",
    class: "post__subscribe-zen",
  },
  {
    icon: tg,
    link: "https://t.me/+IJ9mfnkvkaAwYTBi",
    text: "Телеграм",
    class: "post__subscribe-tg",
  },
]);

onMounted(() => {
  getData();
});

const getData = () => {
  loadingCategory.value = true;
  errorCategory.value = null;
  getPost()
    .then(() => {
      getPostsCategory(post.value.category);
    })
    .catch((error) => {
      loadingCategory.value = false;
      errorCategory.value = error.message;
    });
};

const getPost = async () => {
  loadingPost.value = true;
  errorPost.value = null;
  try {
    const querySnapshot = await readToDB(
      query(postsRef, where("slug", "==", route.params.name))
    );
    post.value = querySnapshot?.docs[0]?.data();

    if (!post.value) {
      router.push({
        name: "NotFound",
        params: {
          pathMatch: route.path.split("/").slice(1),
        },
        query: route.query,
        hash: route.hash,
      });
    }
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    errorPost.value = stringToObject.description;

    throw new Error(stringToObject.description);
  } finally {
    loadingPost.value = false;
  }
};

const getPostsCategory = async (category) => {
  try {
    const querySnapshot = await readToDB(
      query(
        postsRef,
        where("category", "==", category),
        where("slug", "!=", route.params.name),
        limit(limitCategory)
      )
    );
    querySnapshot.forEach((doc) => {
      postsCategory.value.push(doc.data());
    });
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    errorCategory.value = stringToObject.description;
  } finally {
    loadingCategory.value = false;
  }
};

watch(
  () => route.params.name,
  (newValue) => {
    updatePost(newValue);
  }
);

const updatePost = (newPostSlug) => {
  const newPost = postsCategory.value.find((item) => item.slug === newPostSlug);
  const indexReplacedPosts = postsCategory.value.findIndex(
    (item) => item.slug === newPost.slug
  );
  postsCategory.value.splice(indexReplacedPosts, 1, post.value);
  post.value = newPost;
};

const getFormatedDate = (unix) => {
  if (unix) {
    const date = new Date(unix);
    const formatedDate = date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
    });
    const time = date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formatedDate}, ${time}`;
  }
  return unix;
};

const getFormatedTime = (time) => {
  if (time) {
    const roundTime = Math.round(time);
    if (roundTime === 0) {
      return "менее 1";
    }
    return roundTime;
  }
  return time;
};

const navigateToPost = (post) => {
  router.replace({
    name: "Post",
    params: {
      category: post.category,
      name: post.slug,
    },
  });
};

</script>

<style lang="scss" scoped>
.post {
  color: $white;
  display: grid;
  grid-template-columns: 640px auto;
  column-gap: 15px;
}

.post-block {
  padding: 15px;
  background-color: $grey;
  border-radius: 10px;
}

.post-title {
  font-size: 28px;
  font-weight: 500;
  line-height: 1.3;
}
.post__header {
  display: flex;
  gap: 15px;
  margin: 10px 0 20px 0;
}
.post__header-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #ccc;
  letter-spacing: 0.1px;

  svg {
    font-size: 16px;
    color: $blue;
  }
}

.post__left-footer {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.post__share {
  width: 360px;
}
.post__share-title {
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1;
}
.post-links {
  display: flex;
  gap: 10px;
}
.post-link {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #525252;
  border-radius: 5px;
  height: 30px;
  font-size: 16px;
  color: $white;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(1.3);
  }
}
.post__subscribe {
  flex-grow: 1;
}
.post__subscribe-title {
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1;
}
.post__subscribe-list {
  display: flex;
  gap: 10px;
}
.post__subscribe-item {
  flex-grow: 1;
  height: 30px;
  background-color: #525252;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: $white;
  transition: filter 0.3s;

  &:hover {
    filter: brightness(1.3);
  }
}
.post__subscribe-img {
  width: 20px;
}
.post__subscribe-zen {
  background-color: #fff;
  color: #000;
  font-weight: 500;
}
.post__subscribe-tg {
  background: linear-gradient(
    81.86deg,
    #47a3d1 -13.77%,
    #70a0ff 60.35%,
    #cc35cc 165.23%
  );
}

.post__right {
}
.post__category {
  position: sticky;
  top: 110px;
}
.post__category-title {
  font-size: 23px;
  font-weight: 600;
  margin-bottom: 10px;
}
.post__category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.post__category-item {
  height: 100px;
}

// skeleton
.post__skeleton {
  padding: 20px 15px 10px;
}
.post__skeleton-title {
  margin-bottom: 10px;
}
.post__skeleton-header {
  display: flex;
  gap: 20px;
  margin: 15px 0 25px;
  &-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
.post__skeleton-header-text {
  border-radius: 3px;
}
.post__skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0;
}
.post__skeleton-imgwrap {
  margin: 20px 0;
}
.post__skeleton-subtext {
  margin: 10px 0 0 auto;
}

// skeleton category
.post__category-skeleton {
  height: 100px;
  display: flex;
  gap: 15px;
  background-color: #2d2d2d;
  padding: 10px;
  border-radius: 10px;
}
.post__category-skeleton-texts {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}
.post__category-skeleton-text {
  border-radius: 5px;
}

// error category
.post__category-error {
  background-color: #2d2d2d;
  border-radius: 10px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  svg {
    font-size: 100px;
  }
  &-text {
    max-width: 80%;
    text-align: center;
    margin-top: 15px;
    font-size: 16px;
  }
}

// error
.post-error {
  height: 100%;
}

.post__tags {
  margin-top: 20px;
}
.post__tags-title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 5px;
}
.post__tags-list {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.post__tags-item {
  background-color: #464646;
  // color: #000;
}
</style>

<style lang="scss">
.post-text {
  font-size: 16px;

  p {
    text-align: justify;
    word-wrap: break-word;
    hyphens: auto;

    &:not(:empty) {
      margin: 10px 0;
    }
  }
  img {
    margin-bottom: 5px;
    width: 100%;
    border-radius: 10px;
  }
  table {
    margin: 10px 0;
    width: 100%;
    border-collapse: collapse;
    td {
      width: auto;
      padding: 10px 0;
      &:nth-child(1) {
        padding-left: 10px;
      }
    }
    tr {
      &:nth-child(2n) {
        background-color: #1a1a1a;
      }
    }
  }
  .ql-align-right {
    text-align: right;
  }
  .ql-video {
    width: 100%;
    margin: 20px 0;
    display: block;
    border-radius: 10px;
  }
}
</style>
