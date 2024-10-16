<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '500px' }"
    :modal="true"
    maximizable
    :pt="getClasses('dashboard').dialog"
    ref="dialogPost"
    @hide="resetForm"
  >
    <template #container="{ closeCallback, maximizeCallback }">
      <div class="dashboard-dialog-container">
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">Confirm</span>
          <div class="dashboard-dialog-header-actions">
            <button @click="maximizeCallback">
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
            <p class="post-dialog-label">Upload image</p>
            <ImageUpload
              v-model:image="image"
              v-model:file="file"
              :id="post.id"
              :class="{ 'is-invalid': errors.image }"
            />
            <transition name="fade">
              <small v-if="errors.image" class="error">{{
                errors.image
              }}</small>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label class="post-dialog-label" for="name">Name</label>
            <IconField :pt="getClasses('post-dialog').iconfield" unstyled>
              <InputText
                id="name"
                v-model.trim="name"
                required="true"
                autofocus
                :invalid="errors.name ? true : false"
                :pt="getClasses('post-dialog').inputtext"
                placeholder="Enter name"
              />
              <InputIcon
                v-if="name"
                @click="name = null"
                :pt="getClasses('post-dialog').inputicon"
                unstyled
                ><i-majesticons:close
              /></InputIcon>
              <transition name="fade">
                <small v-if="errors.name" class="error">{{
                  errors.name
                }}</small>
              </transition>
            </IconField>
          </div>

          <div class="post-dialog__block">
            <label for="description" class="post-dialog-label"
              >Description</label
            >

            <Description
              v-model:description="description"
              v-model:length="lengthDescription"
              :class="{ 'is-invalid': errors.lengthDescription }"
            />
            <transition name="fade">
              <small v-if="errors.lengthDescription" class="error">{{
                errors.lengthDescription
              }}</small>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label class="post-dialog-label" for="summary">Summary</label>
            <IconField :pt="getClasses('post-dialog').iconfield" unstyled>
              <InputText
                id="summary"
                v-model.trim="summary"
                required="true"
                :invalid="errors.summary ? true : false"
                :pt="getClasses('post-dialog').inputtext"
                placeholder="Enter summary..."
              />
              <InputIcon
                v-if="summary"
                @click="summary = null"
                :pt="getClasses('post-dialog').inputicon"
                unstyled
                ><i-majesticons:close
              /></InputIcon>
              <transition name="fade">
                <small v-if="errors.summary" class="error">{{
                  errors.summary
                }}</small>
              </transition>
            </IconField>
          </div>

          <div class="post-dialog__block">
            <span class="post-dialog-label">Category</span>
            <div class="post-dialog__radios">
              <div
                v-for="(item, index) of categories"
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
                  >{{ uppercaseFirst(item) }}</label
                >
              </div>
            </div>
            <transition>
              <p class="error" v-if="errors.category">
                {{ errors.category }}
              </p>
            </transition>
          </div>

          <div class="post-dialog__block">
            <label for="price" class="post-dialog-label">Tags</label>
            <Tags
              v-model="tags"
              :limit-tags="5"
              placeholder="Select a tag..."
              :class="{ 'is-invalid': errors.tags }"
            />
            <transition name="fade">
              <small v-if="errors.tags" class="error">
                {{ errors.tags }}
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
            ><i-iconoir:cancel />Cancel</Button
          >
          <Button
            @click="onSubmit"
            :pt="getClasses('yes').button"
            :disabled="loading"
            unstyled
            ><i-ic:round-check />Save</Button
          >
        </div>
      </div>
    </template>
  </Dialog>

  <Teleport to="body">
    <transition>
      <Spinner
        v-if="loading"
        style="border-radius: 0; position: fixed"
        size="50"
      />
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineModel, watch } from "vue";
import { getClasses } from "@/utils/classes";
import { areArraysEqual, uppercaseFirst, translitForUrl } from "@/utils/index";
import {
  deleteImage,
  uploadImage,
  writeToDB,
  updateToDB,
} from "@/server/index";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useForm, useField } from "vee-validate";
import { useRulesStore } from "@/stores/rules";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { v4 as uuidv4 } from "uuid";
import { useServerStore } from "@/stores/server";

const serverStore = useServerStore();
const rulesStore = useRulesStore();
const toast = useToast();
const confirm = useConfirm();

const visible = defineModel("visible");
const props = defineProps({
  post: Object,
});

const emits = defineEmits(["upload", "edit"]);

const dialogPost = ref();
const file = ref();
const description = ref();
const loading = ref(false);
const categories = ref(["weather", "nature", "animals", "auto", "science"]);

// validate
const { defineField, resetForm, handleSubmit, errors, validate, values } =
  useForm({
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
  if (props.post.id) {
    // edit

    saveEditedPost();
  } else {
    // new
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
  if(props.post.description !== description.value) {
    updatedPost.description = description.value
  }
  if(props.post.category !== values.category) {
    updatedPost.category = values.category
  }
  if(props.post.description !== description.value) {
    updatedPost.time = getTimeReading()
  }
  if(props.post.summary !== values.summary) {
    updatedPost.summary = values.summary
  } 
  if(!areArraysEqual(props.post.tags, values.tags)) {
    updatedPost.tags = values.tags
  }
  if(props.post.image !== values.image) {
    updatedPost.image = values.image
  }
  updatedPost.date = new Date().getTime();

  try {
    if (file.value) {
      await uploadImage(image.value, file.value);
    }

    await updateToDB(props.post.id, updatedPost);
    success = true;

    if (file.value) {
      await deleteImage(props.post.image);
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
        summary: "Post not edited!",
        detail: `${stringToObject.process} ${stringToObject.description}`,
        life: 5000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "Image not deleted!",
        detail: `${stringToObject.process} ${stringToObject.description}`,
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
        summary: "Successfully",
        detail: "Post edited successfully!",
        life: 5000,
      });
      visible.value = false;
    }
    loading.value = false;
  }
};

const saveNewPost = async () => {
  const id = uuidv4();

  const newPost = {
    id: id,
    name: values.name,
    slug: translitForUrl(values.name),
    description: description.value,
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
    await uploadImage(image.value, file.value);
    await writeToDB(id, newPost);

    emits("upload", newPost);

    toast.add({
      severity: "success",
      summary: "Successfully",
      detail: "Post created successfully!",
      life: 5000,
    });
    visible.value = false;
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    toast.add({
      severity: "error",
      summary: "Post not created!",
      detail: `${stringToObject.process} ${stringToObject.description}`,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const requireConfirmation = (event) => {
  confirm.require({
    target: event.currentTarget,
    group: "headless",
    message: "Data will not be saved. Continue?",
    accept: () => {
      hideDialog();
    },
  });
};

const hideDialog = () => {
  visible.value = false;
};

const getTimeReading = () => {
  const symbolsToMinute = 1300;
  const minutes = lengthDescription.value / symbolsToMinute;
  return Math.round(minutes * 10) / 10;
};
</script>

<style lang="scss" scoped>
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
    color: #a6a6a6;
  }
  &__inputs {
    display: flex;
  }
  &-inputtext {
    width: 100%;
    padding-right: 35px;
    &::placeholder {
      font-size: 14px;
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
    color: #b4b4b4;
    cursor: pointer;
  }
}
</style>
