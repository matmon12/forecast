<template>
  <div class="picture__container">
    <Skeleton v-if="loading" height="100%" class="picture-skeleton" />
    <div v-else class="picture__content">
      <Image
        v-if="!error"
        :alt="name"
        :preview="preview"
        :pt="{
          ...getClasses('picture').image,
        }"
      >
        <template #previewicon>
          <i-ion:search />
        </template>
        <template #image>
          <img
            class="picture-image-img"
            :src="serverStore.urls[id] || url"
            :alt="name"
          />
        </template>
        <template #preview="slotProps">
          <img
            class="picture-image-original"
            :src="serverStore.urls[id] || url"
            :alt="name"
            :style="slotProps.style"
            @click="slotProps.onClick"
          />
        </template>
      </Image>

      <slot v-else name="error" :error="error">
        <div class="picture-error"><i-ion:image-outline /></div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import Skeleton from "primevue/skeleton";
import { defineProps, onMounted, ref, watch } from "vue";
import { getClasses } from "@/utils/classes";
import Image from "primevue/image";
import { useServerStore } from "@/stores/server";
import { loadImage } from "@/server/storage";

const serverStore = useServerStore();
const loading = ref(false);
const error = ref();

const props = defineProps({
  id: String,
  name: String,
  url: String,
  path: String,
  preview: Boolean,
});

onMounted(() => {
  if (props.id && !serverStore.urls[props.id]) {
    getImage(props.name, props.path);
  }
});

watch(
  () => serverStore.urls[props.id],
  (newValue) => {
    if (!newValue) {
      getImage(props.name, props.path);
    }
  }
);

const getImage = (name, path) => {
  loading.value = true;
  error.value = null;
  loadImage(name, path)
    .then((url) => {
      serverStore.setUrl(props.id, url);
    })
    .catch((err) => {
      error.value = JSON.parse(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<style lang="scss" scoped>
.picture {
  &__container {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
  }
  &__content {
    width: 100%;
    height: 100%;
  }
}
</style>

<style lang="scss">
// picture image
.picture {
  &-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    &:hover > .picture-image-preview-mask {
      background: var(--mask);
    }

    &-img {
      max-height: 100%;
      object-fit: contain;
      border-radius: 5px;
      overflow: hidden;
    }
    &-toolbar {
      padding: 5px 10px;
      background: #ffffff3b;
      border-radius: 10px;
      align-items: center;
      gap: 5px;
    }
    &-mask {
      z-index: 1500 !important;
      .p-image-action {
        width: 40px;
        height: 40px;
        svg {
          width: 50%;
        }
      }
    }
    &-original-container {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-original {
      max-height: 100%;
      max-width: 100%;
    }
  }
  &-skeleton {
    z-index: 100;
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
  &-error {
    background-color: var(--grey-1010);
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    svg {
      color: #626262;
      font-size: 20px;
    }
  }
}
</style>
