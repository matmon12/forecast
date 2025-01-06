<template>
  <Dialog
    v-model:visible="visible"
    modal
    :pt="getClasses('dashboard').dialog"
    class="delete-dialog"
    unstyled
  >
    <template #container="{ closeCallback }">
      <div
        class="dashboard-dialog-container"
        v-on-click-outside="closeCallback"
      >
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">{{
            $t("delete-dialog.title")
          }}</span>
          <div class="dashboard-dialog-header-actions">
            <button v-if="!uiStore.xs2Smaller" @click="closeCallback">
              <i-ic:round-close />
            </button>
          </div>
        </div>
        <div class="delete-dialog__content">
          <i-fluent:warning-28-regular />
          <div v-if="post" class="delete-dialog-text">
            {{ $t("delete-dialog.confirm") }}
            <p>{{ post.name }}</p>
          </div>
        </div>
        <div class="dashboard-dialog-footer">
          <Button
            text
            @click="visible = false"
            :pt="getClasses('no').button"
            unstyled
            ><i-iconoir:cancel />{{ $t("buttons.no") }}</Button
          >
          <Button @click="onCheckRole" :pt="getClasses('yes').button" unstyled
            ><i-ic:round-check />{{ $t("buttons.yes") }}</Button
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
import { ref, defineModel, defineProps, defineEmits, inject } from "vue";
import { getClasses } from "@/utils/classes.js";
import { vOnClickOutside } from "@vueuse/components";
import { useToast } from "primevue/usetoast";
import { deleteImage } from "@/server/storage";
import { deleteFromDB } from "@/server/posts";
import { uppercaseFirst } from "@/utils/index";
import { useServerStore } from "@/stores/server";
import { ability } from "@/services/ability";
import { useUiStore } from "@/stores/ui";

const serverStore = useServerStore();
const toast = useToast();
const uiStore = useUiStore();

const t = inject("t");
const loading = ref(false);
const visible = defineModel("visible");
const props = defineProps({
  post: Object,
});

const emits = defineEmits(["delete"]);

const onCheckRole = () => {
  if (ability.can("delete", "Post")) {
    deletePost();
  }
};

const deletePost = async () => {
  loading.value = true;
  let success = false;
  try {
    await deleteFromDB(props.post.id);
    success = true;

    // Удалить запись из массива urls для удаленного поста
    serverStore.deleteUrl(props.post.id);

    await deleteImage(props.post.image, "images/posts/");
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    toast.add({
      severity: "error",
      summary: `${uppercaseFirst(
        t(`errors.objects.${stringToObject.object}`)
      )} ${t("errors.delete-post.summary")}`,
      detail: `${t(`errors.process.${stringToObject.process}`)} ${t(
        `error_codes.${stringToObject.description}`
      )}`,
      life: 5000,
    });
  } finally {
    if (success) {
      emits("delete", props.post.id);

      toast.add({
        severity: "success",
        summary: t("success.delete-post.summary"),
        detail: t("success.delete-post.detail"),
        life: 3000,
      });
    }
    visible.value = false;
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
@include DeleteDialog();
.delete-dialog {
  &__content {
    display: flex;
    gap: 10px;
    svg {
      color: var(--yellow-5);
      display: block;
      min-width: 40px;
      height: min-content;
    }
  }
  &-text {
    line-height: 1.2;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    p {
      color: var(--blue-4);
      font-size: 15px;
      margin-top: 5px;
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
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s, filter 0.3s;
    height: 35px;
  }
}
.yes-btn {
  color: var(--black-3);
  background-color: var(--blue-360);
  transition: filter 0.3s;
  &:not(:disabled):hover {
    filter: brightness(1.3);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.no-btn {
  color: var(--grey-50);
  background-color: var(--grey-900);
  transition: background-color 0.3s;
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
@include DeleteDialog();
.delete-dialog.dashboard-dialog {
  width: 450px;
  background-color: var(--grey-1170);
}
</style>
