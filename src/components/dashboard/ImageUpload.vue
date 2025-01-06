<template>
  <div class="uploader">
    <div class="uploader__wrapper" v-if="image && !file">
      <Image :name="image" :id="id" :path="path" preview>
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
              <h6 class="error-message-title">
                {{ $t(`errors.process.${error?.process}`) }}
              </h6>
              <p class="error-message-desc">
                {{ $t(`error_codes.${error?.description}`) }}
              </p>
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
      :invalidFileSizeMessage="JSON.stringify(invalidFileSizeMessage)"
      :invalidFileTypeMessage="JSON.stringify(invalidFileTypeMessage)"
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
              {{ $t("buttons.choose") }}
            </Button>
            <Button
              @click="clearCallback()"
              :disabled="!files || files.length === 0"
              :pt="getClasses('no').button"
              unstyled
              ><i-ic:round-close />
              {{ $t("buttons.cancel") }}
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
              <Image :name="file.name" :url="file.objectURL" preview />
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
          ><i-codicon:error />
          <p class="error-message-info">
            <span class="error-message-name"
              >{{ JSON.parse(item).name }}:
            </span>
            {{ t(`errors.image-upload.${JSON.parse(item).text}`) }}
            {{ JSON.parse(item)?.size }}
          </p>
        </Message>

        <div
          class="dashboard-fileupload-empty"
          v-if="
            (!messages || messages.length === 0) &&
            (!files || files.length === 0)
          "
        >
          <i-ion:cloud-upload-outline />
          <p class="uploader__empty-text">
            {{ $t("image-upload.empty") }}
          </p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import { ref, defineModel, watch, inject } from "vue";
import { usePrimeVue } from "primevue/config";
import { getClasses } from "@/utils/classes";
import { computed } from "vue";

const t = inject("t");
const $primevue = usePrimeVue();
const image = defineModel("image");
const file = defineModel("file");
const fileupload = ref();
const invalidFileSizeMessage = computed(() => ({
  name: "{0}",
  text: "file-size",
  size: "{1}",
}));
const invalidFileTypeMessage = computed(() => ({
  name: "{0}",
  text: "file-type",
}));

const props = defineProps({
  id: String,
  path: String,
});

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

// для очистки из родительского компонента
watch(
  () => file.value,
  (newValue) => {
    if (!newValue && !image.value && fileupload.value) {
      fileupload.value.remove();
    }
  }
);
</script>

<style lang="scss" scoped>
@include ImageUpload();
.uploader {
  border-radius: 6px;
  transition: box-shadow 0.3s, border-color 0.3s;
  &__wrapper {
    position: relative;
    height: 200px;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    border: 2px dashed var(--grey-360);
    background-color: var(--modal);
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
    color: var(--grey-330);
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
  &.is-invalid {
    .dashboard-fileupload {
      @include Invalid();
    }
  }
}

// btns
.no,
.yes {
  &-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 1;
    border-radius: 7px;
    padding: 0 10px;
    color: var(--black-3);
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s, filter 0.3s;
    height: 35px;
  }
}
.yes-btn {
  background-color: var(--blue-360);
  &:not(:disabled):hover {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.no-btn {
  background-color: var(--grey-880);
  color: var(--grey-50);
  &:not(:disabled):hover {
    filter: brightness(var(--brightness-rating));
    background-color: var(--grey-880);
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
</style>

<style lang="scss">
@include ImageUpload();
.dashboard {
  &-fileupload {
    border-radius: inherit;
    transition: all 0.3s;
    background-color: var(--modal-2);
    color: var(--white);

    &-input {
    }
    &-header {
      padding: 15px;
    }
    &-content {
      height: 200px;
      margin: 0 15px 15px;
      border: 2px dashed var(--blue-2);
      border-radius: 10px;
      padding: 10px;
      overflow-y: auto;
      @include Scroll(10px, 10px, #333333, #7d7d7d);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.3s;
      background-color: var(--transparent-4);

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
    border: 1px solid var(--red-600);
    border-left: 4px solid var(--red-500);
    outline: none;
    background-color: var(--toast-error);

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
      color: var(--red-160);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      overflow: hidden;
      svg {
        min-width: 25px;
        color: #ff2b2b;
      }
    }
    &-info {
      max-width: 100%;
      overflow: hidden;
    }
    &-name {
      @include TextOverflow(1);
      overflow-wrap: break-word;
    }
    &-close-button {
      width: var(--p-message-close-button-width);
      height: var(--p-message-close-button-height);
      &:hover {
        background-color: var(--white-1);
      }
    }
    &-close-icon {
      width: 12px;
      color: #f85353;
    }
  }
}
</style>
