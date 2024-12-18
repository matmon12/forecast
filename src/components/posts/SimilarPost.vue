<template>
  <div class="similar-post__wrapper">
    <div class="similar-post__content">
      <div class="similar-post__imgwrap">
        <img
          v-if="!loadingImage && !errorImage"
          class="similar-post__img"
          :src="serverStore.urls[id]"
          alt="post"
        />
        <i-ph:image v-if="errorImage" class="similar-post-error" />
        <Skeleton v-else height="100%" />
      </div>
      <div class="similar-post__text">
        <h4 class="similar-post__title">
          {{ title }}
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import { useServerStore } from "@/stores/server";
import { loadImage } from "@/server/storage";

const serverStore = useServerStore();

const loadingImage = ref(false);
const errorImage = ref();

const props = defineProps({
  title: String,
  image: String,
  id: String,
});

const getImageUrl = async () => {
  loadingImage.value = true;
  errorImage.value = null;
  try {
    const urlImage = await loadImage(props.image, "images/posts/");
    serverStore.setUrl(props.id, urlImage);
  } catch (error) {
    errorImage.value = JSON.parse(error.message);
  } finally {
    loadingImage.value = false;
  }
};

onMounted(() => {
  if (!serverStore.urls[props.id]) {
    getImageUrl();
  }
});

watch(
  () => props.id,
  (newValue) => {
    if (!serverStore.urls[props.id]) {
      getImageUrl();
    }
  }
);
</script>

<style lang="scss" scoped>
@include SimilarPost();
.similar-post__wrapper {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}
.similar-post__content {
  background-color: var(--grey-850);
  height: 100%;
  display: flex;
  gap: 15px;
  padding: 10px;
  transition: filter 0.2s;
  cursor: pointer;

  &:hover {
    filter: brightness(var(--brightness-rating));
  }
}
.similar-post__imgwrap {
  height: 100%;
  min-width: 120px;
  width: 120px;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px #0000006e;
  position: relative;
  background-color: var(--grey-900);
}
.similar-post__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.similar-post__text {
  font-size: 14px;
  flex-grow: 1;
}
.similar-post__title {
  @include TextOverflow(3);
}

.similar-post__skeleton-texts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.similar-post__skeleton-text {
  border-radius: 4px;
}
.p-skeleton {
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

.similar-post-error {
  font-size: 24px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
