<template>
  <div v-if="!errorPosts" class="dashboard">
    <Breadcrumb :model="breadCrumbItems" />

    <h1 class="dashboard-title">{{ $t("dashboard.title") }}</h1>

    <Panel
      v-if="uiStore.mdSmaller"
      :header="$t('dashboard.sorting')"
      toggleable
      collapsed
      :pt="getClasses('dashboard').panel"
    >
      <Sorting
        v-model:sortField="currentSortOrder.sortField"
        v-model:sortOrder="currentSortOrder.sortOrder"
        @sort="hideExpandedPost()"
      />

      <template #toggleicon="{ collapsed }">
        <i-ep:arrow-down-bold v-if="collapsed" />
        <i-ep:arrow-up-bold v-else />
      </template>
    </Panel>

    <Panel
      v-if="uiStore.mdSmaller"
      :header="$t('dashboard.filters')"
      toggleable
      collapsed
      :pt="getClasses('dashboard').panel"
    >
      <div class="dashboard-panel-list">
        <div class="dashboard-panel-item">
          <h6 class="dashboard-panel-item-title">
            {{ $t("dashboard.fields.date") }}
          </h6>
          <DateFilter
            v-model="filters.date.value"
            @date-select="hideExpandedPost(), moveFirstPage(), dateSelect()"
            @clear-click="hideExpandedPost(), moveFirstPage(), dateSelect()"
          />
        </div>
        <div class="dashboard-panel-item">
          <h6 class="dashboard-panel-item-title">
            {{ $t("dashboard.fields.title") }}
          </h6>
          <NameFilter
            :name="filters.name.value"
            @search="
              (value) => {
                hideExpandedPost();
                moveFirstPage();
                filters.name.value = value;
              }
            "
          />
        </div>
        <div class="dashboard-panel-item">
          <h6 class="dashboard-panel-item-title">
            {{ $t("dashboard.fields.tags") }}
          </h6>
          <TagsFilter
            :tags="filters.tags.value"
            @change="
              (value) => {
                hideExpandedPost();
                moveFirstPage();
                filters.tags.value = value;
              }
            "
          />
        </div>
        <div class="dashboard-panel-item">
          <h6 class="dashboard-panel-item-title">
            {{ $t("dashboard.fields.category") }}
          </h6>
          <CategoryFilter
            :category="filters.category.value"
            :categories="categories"
            @change="
              (value) => {
                hideExpandedPost();
                moveFirstPage();
                filters.category.value = value;
              }
            "
          />
        </div>
      </div>

      <template #toggleicon="{ collapsed }">
        <i-ep:arrow-down-bold v-if="collapsed" />
        <i-ep:arrow-up-bold v-else />
      </template>
    </Panel>

    <DataTable
      ref="dt"
      v-model:selection="selectedPosts"
      v-model:filters="filters"
      v-model:expandedRows="expandedRows"
      :value="posts"
      dataKey="id"
      :filterDisplay="uiStore.mdSmaller ? null : 'row'"
      :loading="loadingPosts"
      scrollable
      :scrollHeight="uiStore.mdSmaller ? '410px' : '550px'"
      reorderableColumns
      :sort-field="currentSortOrder.sortField"
      :sort-order="currentSortOrder.sortOrder"
      @sort="
        (event) => {
          sortingPosts(event), moveFirstPage();
        }
      "
      :pt="{
        ...getClasses('dashboard').datatable,
        tableContainer: {
          class: 'dashboard-datatable-table-container',
          style: uiStore.mdSmaller ? 'overflow-x: hidden;' : '',
        },
      }"
    >
      <Column
        columnKey="checkbox"
        selectionMode="multiple"
        :exportable="false"
        :pt="{
          ...getClasses('dashboard').column,
          pcheadercheckbox: {
            ...getClasses('dashboard').checkbox,
          },
          pcRowCheckbox: {
            ...getClasses('dashboard').checkbox,
          },
        }"
      />
      <Column
        v-if="!uiStore.mdSmaller"
        field="date"
        :header="$t('dashboard.fields.date')"
        sortable
        :showClearButton="false"
        :showFilterMenu="false"
        style="min-width: 12rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled v-if="sortOrder === 1" />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sortOrder === -1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          {{ formattedDate(data.date) }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <DateFilter
            v-model="filterModel.value"
            @date-select="filterCallback(), moveFirstPage(), dateSelect()"
            @clear-click="filterCallback(), moveFirstPage(), dateSelect()"
          />
        </template>
      </Column>
      <Column
        field="name"
        :header="uiStore.mdSmaller ? null : $t('dashboard.fields.title')"
        :sortable="!uiStore.mdSmaller"
        :showClearButton="false"
        :showFilterMenu="false"
        :pt="{
          ...getClasses('dashboard').column,
          bodyCell: {
            class: [
              'dashboard-datatable-body-cell',
              'dashboard-datatable-name',
            ],
          },
        }"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled v-if="sortOrder === 1" />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sortOrder === -1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <p class="dashboard-table-name">
            {{ data.name }}
          </p>
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <NameFilter
            :name="filters.name.value"
            @search="
              (value) => {
                moveFirstPage();
                filters.name.value = value;
              }
            "
          />
        </template>
      </Column>
      <Column
        columnKey="image"
        :header="uiStore.mdSmaller ? null : $t('dashboard.fields.image')"
        :pt="{
          ...getClasses('dashboard').column,
          bodyCell: {
            class: [
              'dashboard-datatable-body-cell',
              'dashboard-datatable-image',
            ],
          },
        }"
      >
        <template #body="{ data }">
          <div class="dashboard-table-img">
            <Image
              :id="data.id"
              :name="data.image"
              :path="'images/posts/'"
              preview
            />
          </div>
        </template>
      </Column>
      <Column
        v-if="!uiStore.mdSmaller"
        field="tags"
        :header="$t('dashboard.fields.tags')"
        :showClearButton="false"
        :showFilterMenu="false"
        style="min-width: 12rem; max-width: 12rem"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <TagsTable :tags="data.tags" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <TagsFilter
            :tags="filters.tags.value"
            @change="
              (value) => {
                moveFirstPage();
                filters.tags.value = value;
              }
            "
          />
        </template>
      </Column>
      <Column
        v-if="!uiStore.mdSmaller"
        field="category"
        :header="$t('dashboard.fields.category')"
        :showClearButton="false"
        :showFilterMenu="false"
        style="min-width: 8rem"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <Tag
            :value="uppercaseFirst($t(`categores.options.${data.category}`))"
            :style="{
              backgroundColor:
                colorsTags[data.category.toLowerCase()].colorBack,
              color: colorsTags[data.category.toLowerCase()].color,
            }"
          />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <CategoryFilter
            :category="filters.category.value"
            :categories="categories"
            @change="
              (value) => {
                moveFirstPage();
                filters.category.value = value;
              }
            "
          />
        </template>
      </Column>
      <Column
        v-if="!uiStore.mdSmaller"
        field="rating"
        :header="$t('dashboard.fields.rating')"
        sortable
        style="min-width: 9rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled v-if="sortOrder === 1" />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sortOrder === -1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <Tag :severity="getColorRating(data.rating)">
            <i-material-symbols:signal-cellular-alt-rounded />
            {{ data.rating }}</Tag
          >
        </template>
      </Column>
      <Column
        v-if="!uiStore.mdSmaller"
        field="time"
        :header="$t('dashboard.fields.time')"
        sortable
        style="min-width: 7rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled v-if="sortOrder === 1" />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sortOrder === -1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <Tag
            :value="`${getTimeReading(data.time)} ${$t('dashboard.min')}`"
            :severity="getColorLabel(data.time)"
          />
        </template>
      </Column>
      <Column
        v-if="!uiStore.mdSmaller"
        :exportable="false"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <div class="dashboard-table-controls">
            <Button
              v-if="can('update', 'Post')"
              @click="openEditPostModal(data)"
              :pt="getClasses('edit').button"
              unstyled
              ><i-lucide:edit
            /></Button>
            <Button
              v-if="can('delete', 'Post')"
              @click="confirmDeletePost(data)"
              :pt="getClasses('remove').button"
              unstyled
              ><i-mi:delete
            /></Button>
          </div>
        </template>
      </Column>
      <Column
        v-if="uiStore.mdSmaller"
        expander
        :pt="{
          ...getClasses('dashboard').column,
          bodyCell: {
            class: [
              'dashboard-datatable-body-cell',
              'dashboard-datatable-expander',
            ],
          },
        }"
      >
        <template #body="{ data, rowTogglerCallback }">
          <Button
            @click="rowTogglerCallback()"
            severity="secondary"
            variant="text"
            rounded
            :class="[
              'dashboard-datatable-row-toggle-button',
              { 'is-active': Object.keys(expandedRows).includes(data.id) },
            ]"
          >
            <i-ep:arrow-up-bold />
          </Button>
        </template>
      </Column>

      <template #empty>
        <div
          v-if="countNewPosts < rowsPerPage"
          class="dashboard-datatable-empty-cell"
        >
          <div class="dashboard-datatable-empty-container">
            <img
              class="dashboard-datatable-empty-img"
              src="@/img/empty.svg"
              alt="empty"
            />
            <span class="dashboard-datatable-empty-text">{{
              $t("dashboard.empty")
            }}</span>
          </div>
        </div>
      </template>

      <template #header>
        <div class="dashboard-datatable-header-left">
          <Button
            v-if="can('create', 'Post')"
            @click="openNew"
            :pt="getClasses('new').button"
            unstyled
          >
            <span class="new-btn-label">{{ $t("buttons.new") }}</span>
            <i-fluent:add-16-filled />
          </Button>
          <Button
            v-if="can('delete', 'Post')"
            @click="confirmDeleteSelected"
            :disabled="!selectedPosts || !selectedPosts.length"
            :pt="getClasses('delete').button"
            unstyled
          >
            <span v-if="!uiStore.xs2Smaller" class="delete-btn-label">{{
              $t("buttons.delete")
            }}</span>
            <i-mi:delete />
          </Button>
        </div>
        <div class="dashboard-datatable-header-right">
          <Button
            @click="clearFilters"
            :pt="getClasses('delete').button"
            unstyled
            :disabled="disableClearBtn"
          >
            <i-ci:filter-off />
            <span v-if="!uiStore.xs2Smaller" class="delete-btn-label">{{
              $t("buttons.clear")
            }}</span>
          </Button>
          <Button
            v-if="!uiStore.mdSmaller"
            @click="exportCSV($event)"
            :pt="getClasses('export').button"
            unstyled
            ><i-ph:export-bold />
            <span class="export-btn-label">{{ $t("buttons.export") }}</span>
          </Button>
        </div>
      </template>

      <template #footer>
        <Button
          @click="moveToStartPosition"
          :pt="getClasses('new').button"
          unstyled
          ><i-ph:arrow-up-bold
        /></Button>
      </template>

      <template #expansion="{ data }">
        <table class="expansion-table">
          <tbody class="expansion-tbody">
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.date") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                {{ formattedDate(data.date) }}
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.title") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                {{ data.name }}
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.image") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <Image
                  :id="data.id"
                  :name="data.image"
                  :path="'images/posts/'"
                  preview
                  style="width: 80px"
                />
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.tags") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <TagsTable :tags="data.tags" />
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.category") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <Tag
                  :value="
                    uppercaseFirst($t(`categores.options.${data.category}`))
                  "
                  :style="{
                    backgroundColor:
                      colorsTags[data.category.toLowerCase()].colorBack,
                    color: colorsTags[data.category.toLowerCase()].color,
                  }"
                />
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.rating") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <Tag :severity="getColorRating(data.rating)">
                  <i-material-symbols:signal-cellular-alt-rounded />
                  {{ data.rating }}</Tag
                >
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.time") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <Tag
                  :value="`${getTimeReading(data.time)} ${$t('dashboard.min')}`"
                  :severity="getColorLabel(data.time)"
                />
              </td>
            </tr>
            <tr class="expansion-row">
              <td class="expansion-body-cell expansion-text">
                {{ $t("dashboard.fields.action") }}
              </td>
              <td class="expansion-body-cell expansion-content">
                <div class="dashboard-table-controls">
                  <Button
                    v-if="can('update', 'Post')"
                    @click="openEditPostModal(data)"
                    :pt="getClasses('edit').button"
                    unstyled
                    ><i-lucide:edit
                  /></Button>
                  <Button
                    v-if="can('delete', 'Post')"
                    @click="confirmDeletePost(data)"
                    :pt="getClasses('remove').button"
                    unstyled
                    ><i-mi:delete
                  /></Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </DataTable>
  </div>

  <Error
    v-else
    :message="$t(`error_codes.${errorPosts.description}`)"
    retry
    @to-back="onToBack"
    @retry="onErrorHandler"
  />

  <PostDialog
    v-model:visible="postDialog"
    :post="post"
    @upload="(value) => addNewPost(value)"
    @edit="(value) => editPost(value)"
  />

  <DeleteDialog
    v-model:visible="deletePostDialog"
    :post="post"
    @delete="(value) => deletePost(value)"
  />

  <DeletePostsDialog
    v-model:visible="deletePostsDialog"
    v-model:selected="selectedPosts"
    @delete="(value) => deletePost(value)"
  />
