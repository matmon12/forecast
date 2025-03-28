<template>
  <div
    :class="['card', { 'category__item-gorizont': orientation === 'gorizont' }]"
  >
    <div class="card-imgwrap">
      <img
        v-if="!loadingImage && !errorImage"
        class="card-img"
        :src="serverStore.urls[id]"
        alt="card"
      />
      <div
        class="card-img-mask"
        :style="{
          '--colorGradient': colorBack,
          background: `linear-gradient(to ${
            orientation === 'gorizont' ? 'right' : 'top'
          }, var(--colorGradient) 0%, rgba(0, 0, 0, 0) 100%)`,
        }"
      ></div>

      <i-ph:image v-if="errorImage" class="card-error" />
    </div>
    <div
      :class="['card-text-wrap', { 'card-text-black': colorText === '#000' }]"
      :style="{ backgroundColor: colorBack, color: colorText }"
    >
      <div class="card-text">
        {{ title }}
      </div>
      <div class="card-subtext">{{ summary }}</div>
    </div>

    <Skeleton
      v-if="loadingImage"
      class="card-skeleton"
      style="position: absolute; height: 100%; width: 100%"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import analyze from "rgbaster";
import { loadImage } from "@/server/storage";
import { useServerStore } from "@/stores/server";
import { getLuminance } from "@/utils/index";

const firstSentence = /^(.*?[?!.])(?=\s*[A-ZА-ЯЁ]|$)/s;
const loadingImage = ref(false);
const errorImage = ref();
const colorBack = ref("var(--black-2)");
const colorText = ref("#fff");
const serverStore = useServerStore();

const props = defineProps({
  orientation: String,
  title: String,
  image: String,
  id: String,
  summary: String,
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

const getColorDominant = async () => {
  const colorDominant = await analyze(serverStore.urls[props.id], {
    scale: 0.6,
  });
  return colorDominant[900].color;
};

const setTextColor = (color) => {
  const luminance = getLuminance(color);

  if (luminance < 150) {
    return "#fff"; // Темный фон
  } else {
    return "#000"; // Светлый фон
  }
};

const getDataPost = async () => {
  if (!serverStore.urls[props.id]) {
    await getImageUrl();
  }
  colorBack.value = await getColorDominant();
  colorText.value = setTextColor(colorBack.value);
};

onMounted(() => {
  getDataPost();
});
</script>

<style lang="scss" scoped>
@include PostCard();
@property --colorGradient {
  syntax: "<color>";
  initial-value: #000;
  inherits: false;
}

.card {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--white-5);
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
  position: relative;
  box-shadow: 0 0 10px 1px var(--boxshadow--card);

  &:hover {
    box-shadow: 0 0 15px 2px var(--boxshadow--card);
    transform: translateY(-5px);
  }
}

.category__item-gorizont {
  flex-direction: row;
  grid-column: span 2;

  .card-imgwrap {
    height: 100%;
    order: 1;
    flex-grow: 1;
  }
  .card-img-mask {
    left: 0;
    bottom: 0;
    height: 100%;
    width: 125px;
  }
  .card-text {
    @include TextOverflow(5);

    &-wrap {
      padding: 15px 0 15px 15px;
      min-width: 40%;
      width: 40%;
    }
  }
  .card-subtext {
    display: block;
    @include TextOverflow(5);
  }
}

.card-imgwrap {
  height: 60%;
  position: relative;
}
.card-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.card-img-mask {
  position: absolute;
  width: 100%;
  bottom: -1px;
  height: 65px;
  transition: --colorGradient 1s;
}
.card-text {
  line-height: 1.3;
  font-size: 16px;
  transition: filter 0.3s;
  @include TextOverflow(4);

  &-wrap {
    font-weight: 400;
    padding: 0 15px 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    transition: background-color 1s;
  }

  &-black {
    font-weight: 500;
  }
}
.card-subtext {
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.3;
  opacity: 0.7;
  display: none;
}
.card-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
}
.card-skeleton {
  left: 0;
  top: 0;
  z-index: -1;
  background-color: var(--skeleton-back);
  &::after {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      var(--skeleton-animation),
      rgba(255, 255, 255, 0)
    );
  }
}
.card-error {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  color: var(--grey-330);
}
</style>
