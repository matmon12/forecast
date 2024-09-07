<template>
  <div class="uploader">
    <div class="uploader__wrapper" v-if="image && !file">
      <Image
        :name="image"
        :url="url"
        :loading="loadingImage"
        :error="errorImage"
      >
        <template #error="{ error }">
          <Message
            severity="error"
            :pt="{
              ...getClasses('error').message,
              root: {
                class: ['error-message', 'error-message-offset'],
              },
            }"
            ><i-codicon:error />
            <div class="error-message-wrap">
              <h6 class="error-message-title">{{ error?.process }}</h6>
              <p class="error-message-desc">{{ error?.description }}</p>
            </div>
          </Message>
        </template>
      </Image>
      <Button
        :pt="getClasses('yes').button"
        class="uploader-remove-img"
        unstyled
        @click="deleteImage"
        ><i-fluent:delete-32-regular
      /></Button>
    </div>

    <FileUpload
      v-else
      ref="fileupload"
      name="demo[]"
      @select="(e) => selectImage(e)"
      @clear="deleteImage"
      @remove="deleteImage"
      accept="image/*"
      :maxFileSize="1000000"
      :fileLimit="1"
      invalidFileSizeMessage="{0}: file size should be smaller than {1}"
      invalidFileTypeMessage="{0}: Invalid file type."
      :disabled="fileupload?.files.length >= fileupload?.fileLimit"
      :pt="{
        ...getClasses('dashboard').fileupload,
        content: {
          class: [
            fileupload?.messages && fileupload?.messages.length > 0
              ? 'is-invalid'
              : '',
            fileupload?.disabled ? 'is-disabled' : '',
            'dashboard-fileupload-content',
          ],
        },
      }"
    >
      <template
        #header="{ chooseCallback, uploadCallback, clearCallback, files }"
      >
        <div class="uploader__haeder">
          <div class="uploader__btns">
            <Button
              @click="chooseCallback()"
              :pt="getClasses('yes').button"
              unstyled
              :disabled="fileupload?.files.length >= fileupload?.fileLimit"
              ><i-ph:images />
              Choose
            </Button>
            <Button
              @click="clearCallback()"
              :disabled="!files || files.length === 0"
              :pt="getClasses('no').button"
              unstyled
              ><i-ic:round-close />
              Cancel
            </Button>
          </div>
        </div>
      </template>

      <template
        #content="{
          files,
          removeFileCallback,
          removeUploadedFileCallback,
          messages,
        }"
      >
        <div class="uploader__items" v-if="files.length > 0">
          <div
            class="uploader__item"
            v-for="(file, index) of files"
            :key="file.name + file.type + file.size"
          >
            <div class="uploader__item-img">
              <Image :name="file.name" :url="file.objectURL" />
            </div>
            <div class="uploader__item-content">
              <span class="uploader__item-name">{{ file.name }}</span>
              <div class="uploader__item-size">
                {{ formatSize(file.size) }}
              </div>
            </div>
            <Button @click="removeFileCallback(index)" severity="danger">
              <i-majesticons:close-line />
            </Button>
          </div>
        </div>

        <Message
          v-for="(item, index) of messages"
          :key="index"
          severity="error"
          :pt="getClasses('error').message"
          closable
          @close="fileupload.onMessageClose()"
          ><i-codicon:error />{{ item }}</Message
        >

        <div
          class="dashboard-fileupload-empty"
          v-if="
            (!messages || messages.length === 0) &&
            (!files || files.length === 0)
          "
        >
          <i-ion:cloud-upload-outline />
          <p class="uploader__empty-text">
            Drag and drop files to here to upload.
          </p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import { ref, defineModel, onMounted } from "vue";
import { usePrimeVue } from "primevue/config";
import { getClasses } from "@/utils/classes";
import { loadImage } from "@/server/index";

const $primevue = usePrimeVue();
const image = defineModel("image");
const file = defineModel("file");
const fileupload = ref();
const loadingImage = ref(false);
const errorImage = ref();
const url = ref();

onMounted(() => {
  if(image.value) {
    getImage();
  }
});

const getImage = () => {
  errorImage.value = null;
  loadingImage.value = true;
  loadImage(image.value)
    .then((data) => {
      url.value = data;
    })
    .catch((err) => {
      errorImage.value = JSON.parse(err.message);
    })
    .finally(() => {
      loadingImage.value = false;
    });
};

const formatSize = (bytes) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};

const deleteImage = () => {
  // "предварительное" удаление, реальное - при сохранении
  image.value = null;
  file.value = null;
};

const selectImage = (e) => {
  image.value = e.files[0]?.name;
  file.value = e.files[0];
};
</script>

<style lang="scss" scoped>
.uploader {
  border-radius: 6px;
  transition: box-shadow 0.3s, border-color 0.3s;
  &__wrapper {
    position: relative;
    height: 200px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    border: 2px dashed #777777;
    background-color: #18181b;
  }
  &-remove-img {
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 10;
  }
  &__btns {
    display: flex;
    gap: 10px;
  }
  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  &__item {
    border: 1px solid #4c4c4c;
    width: 100%;
    height: 120px;
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &__item-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100px;
  }
  &__item-name {
    @include TextOverflow(1);
    font-weight: 600;
    font-size: 16px;
  }
  &__item-size {
    font-size: 14px;
    color: #979797;
  }
  &__empty-text {
    line-height: 1;
  }
  &__item-btn {
    width: 27px;
    height: 27px;
    background-color: #ff7171;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      height: min-content;
      width: min-content;
    }
  }
  &__item-img {
    max-width: 120px;
    width: fit-content;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
.dashboard {
  &-fileupload {
    border-radius: inherit;
    &-input {
    }
    &-header {
      padding: 15px;
    }
    &-content {
      height: 200px;
      margin: 0 15px 15px;
      border: 2px dashed #6b99c6;
      border-radius: 10px;
      padding: 10px;
      overflow-y: auto;
      @include Scroll(10px, 10px, #333333, #7d7d7d);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.3s;

      &.is-invalid {
        border-color: #ff8686;
      }
      &.is-disabled {
        border-color: #4d4d4d;
      }
      &.p-fileupload-highlight {
        border-color: #fff;
      }
    }
    &-progressbar {
    }
    &-message {
    }
    &-file {
    }
    &-file-thumbnail {
    }
    &-empty {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      svg {
        font-size: 40px;
      }
    }
    &-messages {
    }
    &-button {
    }
  }
}

// message error
.error {
  &-message {
    border: 1px solid #920000;
    border-left: 4px solid #b80202;
    outline: none;
    &-offset {
      margin: 10px;
    }
    &-content {
      padding: 5px 5px;
    }
    &-title {
      font-weight: 600;
      color: #ff2b2b;
      font-size: 14px;
    }
    &-icon {
    }
    &-text {
      color: #ff7f7f;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      svg {
        min-width: 25px;
        color: #ff2b2b;
      }
    }
    &-close-button {
      width: var(--p-message-close-button-width);
      height: var(--p-message-close-button-height);
    }
    &-close-icon {
      width: 12px;
      color: #f85353;
    }
  }
}
</style>