</template>

<script setup>
import {
  ref,
  watch,
  computed,
  onUnmounted,
  onMounted,
  onActivated,
  onDeactivated,
  inject,
} from "vue";
import { getClasses } from "@/utils/classes";
import { postsRef } from "@/server/firebase.config";
import {
  where,
  query,
  getDocs,
  orderBy,
  limit,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { FilterMatchMode, FilterService } from "@primevue/core/api";
import { readToDB } from "@/server/posts";
import { onToBack, uppercaseFirst } from "@/utils/index";
import { onBeforeRouteLeave } from "vue-router";
import { useAbility } from "@casl/vue";
import { useUiStore } from "../stores/ui";
import Panel from "primevue/panel";

const { can } = useAbility();
const uiStore = useUiStore();
const t = inject("t");

const dt = ref();
const post = ref({});
const selectedPosts = ref();
const deletePostDialog = ref(false);
const deletePostsDialog = ref(false);
const postDialog = ref(false);
const rowsPerPage = ref(5);
const expandedRows = ref({});

// при большом разрешении скрывать пост и переставить столбцы
watch(
  () => uiStore.mdSmaller,
  (newValue) => {
    if (newValue === false) {
      hideExpandedPost();
      dt.value && (dt.value.d_columnOrder = null);
    } else {
      dt.value && (dt.value.d_columnOrder = ["checkbox", "image", "name"]);
    }
  }
);

// изменение порядка столбцов
watch(
  () => dt.value,
  () => {
    if (uiStore.mdSmaller && dt.value) {
      dt.value.d_columnOrder = ["checkbox", "image", "name"];
    }
  }
);

// breadcrumb
const breadCrumbItems = computed(() => [
  {
    label: t("breadcrumb.dashboard"),
  },
]);

// posts
const posts = ref([]);
const errorPosts = ref();
const loadingPosts = ref(false);

// filters / sorting / pagination
const categories = ref(["weather", "nature", "animals", "auto", "science"]);
const currentSortOrder = ref({ sortField: "date", sortOrder: -1 });
let lastVisible;
const cursorNextPage = ref(null);
const datesLimit = ref({ startDate: null, endDate: null });
const filters = ref();
const countNewPosts = ref(0);
let observer, spacer, tableConatiner;

// filters LOCAL
FilterService.register("ARRAY_CONTAINS_ANY", (value, filter) => {
  if (filter.length === 0) {
    return true;
  }
  return value.some((el) => filter.includes(el));
});

FilterService.register("DATE_BETWEEN", (value, filter) => {
  const { startDate, endDate } = getDates(filter);
  if (startDate && endDate) {
    return value >= startDate && value <= endDate;
  }
  if (startDate && !endDate) {
    return value >= startDate;
  }
  if (!startDate && !endDate) {
    return value >= yearBeforeDate && value <= futureDate;
  }
});

const initFilters = () => {
  filters.value = {
    name: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
    category: { value: [...categories.value], matchMode: FilterMatchMode.IN },
    tags: { value: [], matchMode: "ARRAY_CONTAINS_ANY" },
    date: { value: "", matchMode: "DATE_BETWEEN" },
  };
};
initFilters();

const clearFilters = () => {
  initFilters();
  dateSelect();
  moveFirstPage();

  if (uiStore.mdSmaller) {
    hideExpandedPost();
  }
};

const disableClearBtn = computed(
  () =>
    !filters.value.name.value &&
    filters.value.category.value.length === categories.value.length &&
    !filters.value.tags.value.length &&
    !filters.value.date.value.length
);

// вычисление дат для границ (фильтр)
const initDates = () => {
  const curDate = new Date();
  let beforeDate = new Date(curDate).setFullYear(curDate.getFullYear() - 1);
  let afterDate = new Date(curDate).setMonth(curDate.getMonth() + 1);

  return {
    beforeDate,
    afterDate,
  };
};
const { beforeDate: yearBeforeDate, afterDate: futureDate } = initDates();

const getDates = (filterDate) => {
  let startDate, endDate;

  if (filterDate && filterDate.length) {
    startDate = new Date(filterDate[0]).getTime();
    if (filterDate[1]) {
      endDate = new Date(filterDate[1]);
      endDate = endDate.setDate(endDate.getDate() + 1);
    }
  }

  return {
    startDate,
    endDate,
  };
};

// получение постов
const postsQuery = computed(() => {
  // sorting
  let sortDirection = "asc";
  if (currentSortOrder.value.sortOrder === -1) {
    sortDirection = "desc";
  } else if (currentSortOrder.value.sortOrder === 1) {
    sortDirection = "asc";
  }

  return query(
    postsRef,
    filters.value.category.value.length
      ? where("category", "in", filters.value.category.value)
      : where("category", "==", null),
    where("name", ">=", filters.value.name.value),
    where("name", "<=", filters.value.name.value + "\uf8ff"),
    datesLimit.value.startDate
      ? where("date", ">=", datesLimit.value.startDate)
      : where("date", ">=", yearBeforeDate),
    datesLimit.value.endDate
      ? where("date", "<=", datesLimit.value.endDate)
      : where("date", "<=", futureDate),
    filters.value.tags.value.length
      ? where("tags", "array-contains-any", filters.value.tags.value)
      : where("tags", "!=", null),
    orderBy(currentSortOrder.value.sortField, sortDirection),
    orderBy("id"),
    limit(rowsPerPage.value),
    cursorNextPage.value
      ? startAfter(cursorNextPage.value)
      : currentSortOrder.value.sortOrder === 1
      ? startAfter(null)
      : endBefore(null)
  );
});

const getPosts = async () => {
  loadingPosts.value = true;

  // уникальные посты
  let countAddedPosts = 0;

  try {
    const querySnapshot = await readToDB(postsQuery.value);

    querySnapshot.forEach((doc) => {
      const isPostExists = posts.value.some((item) => item.id === doc.id);
      if (!isPostExists) {
        posts.value.push(doc.data());
        ++countAddedPosts;
      }
    });

    // количество последних загруженных постов
    countNewPosts.value = querySnapshot.docs.length;

    // получение последнего видимого поста
    lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

    // если ни один пост не был добавлен
    if (!countAddedPosts && countNewPosts.value) {
      moveNextPage();
    }
  } catch (error) {
    const stringToObject = JSON.parse(error.message);

    errorPosts.value = stringToObject;
  } finally {
    loadingPosts.value = false;
  }
};

watch(
  () => postsQuery.value,
  () => {
    getPosts();
  },
  { immediate: true }
);

// загрузка новых постов при скролле
const moveNextPage = () => {
  if (countNewPosts.value === rowsPerPage.value) {
    cursorNextPage.value = lastVisible;
  }
};

const callback = (entries, observer) => {
  if (entries[0].isIntersecting) {
    moveNextPage();
  }
};

const initIntersection = () => {
  const tableEl = document.querySelector(".dashboard-datatable-table");
  spacer = document.createElement("tbody");
  spacer.className = "dashboard-datatable-virtualscroller-spacer";
  tableEl.appendChild(spacer);

  observer = new IntersectionObserver(callback);
  observer.observe(spacer);
};

// HOOKS
onMounted(() => {
  // получение блока со скроллом
  tableConatiner = document.querySelector(
    ".dashboard-datatable-table-container"
  );
  initIntersection();
});

onUnmounted(() => {
  observer.unobserve(spacer);
});

onActivated(() => {
  observer.observe(spacer);
});

onDeactivated(() => {
  observer.unobserve(spacer);
});

// обработка ошибок
const onErrorHandler = () => {
  errorPosts.value = null;

  getPosts();
};

// get colors
const getColorLabel = (time) => {
  switch (true) {
    case time <= 5:
      return "success";
    case time > 5 && time <= 10:
      return "warn";
    case time > 10:
      return "danger";
    default:
      return null;
  }
};
const colorsTags = {
  weather: { color: "var(--weather-color)", colorBack: "var(--weather-back)" },
  nature: { color: "var(--nature-color)", colorBack: "var(--nature-back)" },
  animals: { color: "var(--animals-color)", colorBack: "var(--animals-back)" },
  auto: { color: "var(--auto-color)", colorBack: "var(--auto-back)" },
  science: { color: "var(--science-color)", colorBack: "var(--science-back)" },
};
const getColorRating = (value) => {
  switch (true) {
    case value < 0:
      return "danger";
    case value > 0:
      return "success";
    case value === 0:
      return "secondary";
    default:
      return "secondary";
  }
};

// export
const exportCSV = () => {
  dt.value.exportCSV();
};

// save / update
const openNew = () => {
  post.value = {};
  postDialog.value = true;
};

const addNewPost = (newPost) => {
  posts.value.push(newPost);
};

const openEditPostModal = (prod) => {
  post.value = { ...prod };
  postDialog.value = true;
};

const editPost = (editedData) => {
  const editablePostIndex = posts.value.findIndex(
    (item) => item.id === editedData.id
  );
  if (editablePostIndex !== -1) {
    Object.assign(posts.value[editablePostIndex], editedData);
  }
};

// delete one
const confirmDeletePost = (prod) => {
  post.value = prod;
  deletePostDialog.value = true;
};

const deletePost = (postId) => {
  const indexDeletedPost = posts.value.findIndex((item) => item.id === postId);
  posts.value.splice(indexDeletedPost, 1);
};

// delete selected
const confirmDeleteSelected = () => {
  deletePostsDialog.value = true;
};

// time Reading
const getTimeReading = (time) => (time >= 1 ? Math.round(time) : "< 1");

// formatted date
const formattedDate = (timestamp) => {
  const nowDate = new Date(timestamp);
  const dateFormat = `${nowDate.getDate().toString().padStart(2, "0")}-${(
    nowDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${nowDate.getFullYear()}`;
  return dateFormat;
};

// sorting
const sortingPosts = (value) => {
  currentSortOrder.value = {
    sortField: value.sortField,
    sortOrder: value.sortOrder,
  };
};

// при выборе даты возврат на первую страницу
const dateSelect = () => {
  const { startDate, endDate } = getDates(filters.value.date.value);
  datesLimit.value = { startDate, endDate };
};

// первая страница
const moveFirstPage = () => {
  tableConatiner.scrollTo({ top: 0, left: 0 });
  posts.value = [];

  cursorNextPage.value = null;
  countNewPosts.value = 0;
};

// установка скролла в начальное положение
const moveToStartPosition = () => {
  tableConatiner.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

// предупреждение о несохраненных изменениях
onBeforeRouteLeave((to, from) => {
  if (postDialog.value) {
    const answer = window.confirm(t("dashboard.confirm"));

    if (!answer) return false;
  }
});

// скрывать развернутый пост
const hideExpandedPost = () => {
  expandedRows.value = {};
};
</script>

<style lang="scss" scoped>
@include Dashboard();
.dashboard {
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #e2e2e2;
}
.dashboard-title {
  color: var(--grey-50);
  font-size: 32px;
  margin-bottom: 10px;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  height: 35px;
}

.dashboard-skeleton {
  flex-grow: 1;
}

.dashboard-table {
  &-name {
    @include TextOverflow(2);
  }
  &-img {
    height: 70px;
    width: 80px;
    // border-radius: 5px;
    // overflow: hidden;
  }
  &-controls {
    display: flex;
    gap: 7px;
  }
  &-author {
    display: flex;
    align-items: center;
    gap: 10px;
    &-name {
      white-space: nowrap;
    }
  }
}

// expansion
.expansion-table {
  overflow: hidden;
  width: 100%;
  border-spacing: 0;
  border-radius: 10px;
  border: 1px solid var(--grey-780);
}
.expansion-tbody {
}
.expansion-body-cell {
  padding: 10px;
}
.expansion-row {
  & + & {
    .expansion-body-cell:not(.expansion-text) {
      border-top: 1px solid var(--grey-780);
    }
    .expansion-body-cell.expansion-text {
      border-top: 1px solid var(--grey-310);
    }
  }
}
.expansion-text {
  font-size: 15px;
  font-weight: 500;
  border-right: 1px solid var(--grey-780);
  background-color: var(--blue-900);
  color: var(--grey-30);
  width: 200px;
}
.expansion-content {
  padding-left: 20px;
  font-size: 14px;
  color: var(--white);
  background-color: var(--transparent-1);

  .picture__container {
    height: 70px;
  }
}

:deep() {
  // datatable
  .dashboard {
    &-datatable {
      border-radius: 10px;
      overflow: hidden;

      &-mask {
        background-color: var(--black-5);
      }

      &-table-container {
        @include Scroll(10px, 10px, var(--grey-910), var(--grey-360));
        overflow-y: scroll;
      }

      &-thead {
      }

      &-body-row {
        background-color: var(--grey-1000);
        color: var(--white);
      }

      &-header {
        padding: 10px;
        background-color: var(--grey-1100);
      }
      &-virtualscroller-spacer {
        height: 1px;
      }
      &-footer {
        display: flex;
        justify-content: flex-end;
        background-color: var(--grey-1100);
        border-color: var(--grey-750);
      }
      &-header {
        display: flex;
        justify-content: space-between;
        border: 1px solid var(--grey-750);
        border-radius: 10px 10px 0 0;
        &-left,
        &-right {
          display: flex;
          gap: 10px;
        }
      }

      &-empty {
        &-cell {
          height: 260px;
        }
        &-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        &-img {
          height: 200px;
          width: min-content;
          opacity: var(--opacity-empty);
          filter: brightness(var(--brightness-empty));
        }
        &-text {
          font-size: 22px;
          line-height: 1;
          color: var(--white-3);
        }
      }
    }
  }
  .p-datatable-empty-message {
    background-color: var(--grey-1000);
  }

  // column
  .dashboard {
    &-datatable {
      &-header {
        &-cell {
          background-color: var(--blue-900);
          padding: 0;
          border-color: transparent;
          color: var(--white);

          &:focus-visible {
            outline: none;
          }
          &.p-datatable-column-sorted {
            .dashboard-datatable-column-header-content {
              background-color: var(--blue-650);
              color: var(--white);
              border-radius: 10px;
            }

            .dashboard-datatable-sort svg {
              color: #fff;
            }
          }
          &:not(:has(.dashboard-datatable-column-header-content)) {
            padding: 10px 15px;
          }
        }
      }
      &-column {
        &-header-content {
          padding: 10px 15px;
          align-items: center;
          gap: 15px;

          // sorting component
          .sort {
            order: 1;
          }
        }
        &-resizer {
        }
        &-title {
          order: 0;
        }
      }

      &-sort {
        display: flex;
        justify-content: center;
        width: 35px;
        height: 35px;
        background-color: var(--grey-980);
        border-radius: 50%;
        svg {
          color: var(--grey-40);
        }
      }
      &-filter {
        max-height: 35px;
        height: 35px;
      }
      &-filter-element-container {
        height: 100%;
      }
      &-body-cell {
        padding: 10px 15px;
        font-size: 14px;
        border-color: var(--grey-940);
      }

      &-name {
        min-width: 15rem;
      }
      &-image {
        min-width: 8rem;
      }
    }
  }

  // expansion
  .dashboard-datatable-row-expansion {
    background-color: var(--grey-1000);
  }
  .dashboard-datatable-row-expansion-cell {
    border-top: none;
    padding: 5px 16px 12px;
    border-color: var(--grey-940);
  }
  .dashboard-datatable-body-row:has(+ .dashboard-datatable-row-expansion) {
    .dashboard-datatable-body-cell {
      border: none;
    }
  }
  .dashboard-datatable-row-toggle-button {
    background: var(--grey-920);
    border-color: var(--grey-920);
    color: var(--grey-40);
  }

  // toolbar
  .filters-toolbar {
    flex-direction: column;
    .dashboard-toolbar-end {
      margin-top: 10px;
    }
  }

  // panel
  .dashboard {
    &-panel {
      margin-bottom: 10px;
      background-color: var(--grey-1000);
      &-header {
        padding: 10px 10px;
        background-color: var(--grey-1100);
        border-radius: 5px;
      }
      &-title {
        font-size: 16px;
        font-weight: 500;
        letter-spacing: 0.5px;
      }
      &-header-actions {
      }
      &-toggle-button {
      }
      &-content-container {
      }
      &-content {
        padding: 10px;
      }
      &-footer {
      }

      &-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 15px;
        row-gap: 10px;
      }

      &-item {
        border-radius: 10px;
        &-title {
          font-size: 12px;
          margin-bottom: 5px;
          color: var(--white);
          line-height: 1;
        }
      }

      .p-panel-toggle-button {
        width: 35px;
        height: 35px;
        background-color: var(--grey-930);
        box-shadow: 0 0 5px #000;
        transition: filter 0.3s;
        color: var(--grey-40);

        &:hover {
          filter: brightness(1.3);
        }

        svg {
          height: 16px;
        }
      }

      .datefilter,
      .namefilter,
      .tagsfilter,
      .categoryfilter {
        height: 35px;
      }

      .category-multiselect {
        width: 100%;
      }
      .category-multiselect-tags {
        width: 100px;
      }
      .dashboard-datepicker-inputtext {
        background-color: var(--black-3);
      }
      .dashboard-search-iconfield {
        background-color: var(--black-3);
      }
      .dashboard-filter-tags .tags__wrapper {
        background-color: var(--black-3);
      }
      .dashboard-filter-tags .tags__content {
        overflow: visible;
        width: 100px;
      }
      .dashboard-filter-tags .tags__container {
        width: 100%;
      }
      .dashboard-search-inputtext {
        width: 100%;
      }
      .category-multiselect {
        background-color: var(--black-3);
      }
    }
  }

  // checkbox
  .dashboard {
    &-checkbox {
      &-input {
        &:checked {
          & + .dashboard-checkbox-box {
            background: var(--blue-160);
            border-color: var(--blue-160);
            svg {
              color: var(--black);
            }
          }
        }
      }
      &:not(.p-disabled):has(.dashboard-checkbox-input:focus-visible)
        .dashboard-checkbox-box {
        outline: transparent;
        outline-offset: 0;
      }
      &.p-disabled {
        .dashboard-checkbox-box {
          border-color: #5d5d5d;
        }
      }
      &-box {
        background-color: var(--grey-960);
      }
      &-icon {
        stroke: #000;
        display: none;
        path {
          stroke-width: 1px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
@include Dashboard();
@include Dialog();

// btns
.new,
.delete,
.export,
.no,
.yes {
  &-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    line-height: 1;
    border-radius: 7px;
    padding: 0 10px;
    color: #000;
    font-weight: 500;
    transition: background-color 0.3s, color 0.3s, filter 0.3s;
    height: 35px;
  }
}
.new-btn,
.export-btn,
.yes-btn {
  background-color: var(--blue-350);
  &:not(:disabled):hover {
    filter: brightness(1.1);
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.delete-btn {
  color: #fff;
  border: 2px solid var(--blue-350);
  &:not(:disabled):hover {
    background-color: var(--blue-350);
    color: #000;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}

.edit {
  &-btn {
    border: 1px solid var(--border-edit);
    background-color: var(--transparent-1);
    box-shadow: 0 0 5px var(--transparent-2);
    width: 37px;
    height: 37px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
    svg {
      font-size: 14px;
      color: var(--grey-200);
    }
    &:hover {
      background-color: var(--hover-edit);
    }
  }
}

.remove {
  &-btn {
    border: 1px solid var(--border-remove);
    background-color: var(--transparent-1);
    box-shadow: 0 0 5px var(--transparent-2);
    width: 37px;
    height: 37px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;

    svg {
      font-size: 16px;
      color: var(--red-100);
    }
    &:hover {
      background-color: var(--hover-remove);
    }
  }
}

.no-btn {
  background-color: #353535;
  color: #dedede;
  &:not(:disabled):hover {
    background-color: #545454;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}

// toolbar
.dashboard {
  &-toolbar {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: var(--grey);
    border-radius: 10px;
    border: 1px solid #3b3b3b;
    &-start {
      display: flex;
      gap: 10px;
    }

    &-end {
      display: flex;
      gap: 10px;
    }
  }
}

// rating
.dashboard {
  &-rating {
    &-option {
      cursor: default;
    }
    &-on-icon {
      color: #7baee2;
      width: 15px;
      height: 15px;
    }
    &-off-icon {
      color: #6b6b6b;
    }
  }
}
// avatar
.dashboard {
  &-avatar {
    min-width: 40px;
    min-height: 40px;
  }
}

// paginator
.dashboard {
  &-paginator {
    border-radius: 0;
    &-content {
      align-items: stretch;
    }
    &-container {
    }
    &-content-start {
    }
    &-first,
    &-prev,
    &-next,
    &-last {
      border-radius: 7px;
      min-width: 30px;
    }
    &-first-icon {
    }
    &-prev {
    }
    &-prev-icon {
    }
    &-next {
    }
    &-next-icon {
    }
    &-last {
    }
    &-last-icon {
    }
    &-pages {
      margin: 0 5px;
    }
    &-page {
      border-radius: 7px;
      border: 1px solid #6b99c6;
      color: #fff;
      &.p-paginator-page-selected {
        background: #6b99c6;
        color: #000;
        font-weight: 500;
      }
      &:not(:disabled):focus-within {
        outline: none;
      }
    }
    &-current {
      font-size: 14px;
      display: flex;
      align-items: center;
    }
    &-rpp-dropdown {
    }
    &-jtp-dropdown {
    }
    &-jtp-input {
    }
    &-content-end {
      margin-left: 10px;
      align-self: stretch;
    }
  }
}

// select
.dashboard-select {
  display: flex;
  gap: 10px;
  padding: 0 15px;
  justify-content: space-between;
  align-items: center;
  background: var(--grey);
  border-radius: 5px;
  margin-left: 10px;
  height: 100%;

  &:not(:disabled):focus-within {
    border-color: #3f3f46;
    box-shadow: none;
    outline: none;
  }
  &:hover {
    background-color: #323232;
  }
  &-label {
    font-size: 14px;
    padding: 0;
  }
  &-dropdown {
    transition: transform 0.3s;
    width: min-content;
    svg {
      font-size: 12px;
    }
  }
  &-overlay {
    background-color: var(--grey);
    border-radius: 5px;
    padding: 5px;
  }
  &-listcontainer {
  }
  &-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  &-option {
    line-height: 1;
    font-size: 14px;
    cursor: pointer;
    padding: 5px;
    border-radius: 3px;
    &:hover {
      background-color: #333333;
    }
    &[data-p-selected="true"] {
      background-color: #6b99c6;
      color: #000;
      font-weight: 500;
    }
  }
  &-optionlabel {
  }
}
.p-select-open {
  .dashboard-select-dropdown {
    transform: rotate(180deg);
  }
}

// radiobutton
.post-dialog {
  &-radiobutton {
    width: 20px;
    height: 20px;
    display: flex;
    position: relative;
    &.is-invalid {
      .post-dialog-radiobutton-box {
        @include Invalid();
      }
    }
    &:hover:not(:has(input:checked)) {
      .post-dialog-radiobutton-box {
        border-color: var(--grey-370);
      }
    }
    &-input {
      cursor: pointer;
      appearance: none;
      position: absolute;
      inset: 0;
      z-index: 1;
      &:checked {
        & + .post-dialog-radiobutton-box {
          border-color: var(--blue-2);
          .post-dialog-radiobutton-icon {
            background-color: var(--blue-2);
            transform: translateZ(0) scale(1);
          }
        }
      }
    }
    &-box {
      border: 2px solid var(--grey-730);
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.3s;
      background-color: var(--black-3);
    }
    &-icon {
      width: 10px;
      height: 10px;
      background-color: transparent;
      border-radius: 50%;
      transition: transform 0.3s;
      transform: translateZ(0) scale(0.1);
    }
    &.p-radiobutton-checked {
    }
  }
}

// delete dialog
// result dialog
.dashboard {
  &-dialog {
    background-color: var(--grey-990);
    border-radius: 10px;
    border: 1px solid #525252;
    overflow-y: auto;
    overflow-x: hidden;
    @include Scroll(10px, 10px, var(--grey-910), var(--grey-360));

    &-container {
      padding: 20px;
    }
    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      color: var(--white);
    }
    &-title {
      font-size: 20px;
      font-weight: 600;
    }
    &-header-actions {
      display: flex;
      gap: 10px;

      button {
        transition: background-color 0.3s;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          display: flex;
          align-items: center;
        }
        &:hover {
          background-color: var(--action-hover);
        }
      }
    }
    &-footer {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 15px;
    }
    &-mask {
      background-color: #00000071;
      z-index: 1500 !important;
    }
  }
}
</style>
