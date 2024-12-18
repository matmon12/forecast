<template>
  <Dialog
    v-model:visible="visible"
    modal
    :pt="getClasses('dashboard').dialog"
    class="delete-posts-dialog"
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
            <button v-if="!uiStore.xs2Smaller" @click="closeCallback">
              <i-ic:round-close />
            </button>
          </div>
        </div>

        <p class="delete-dialog-selected-text">
          Are you sure you want to delete the selected posts?
        </p>
        <Message severity="warn" :pt="getClasses('confirm').message">
          <div class="confirm-message-header">
            <i-ion:warning-outline />
            <span class="confirm-message-title">Warning</span>
          </div>
          Selected articles will be deleted permanently!</Message
        >

        <div class="dashboard-dialog-footer">
          <Button
            text
            @click="visible = false"
            :pt="getClasses('no').button"
            unstyled
            ><i-iconoir:cancel />No</Button
          >
          <Button
            text
            @click="onCheckRole"
            :pt="getClasses('yes').button"
            unstyled
            ><i-ic:round-check />Yes</Button
          >
        </div>
      </div>
    </template>
  </Dialog>

  <Dialog
    v-model:visible="visibleResult"
    :modal="true"
    :draggable="false"
    class="results-dialog"
    :pt="{ mask: 'results-dialog-mask' }"
  >
    <template #container="{ closeCallback }">
      <div
        class="dashboard-dialog-container"
        v-on-click-outside="closeCallback"
      >
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">Results of the operation</span>
          <div class="dashboard-dialog-header-actions">
            <button v-if="!uiStore.xs2Smaller" @click="closeCallback">
              <i-ic:round-close />
            </button>
          </div>
        </div>

        <Message
          v-if="1"
          severity="info"
          :pt="getClasses('result-success').message"
        >
          <div class="result__header">
            <i-ep:success-filled />
            <span>Success</span>
          </div>
          <div class="result-info">
            {{ countDeletedPosts }} post{{ pluralize(countDeletedPosts) }}
            deleted successfully
          </div>
        </Message>
        <Message
          v-if="errors.length"
          severity="error"
          :pt="getClasses('result-error').message"
        >
          <div class="result__header">
            <i-ooui:error />
            <span>Errors</span>
          </div>
          <ul class="result__list">
            <li
              v-for="(item, index) of errors"
              :key="index"
              class="result__list-item"
            >
              <Tag severity="danger" :pt="getClasses('result-status').tag"
                >{{ uppercaseFirst(item.error.object) }} not deleted</Tag
              >
              <h6 class="result__list-title">"{{ item.title }}"</h6>
              <p class="result__list-text">
                {{ item.error.process }} {{ item.error.description }}
              </p>
            </li>
          </ul>
        </Message>

        <div v-if="uiStore.xs2Smaller" class="dashboard-dialog-footer">
          <Button
            text
            @click="closeCallback()"
            :pt="getClasses('no').button"
            unstyled
            ><i-iconoir:cancel />Close</Button
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
import { ref, defineModel, defineProps } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { getClasses } from "@/utils/classes";
import { useToast } from "primevue/usetoast";
import { deleteImage } from "@/server/storage";
import { deleteFromDB } from "@/server/posts";
import { uppercaseFirst, pluralize } from "@/utils/index";
import { useServerStore } from "@/stores/server";
import { ability } from "@/services/ability";
import { useUiStore } from "@/stores/ui";

const serverStore = useServerStore();
const toast = useToast();
const uiStore = useUiStore();

const visible = defineModel("visible");
const selectedPosts = defineModel("selected");
const visibleResult = ref(false);
const countDeletedPosts = ref(0);
const errors = ref([]);
const loading = ref(false);

const emits = defineEmits(["delete"]);

const onCheckRole = () => {
  if (ability.can("delete", "Post")) {
    deleteSelectedPosts();
  }
};

