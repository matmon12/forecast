 <template>
  <div
    :class="['post', { 'category__item-gorizont': orientation === 'gorizont' }]"
  >
    <div class="post-imgwrap">
      <img class="post-img" :src="img" alt="post" />
      <div
        class="post-img-mask"
        :style="{
          backgroundImage: `linear-gradient(to ${
            orientation === 'gorizont' ? 'right' : 'top'
          }, ${colorBack} 0%, rgba(0, 0, 0, 0) 100%)`,
        }"
      ></div>
    </div>
    <div class="post-text-wrap" :style="{ backgroundColor: colorBack }">
      <div class="post-text">
        {{ text }}
      </div>
      <div class="post-subtext">{{ text.match(firstSentence)[0] }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from "vue";
import analyze from "rgbaster";

const firstSentence = /^(.*?[?!.])(?=\s*[A-ZА-ЯЁ]|$)/s;

const text = ref(
  "Как машины получают названия? Интересные факты появления имён. Интересные факты появления имён.Интересные факты появления имён"
);
const img = ref(
  "https://news-ru.gismeteo.st/2024/06/shutterstock_1171672813-365x250.jpg"
);
const colorBack = ref("#000");

const props = defineProps({
  orientation: String,
});

const getColorDominant = async () => {
  await analyze(img.value, { scale: 0.6 }).then((res) => {
    colorBack.value = res[0].color;
  });
};

onMounted(() => {
  getColorDominant();
});
</script>

<style lang="scss" scoped>
.post {
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(94, 94, 94);
  cursor: pointer;
  transition: box-shadow .3s;
  &:hover {
    box-shadow: 0 0 15px 2px rgba(255, 255, 255, 0.537);
    .post-text {
      filter: brightness(0.8);
    }
  }
}

.category__item-gorizont {
  flex-direction: row;
  .post-imgwrap {
    height: 100%;
    min-width: 60%;
    order: 1;
  }
  .post-img-mask {
    left: 0;
    height: 100%;
    width: 125 px;
  }
  .post-text {
    @include TextOverflow(5);

    &-wrap {
      padding: 15px 0 15px 15px;
    }
  }
  .post-subtext {
    display: block;
  }
}

.post-imgwrap {
  height: 60%;
  position: relative;
}
.post-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.post-img-mask {
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 65px;

}
.post-text {
  line-height: 1.3;
  font-size: 16px;
  transition: filter 0.3s;
  @include TextOverflow(4);

  &-wrap {
    padding: 0 15px 15px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    // justify-content: flex-end;
  }
}
.post-subtext {
  color: #9d9d9d;
  font-size: 14px;
  margin-top: 10px;
  line-height: 1.2;
  display: none;
}
</style>
