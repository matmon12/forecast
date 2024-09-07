<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    modal
    :pt="getClasses('dashboard').dialog"
    unstyled
  >
    <template #container="{ closeCallback }">
      <div
        class="dashboard-dialog-container"
        v-on-click-outside="closeCallback"
      >
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">Confirm</span>
          <div class="dashboard-dialog-header-actions">
            <button @click="closeCallback">
              <i-ic:round-close />
            </button>
          </div>
        </div>
        <div class="delete-dialog__content">
          <i-fluent:warning-28-regular />
          <div v-if="post" class="delete-dialog-text">
            Are you sure you want to delete?
            <p>{{ post.name }}</p>
          </div>
        </div>
        <div class="dashboard-dialog-footer">
          <Button
            text
            @click="visible = false"
            :pt="getClasses('no').button"
            unstyled
            ><i-iconoir:cancel />No</Button
          >
          <Button @click="deletePost" :pt="getClasses('yes').button" unstyled
            ><i-ic:round-check />Yes</Button
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
import { ref, defineModel, defineProps } from "vue";
import { getClasses } from "@/utils/classes.js";
import { vOnClickOutside } from "@vueuse/components";
import { useToast } from "primevue/usetoast";
import { deleteImage, deleteFromDB } from "@/server/index";
import { uppercaseFirst } from "@/utils/index";
import { useServerStore } from "@/stores/server";

const serverStore = useServerStore();
const toast = useToast();

const loading = ref(false);
const visible = defineModel("visible");
const props = defineProps({
  post: Object,
});

const deletePost = async () => {
  loading.value = true;
  let success = false;
  try {
    await deleteFromDB(props.post.id);
    success = true;

    // Удалить запись из массива urls для удаленного поста
    delete serverStore.urls[props.post.id];

    await deleteImage(props.post.image);
  } catch (error) {
    const stringToObject = JSON.parse(error.message);
    toast.add({
      severity: "error",
      summary: `${uppercaseFirst(stringToObject.object)} not deleted!`,
      detail: `${stringToObject.process} ${stringToObject.description}`,
      life: 5000,
    });
  } finally {
    if (success) {
      toast.add({
        severity: "success",
        summary: "Successfully",
        detail: "Post deleted successfully!",
        life: 3000,
      });
    }
    visible.value = false;
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.delete-dialog {
  &__content {
    display: flex;
    gap: 10px;
    svg {
      color: #d6b026;
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
      color: #6b99c6;
      font-size: 15px;
      margin-top: 5px;
    }
  }
}
</style>

<style lang="scss"></style>