const deleteSelectedPosts = async () => {
  countDeletedPosts.value = 0;
  errors.value = [];
  loading.value = true;

  const selectedPostsStatic = selectedPosts.value.map((post) => ({ ...post }));
  const promisesArr = selectedPostsStatic.map((post) => deletePost(post));
  Promise.allSettled(promisesArr)
    .then((data) => {
      const countFulfilled = data.filter(
        (item) => item.status === "fulfilled"
      ).length;

      data.forEach((value) => {
        if (value.status === "rejected") {
          const stringToObject = JSON.parse(value.reason.message);
          errors.value.push({
            error: stringToObject,
            title: value.reason.title,
          });
        }
      });

      if (data.length === countFulfilled) {
        toast.add({
          severity: "success",
          summary: "Successfully",
          detail: `Selected post${pluralize(
            countFulfilled
          )}(${countFulfilled}) deleted successfully`,
          life: 3000,
        });
      } else {
        visibleResult.value = true;
      }
    })
    .finally(() => {
      visible.value = false;
      loading.value = false;

      if (countDeletedPosts.value > 0) {
        selectedPosts.value = null;
      }
    });
};

const deletePost = async (post) => {
  try {
    await deleteFromDB(post.id);
    ++countDeletedPosts.value;

    // Удалить запись из массива urls для удаленного поста
    serverStore.deleteUrl(post.id);

    emits("delete", post.id);

    await deleteImage(post.image, "images/posts/");
  } catch (error) {
    throw { message: error.message, title: post.name };
  }
};
</script>

<style lang="scss" scoped>
@include DeletePostsDialog();
.delete-dialog-selected-text {
  margin-bottom: 10px;
  span {
    font-weight: 600;
    color: var(--blue);
  }
}

.result__header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
  padding: 0 3px;
  svg {
  }
  span {
    font-weight: 600;
  }
}
.result__list {
  padding: 0 3px;
  max-height: 170px;
  overflow-y: auto;
  @include Scroll(5px, 5px, var(--red-1000), var(--red-200));
}
.result__list-item {
  margin-bottom: 10px;
  background-color: var(--red-60);
  border-radius: 5px;
  padding: 5px;
}
.result__list-title {
  @include TextOverflow(1);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 3px;
  font-weight: 500;
}
.result__list-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 1.2;
  color: var(--red-200);
}
.result-info {
  font-size: 14px;
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
@include DeletePostsDialog();
// dialog
.delete-posts-dialog.dashboard-dialog {
  width: 450px;
  background-color: var(--grey-1170);
}
.results-dialog {
  width: 25rem;
  background: var(--grey-1050);

  &-mask {
    z-index: 1500 !important;
  }
}

// message
.confirm {
  &-message {
    border-left: 5px solid var(--orange);
    background-color: var(--message-warn);
    outline-color: var(--yellow-3);

    &-header {
      display: flex;
      gap: 5px;
      align-items: flex-end;
      color: var(--orange-2);
      margin-bottom: 5px;

      svg {
        height: min-content;
        font-size: 18px;
        // stroke: #fff;
      }
    }
    &-title {
      line-height: 1.1;
      font-weight: 700;
      font-size: 16px;
    }
    &-content {
      padding: 5px 10px;
    }
    &-text {
      font-size: 14px;
      color: var(--yellow-4);
    }
  }
}

// messages result
.result-error {
  &-message {
    overflow: hidden;
    border: 1px solid var(--red-500);
    border-left: 5px solid var(--red-500);
    background-color: var(--red-50);
    &-content {
      padding: 5px 7px;
    }
  }
}
.result-success {
  &-message {
    overflow: hidden;
    border: 1px solid #24b8fd;
    border-left: 5px solid #24b8fd;
    margin-bottom: 10px;
    color: #24b8fd;
    background-color: var(--success-back);
  }
}

// tag
.result-status {
  &-tag {
    font-size: 12px;
    font-weight: 500;
    border-radius: 3px;
    padding: 2px 7px;
    margin-bottom: 5px;
    background-color: var(--red-110);
    color: var(--red-150);
    &-icon {
    }
    &-label {
    }
  }
}
</style>
