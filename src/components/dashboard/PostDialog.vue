<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '500px' }"
    :modal="true"
    maximizable
    :pt="{
      ...getClasses('dashboard').dialog,
      root: {
        class: [
          'dashboard-dialog',
          !uiStore.xsAndLarger ? 'p-dialog-maximized' : '',
        ],
      },
    }"
    ref="dialogPost"
    @hide="resetForm"
  >
    <template #container="{ closeCallback, maximizeCallback }">
      <div class="dashboard-dialog-container">
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">{{
            $t("post-dialog.title")
          }}</span>
          <div class="dashboard-dialog-header-actions">
            <button v-if="uiStore.xsAndLarger" @click="maximizeCallback">
              <i-tabler:window-maximize v-if="!dialogPost?.maximized" />
              <i-tabler:window-minimize v-else />
            </button>
            <button @click="requireConfirmation($event)">
              <i-ic:round-close />
            </button>
          </div>
        </div>
        <div class="post-dialog__content">
          <div class="post-dialog__block">
            <p class="post-dialog-label">
              {{ $t("post-dialog.labels.image") }}
            </p>
            <ImageUpload
              v-model:image="image"
              v-model:file="file"
              :id="post.id"
              :path="'images/posts/'"
              :class="{ 'is-invalid': errors.image }"
            />
            <transition name="fade">
              <small v-if="errors.image" class="error">{{
                $t(`validation.${errors.image?.key || errors.image}`, {
                  ...errors.image?.values,
                })
              }}</small>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label class="post-dialog-label" for="name">{{
              $t("post-dialog.labels.name")
            }}</label>
            <IconField :pt="getClasses('post-dialog').iconfield" unstyled>
              <InputText
                id="name"
                v-model.trim="name"
                required="true"
                autofocus
                :invalid="errors.name ? true : false"
                :pt="getClasses('post-dialog').inputtext"
                :placeholder="$t('placeholders.post-name')"
                @paste="(event) => replaceSpaces(event, 'name')"
              />
              <InputIcon
                v-if="name"
                @click="resetField('name')"
                :pt="getClasses('post-dialog').inputicon"
                unstyled
                ><i-majesticons:close
              /></InputIcon>
              <transition name="fade">
                <small v-if="errors.name" class="error">{{
                  $t(`validation.${errors.name?.key || errors.name}`, {
                    ...errors.name?.values,
                  })
                }}</small>
              </transition>
            </IconField>
          </div>

          <div class="post-dialog__block">
            <label for="description" class="post-dialog-label">{{
              $t("post-dialog.labels.description")
            }}</label>

            <Description
              v-model:description="description"
              v-model:length="lengthDescription"
              :class="{ 'is-invalid': errors.lengthDescription }"
            />
            <transition name="fade">
              <small v-if="errors.lengthDescription" class="error">{{
                $t(
                  `validation.${
                    errors.lengthDescription?.key || errors.lengthDescription
                  }`,
                  {
                    ...errors.lengthDescription?.values,
                  }
                )
              }}</small>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label class="post-dialog-label" for="summary">{{
              $t("post-dialog.labels.summary")
            }}</label>
            <IconField :pt="getClasses('post-dialog').iconfield" unstyled>
              <InputText
                id="summary"
                v-model.trim="summary"
                required="true"
                :invalid="errors.summary ? true : false"
                :pt="getClasses('post-dialog').inputtext"
                :placeholder="$t('placeholders.summary')"
                @paste="(event) => replaceSpaces(event, 'summary')"
              />
              <InputIcon
                v-if="summary"
                @click="resetField('summary')"
                :pt="getClasses('post-dialog').inputicon"
                unstyled
                ><i-majesticons:close
              /></InputIcon>
              <transition name="fade">
                <small v-if="errors.summary" class="error">{{
                  $t(`validation.${errors.summary?.key || errors.summary}`, {
                    ...errors.summary?.values,
                  })
                }}</small>
              </transition>
            </IconField>
          </div>

          <div class="post-dialog__block">
            <span class="post-dialog-label">{{
              $t("post-dialog.labels.category")
            }}</span>
            <div class="post-dialog__radios">
              <div
                v-for="(item, index) of staticStore.categories"
                :key="index"
                class="post-dialog__radios-item"
              >
                <RadioButton
                  :inputId="`category${index}`"
                  v-model="category"
                  name="category"
                  :value="item"
                  :pt="getClasses('post-dialog').radiobutton"
                  unstyled
                  :class="{ 'is-invalid': errors.category }"
                />
                <label
                  class="post-dialog__radios-text"
                  :for="`category${index}`"
                  >{{ uppercaseFirst($t(`categores.options.${item}`)) }}</label
                >
              </div>
            </div>
            <transition>
              <p class="error" v-if="errors.category">
                {{
                  $t(`validation.${errors.category?.key || errors.category}`, {
                    ...errors.category?.values,
                  })
                }}
              </p>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label for="price" class="post-dialog-label">{{
              $t("post-dialog.labels.tags")
            }}</label>
            <Tags
              v-model="tags"
              :limit-tags="5"
              :placeholder="$t('placeholders.tags')"
              classSelect="post-dialog-tags"
              :class="{ 'is-invalid': errors.tags }"
            />
            <transition name="fade">
              <small v-if="errors.tags" class="error">
                {{
                  $t(`validation.${errors.tags?.key || errors.tags}`, {
                    ...errors.tags?.values,
                  })
                }}
              </small>
            </transition>
          </div>
        </div>

        <div class="dashboard-dialog-footer">
          <Button
            text
            @click="requireConfirmation($event)"
            :pt="getClasses('no').button"
            unstyled
            ><i-iconoir:cancel />{{ $t("buttons.cancel") }}</Button
          >
          <Button
            @click="onSubmit"
            :pt="getClasses('yes').button"
            :disabled="loading"
            unstyled
            ><i-ic:round-check />{{ $t("buttons.save") }}</Button
          >
        </div>
      </div>
    </template>
  </Dialog>

  <Teleport to="body">
    <transition>
      <Spinner
        v-if="loading"
        style="border-radius: 0; position: fixed; z-index: 1600"
        size="50"
      />
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineModel, watch, markRaw, inject } from "vue";
import { getClasses } from "@/utils/classes";
import { areArraysEqual, uppercaseFirst, translitForUrl } from "@/utils/index";
import { deleteImage, uploadImage } from "@/server/storage";
import { writeToDB, updateToDB } from "@/server/posts";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useForm, useField } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { v4 as uuidv4 } from "uuid";
import { useServerStore } from "@/stores/server";
import { useStaticStore } from "@/stores/static";
import IonWarningOutline from "~icons/ion/warning-outline";
import { ability } from "@/services/ability";
import { useUiStore } from "../../stores/ui";

