<template>
  <div class="post">
    <div class="post__left">
      <div class="post-block post__content">
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
      </div>
      <div class="post-block post__share">
        <h4 class="post__share-title">Поделитесь новостью</h4>
        <div class="post-links">
          <a v-for="(link, index) of links" :key="index" :href="link.link">
            <component :is="link.icon"></component>
          </a>
        </div>
      </div>
    </div>
    <div class="post__right">
      <div class="post-other">
        yudskghgsdjkgfjhgs djfgsajhhgf gsdjgf jhsgd sdh fgsd jdasfg sdgghf
        sghjadgsdaf jgjshadg fdghjk f sjdgfajg sdgaj jsadgj gfjsdag jgjsadgj
        gjfhgsdjh fjhgsdaj gjhsdgf gjsdga fsdfgjasgs kgasd fjhsgd
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref, markRaw, defineProps, onMounted, onUnmounted } from "vue";
import { readToDB } from "@/server/index";
import { query, where } from "firebase/firestore";
import { postsRef } from "@/server/firebase.config";
import AkarIconsVkFill from "~icons/akar-icons/vk-fill";
import MdiOkRu from '~icons/mdi/ok-ru';

const post = ref();
const loadingPost = ref(false);
const errorPost = ref();
const route = useRoute();
const currentUrl = window.location.href;

const links = markRaw([
  {
    icon: AkarIconsVkFill,
    link: `https://vk.com/share.php?url=${currentUrl}`,
  },
  {
    icon: MdiOkRu,
    link: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${currentUrl}`
  }
]);

onMounted(() => {
  getPost();
});

const getPost = async () => {
  loadingPost.value = true;
  errorPost.value = null;
  try {
    const querySnapshot = await readToDB(
      query(postsRef, where("slug", "==", route.params.name))
    );
    post.value = querySnapshot.docs[0].data();
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    errorPost.value = stringToObject;
  } finally {
    loadingPost.value = false;
  }
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
</script>

<style lang="scss" scoped>
.post {
  color: $white;
  display: grid;
  grid-template-columns: 640px auto;
  column-gap: 20px;
}

.post-block {
  padding: 10px 15px;
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
  }
}
</style>
