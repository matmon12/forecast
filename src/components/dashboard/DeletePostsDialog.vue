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
            @click="deleteSelectedPosts"
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
    :style="{ width: '25rem' }"
  >
    <template #container="{ closeCallback }">
      <div
        class="dashboard-dialog-container"
        v-on-click-outside="closeCallback"
      >
        <div class="dashboard-dialog-header">
          <span class="dashboard-dialog-title">Results of the operation</span>
          <div class="dashboard-dialog-header-actions">
            <button @click="closeCallback">
              <i-ic:round-close />
            </button>
          </div>
        </div>

        <Message
          v-if="countDeletedPosts"
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
      </div>
    </template>
  </Dialog>

  <Teleport to="body">
    <transition>
      <Spinner v-if="loading" style="border-radius: 0; position: fixed;" size="50" />
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, defineModel, defineProps } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { getClasses } from "@/utils/classes";
import { useToast } from "primevue/usetoast";
import { deleteImage, deleteFromDB } from "@/server/index";
import { uppercaseFirst, pluralize } from "@/utils/index";
import { useServerStore } from "@/stores/server";

const serverStore = useServerStore();
const toast = useToast();

const visible = defineModel("visible");
const selectedPosts = defineModel("selected");
const visibleResult = ref(false);
const countDeletedPosts = ref(0);
const errors = ref([]);
const loading = ref(false);

const emits = defineEmits(['delete'])

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

    emits('delete', post.id)

    await deleteImage(post.image);
  } catch (error) {
    throw { message: error.message, title: post.name };
  }
};
</script>

<style lang="scss" scoped>
.delete-dialog-selected-text {
  margin-bottom: 10px;
  span {
    font-weight: 600;
    color: $blue;
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
  @include Scroll(5px, 5px, #110000, #fd9696);
}
.result__list-item {
  margin-bottom: 10px;
  background-color: #bb3b3b3b;
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
  color: #ff9696;
}
.result-info {
  font-size: 14px;
}
</style>

<style lang="scss">
// message
.confirm {
  &-message {
    border-left: 5px solid #e76a1d;
    &-header {
      display: flex;
      gap: 5px;
      align-items: flex-end;
      color: #ff873d;
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
    }
  }
}

// messages result
.result-error {
  &-message {
    overflow: hidden;
    border: 1px solid #b80202;
    border-left: 5px solid #b80202;
    background-color: #f44b4b1d;
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
    background-color: #ffc9c933;
    color: #ffa3a3;
    &-icon {
    }
    &-label {
    }
  }
}
</style>