const serverStore = useServerStore();
const rulesStore = useRulesStore();
const staticStore = useStaticStore();
const uiStore = useUiStore();
const toast = useToast();
const confirm = useConfirm();

const t = inject("t");
const visible = defineModel("visible");
const props = defineProps({
  post: Object,
});

const emits = defineEmits(["upload", "edit"]);

const dialogPost = ref();
const file = ref();
const description = ref();
const loading = ref(false);

// validate
const {
  defineField,
  resetForm,
  handleSubmit,
  errors,
  validate,
  values,
  setFieldValue,
  resetField,
} = useForm({
  validationSchema: rulesStore.schemaPostDialog,
});

const [image] = defineField("image", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [name] = defineField("name", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [lengthDescription] = defineField("lengthDescription", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [category] = defineField("category", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [tags] = defineField("tags", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});
const [summary] = defineField("summary", (state) => {
  return {
    validateOnModelUpdate: state.errors.length > 0,
  };
});

const onSubmit = handleSubmit((value) => {
  savePost();
});

// default values
watch(
  () => props.post,
  (post) => {
    file.value = null;
    resetForm({
      values: {
        image: post.image,
        name: post.name,
        category: post.category,
        tags: post.tags ? [...post.tags] : [],
        summary: post.summary,
      },
    });
    description.value = post.description;
  }
);

const savePost = () => {
  // edit
  if (props.post.id && ability.can("update", "Post")) {
    saveEditedPost();
  }
  // new
  if (!props.post.id && ability.can("create", "Post")) {
    saveNewPost();
  }
};

const saveEditedPost = async () => {
  loading.value = true;
  let success = false;
  let updatedPost = {};

  if (props.post.name !== values.name) {
    updatedPost.name = values.name;
    updatedPost.slug = translitForUrl(values.name);
  }
  const objectToString = JSON.stringify(description.value);
  if (props.post.description !== objectToString) {
    updatedPost.description = objectToString;
  }
  if (props.post.category !== values.category) {
    updatedPost.category = values.category;
  }
  if (props.post.description !== objectToString) {
    updatedPost.time = getTimeReading();
  }
  if (props.post.summary !== values.summary) {
    updatedPost.summary = values.summary;
  }
  if (!areArraysEqual(props.post.tags, values.tags)) {
    updatedPost.tags = values.tags;
  }
  if (props.post.image !== values.image) {
    updatedPost.image = values.image;
  }
  updatedPost.date = new Date().getTime();

  try {
    if (file.value) {
      await uploadImage(image.value, file.value, "images/posts/");
    }

    await updateToDB(props.post.id, updatedPost);
    success = true;

    if (file.value) {
      await deleteImage(props.post.image, "images/posts/");
    }
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    // если ошибка возникла при загрузке изображения или записи данных (пост не сохранен)
    if (
      stringToObject.operation === "upload" ||
      stringToObject.operation === "update"
    ) {
      toast.add({
        severity: "error",
        summary: t("errors.post.edit"),
        detail: `${t(`errors.process.${stringToObject.process}`)} ${t(
          `error_codes.${stringToObject.description}`
        )}`,
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: t("errors.image.delete"),
        detail: `${t(`errors.process.${stringToObject.process}`)} ${t(
          `error_codes.${stringToObject.description}`
        )}`,
        life: 5000,
      });
    }
  } finally {
    // если загружено изображение и записаны данные в бд (необязательно - удалено старое изображено)
    if (success) {
      emits("edit", { id: props.post.id, ...updatedPost });

      // удаление url на картинку для данного поста
      serverStore.setUrl(props.post.id, null);

      toast.add({
        severity: "success",
        summary: t("success.post.summary"),
        detail: t("success.post.edit"),
        life: 5000,
      });
      visible.value = false;
    }
    loading.value = false;
  }
};

const saveNewPost = async () => {
  const id = uuidv4();
  const objectToString = JSON.stringify(description.value);

  const newPost = {
    id: id,
    name: values.name,
    slug: translitForUrl(values.name),
    description: objectToString,
    summary: values.summary,
    image: values.image,
    category: values.category,
    date: new Date().getTime(),
    time: getTimeReading(),
    tags: values.tags,
    rating: 0,
  };

  loading.value = true;
  try {
    await uploadImage(image.value, file.value, "images/posts/");
    await writeToDB(id, newPost);

    emits("upload", newPost);

    toast.add({
      severity: "success",
      summary: t("success.post.summary"),
      detail: t("success.post.create"),
      life: 5000,
    });
    visible.value = false;
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    toast.add({
      severity: "error",
      summary: t("errors.post.create"),
      detail: `${t(`errors.process.${stringToObject.process}`)} ${t(
        `error_codes.${stringToObject.description}`
      )}`,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const requireConfirmation = (event) => {
  const confirmInfo = markRaw({
    target: event.currentTarget,
    group: "headless",
    message: t("confirm.message"),
    rejectLabel: t("buttons.cancel"),
    acceptLabel: t("buttons.ok"),
    icon: IonWarningOutline,
    colorIcon: "var(--yellow-2)",
    accept: () => {
      hideDialog();
    },
  });
  confirm.require(confirmInfo);
};

const hideDialog = () => {
  visible.value = false;
};

const getTimeReading = () => {
  const symbolsToMinute = 1300;
  const minutes = lengthDescription.value / symbolsToMinute;
  return Math.round(minutes * 10) / 10;
};

const replaceSpaces = (event, field) => {
  event.preventDefault();
  const paste = event.clipboardData.getData("text");
  const formattedPaste = paste.replace(/\u00A0/g, " ");
  setFieldValue(field, formattedPaste, false);
};
</script>

<style lang="scss" scoped>
@include PostDialog();
.post-dialog {
  &__block {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    position: relative;
  }
  &-label {
    font-weight: 500;
    margin-bottom: 10px;
    line-height: 1;
    font-size: 14px;
    color: var(--white);
  }
  &-small {
  }
  &__radios {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
  }
  &__radios-item {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &__radios-text {
    font-size: 14px;
    line-height: 1;
    color: var(--grey-100);
  }
  &__inputs {
    display: flex;
  }
  &-inputtext {
    width: 100%;
    padding-right: 35px;
    background-color: var(--grey-960);
    color: var(--white);

    &::placeholder {
      font-size: 14px;
      color: var(--placeholder-filter);
    }
    &:not(.p-invalid):enabled:focus {
      @include Focus();
    }
    &.p-invalid {
      @include Invalid();
    }
  }
  &-iconfield {
    width: 100%;
    position: relative;
  }
  &-inputicon {
    display: flex;
    margin-top: 0;
    transform: translateY(-50%);
    right: 10px;
    position: absolute;
    top: 50%;
    color: var(--grey-100);
    cursor: pointer;
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
    color: var(--black);
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
  background-color: var(--grey-900);
  color: var(--grey-50);
  &:not(:disabled):hover {
    background-color: var(--cancel-hover);
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
</style>

<style lang="scss">
.post-dialog-tags.select-wrapper {
  z-index: 1500;
}
</style>
