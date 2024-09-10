<template>
  <div v-if="!errorPosts" class="dashboard">
    <h1 class="dashboard-title">Post management</h1>

    <Toolbar :pt="getClasses('dashboard').toolbar" unstyled>
      <template #start>
        <Button @click="openNew" :pt="getClasses('new').button" unstyled>
          <span class="new-btn-label">New</span>
          <i-fluent:add-16-filled />
        </Button>
        <Button
          @click="confirmDeleteSelected"
          :disabled="!selectedPosts || !selectedPosts.length"
          :pt="getClasses('delete').button"
          unstyled
        >
          <span class="delete-btn-label">Delete</span>
          <i-mi:delete />
        </Button>
      </template>

      <template #end>
        <Button
          @click="exportCSV($event)"
          :pt="getClasses('export').button"
          unstyled
          ><i-ph:export-bold />
          <span class="export-btn-label">Export</span>
        </Button>
      </template>
    </Toolbar>

    <DataTable
      ref="dt"
      v-model:selection="selectedPosts"
      :value="posts?.slice(0, rowsPerPage)"
      dataKey="id"
      v-model:filters="filters"
      filterDisplay="row"
      :loading="loadingPosts"
      :pt="getClasses('dashboard').datatable"
    >
      <Column
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
        field="date"
        header="Date"
        :showFilterMenu="false"
        style="min-width: 12rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #header
          ><Sort
            v-model="sortOrders.date"
            field="date"
            @sort="(value) => sortingPosts(value)"
        /></template>
        <template #body="{ data }">
          {{ formattedDate(data.date) }}
        </template>
        <template #filter>
          <DatePicker
            v-model="filterDate"
            date-format="dd.mm.y"
            show-icon
            fluid
            :show-on-focus="false"
            :manual-input="false"
            :min-date="minDate"
            :max-date="maxDate"
            showButtonBar
            selection-mode="range"
            @date-select="dateSelect"
            @clear-click="dateSelect"
            placeholder="Select date"
            :pt="{
              ...getClasses('dashboard').datepicker,
              pcInput: getClasses('dashboard-datepicker').inputtext,
            }"
          />
        </template>
      </Column>
      <Column
        field="name"
        header="Title"
        :showFilterMenu="false"
        style="min-width: 15rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <p class="dashboard-table-name">
            {{ data.name }}
          </p>
        </template>
        <template #header
          ><Sort
            v-model="sortOrders.name"
            field="name"
            @sort="(value) => sortingPosts(value)"
        /></template>
        <template #filter>
          <IconField :pt="getClasses('dashboard-search').iconfield" unstyled>
            <InputIcon :pt="getClasses('dashboard-search').inputicon" unstyled>
              <i-octicon:search-16 />
            </InputIcon>
            <InputText
              v-model="searchByName"
              type="text"
              placeholder="Search..."
              @update:modelValue="onInputName"
              :pt="getClasses('dashboard-search').inputtext"
              unstyled
            />
          </IconField>
        </template>
      </Column>
      <Column
        header="Image"
        style="min-width: 8rem"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <div class="dashboard-table-img">
            <Image
              :id="data.id"
              :name="data.image"
              :url="images[data.id]?.url"
              style="width: 80px"
            />
          </div>
        </template>
      </Column>
      <Column
        field="tags"
        header="Tags"
        :showFilterMenu="false"
        style="min-width: 12rem; max-width: 12rem"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <TagsTable :tags="data.tags" />
        </template>
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #filter>
          <Tags
            class="dashboard-filter-tags"
            v-model="filterTags"
            class-select="dashboard-filter"
            :limit-tags="5"
            placeholder="Select a tag..."
            @update:modelValue="moveFirstPage"
          />
        </template>
      </Column>
      <Column
        field="category"
        header="Category"
        :showFilterMenu="false"
        style="min-width: 8rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <Tag
            :value="data.category"
            :style="{
              backgroundColor:
                colorsTags[data.category.toLowerCase()].colorBack,
              color: colorsTags[data.category.toLowerCase()].color,
            }"
          />
        </template>
        <template #filter>
          <MultiSelect
            v-model="filterCategory"
            :options="categories"
            placeholder="Not selected"
            :pt="{
              ...getClasses('category').multiselect,
              pcHeaderCheckbox: { ...getClasses('dashboard').checkbox },
              pcOptionCheckbox: { ...getClasses('dashboard').checkbox },
            }"
            @update:modelValue="moveFirstPage"
          >
            <template #value="{ value, placeholder }">
              <p v-if="!value.length" class="category-multiselect-placeholder">
                {{ placeholder }}
              </p>
              <div class="category-multiselect-tags" v-auto-animate>
                <Tag
                  class="category-multiselect-tag"
                  v-for="item in value"
                  :key="item"
                  :value="item"
                  :style="{
                    backgroundColor: colorsTags[item.toLowerCase()].colorBack,
                    color: colorsTags[item.toLowerCase()].color,
                  }"
                />
              </div>
            </template>
          </MultiSelect>
        </template>
      </Column>
      <Column
        field="rating"
        header="Rating"
        style="min-width: 9rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <Rating
            :modelValue="data.rating"
            :readonly="true"
            :cancel="false"
            :pt="getClasses('dashboard').rating"
          />
        </template>
        <template #header
          ><Sort
            v-model="sortOrders.rating"
            field="rating"
            @sort="(value) => sortingPosts(value)"
        /></template>
      </Column>
      <Column
        field="time"
        header="Time"
        style="min-width: 7rem"
        :pt="getClasses('dashboard').column"
      >
        <template #sorticon="{ sorted, sortOrder }">
          <i-fluent:arrow-sort-up-lines-20-filled
            v-if="sorted && sortOrder === 1"
          />
          <i-fluent:arrow-sort-down-lines-20-filled
            v-else-if="sorted && sortOrder !== 1"
          />
          <i-fluent:arrow-sort-20-filled v-else />
        </template>
        <template #body="{ data }">
          <Tag
            :value="`${getTimeReading(data.time)} min`"
            :severity="getColorLabel(data.time)"
          />
        </template>
        <template #header
          ><Sort
            v-model="sortOrders.time"
            field="time"
            @sort="(value) => sortingPosts(value)"
        /></template>
      </Column>
      <Column
        :exportable="false"
        style="min-width: 8rem"
        :pt="getClasses('dashboard').column"
      >
        <template #body="{ data }">
          <div class="dashboard-table-controls">
            <Button
              @click="editPost(data)"
              :pt="getClasses('edit').button"
              unstyled
              ><i-lucide:edit
            /></Button>
            <Button
              @click="confirmDeletePost(data)"
              :pt="getClasses('remove').button"
              unstyled
              ><i-mi:delete
            /></Button>
          </div>
        </template>
      </Column>

      <template #empty> No posts found. </template>

      <template #footer>
        <Paginator
          v-model="currentPage"
          :length="posts.length"
          :rowsPerPage="rowsPerPage"
          @prev="onClickPrev()"
          @next="onClickNext()"
        />
        <!-- v-if="posts.length >= startRowsPerPage" -->
        <!-- :options="[...getOptions(posts.length)]" -->
        <Select
          v-model="rowsPerPage"
          :options="[5, 10]"
          :pt="getClasses('dashboard').select"
          @update:modelValue="(value) => onSelectRows(value)"
        />
      </template>
    </DataTable>
  </div>

  <Error
    v-else
    :message="errorCodes.database[errorPosts.code]"
    retry
    @to-back="onToBack"
    @retry="onErrorHandler"
  />

  <PostDialog v-model:visible="postDialog" :post="post" />

  <DeleteDialog v-model:visible="deletePostDialog" :post="post" />

  <DeletePostsDialog
    v-model:visible="deletePostsDialog"
    v-model:selected="selectedPosts"
  />
</template>

<script setup>
import { ref, watch, computed, nextTick, onUnmounted } from "vue";
import { FilterMatchMode, FilterService } from "@primevue/core/api";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import { getClasses } from "@/utils/classes";
import router from "@/router/router";
import { errorCodes } from "@/utils/errors";
import { useServerStore } from "@/stores/server";
import { useCollection } from "vuefire";
import { postsRef, db } from "@/server/firebase.config";
import {
  collection,
  where,
  query,
  getDocs,
  orderBy,
  limit,
  limitToLast,
  startAt,
  startAfter,
  endAt,
  endBefore,
  getDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getCurrentInstance } from "vue";

const serverStore = useServerStore();
const dt = ref();
const images = ref([]);
const post = ref({});
const selectedPosts = ref();
const deletePostDialog = ref(false);
const deletePostsDialog = ref(false);
const postDialog = ref(false);

const startRowsPerPage = 5;
let oldRowsPerPage = 5;
const rowsPerPage = ref(5);
const totalPosts = ref(0);
const keyLastPost = ref({ key: "", value: "" });
const keyFirstPost = ref({ key: "", value: "" });
const currentPage = ref(1);
let dir = "next";
const sort = ref("category");

watch(
  () => serverStore.urls,
  (newvalue) => {
    console.log(newvalue);
  },
  { deep: true }
);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  category: { value: null },
});

// categories
const categories = ref(["Weather", "Nature", "Animals", "Auto", "Science"]);
const filterCategory = ref(categories.value);
const filterTags = ref([]);
const filterDate = ref();
const minDate = ref(new Date());
const maxDate = ref(new Date());
const searchByName = ref("");
const sortOrders = ref({
  date: -1,
  name: null,
  rating: null,
  time: null,
});
const currentSortOrder = ref({ sortField: "date", sortOrder: -1 });
const test = ref([]);
const datesLimit = ref();

// loading images
// promise.value.then((res) => {
//   // images (url, loading, error)
//   // posts.value.forEach((post) => {
//   //   images.value[post.id] = { url: post.image, loading: false, error: null };
//   // });
//   // listeners
// });

// dates limit (filter)
const getDates = (filterDate) => {
  let startDate, endDate;
  const curDate = new Date();
  let yearBeforeDate = new Date(curDate).setFullYear(curDate.getFullYear() - 1);
  let futureDate = new Date(curDate).setMonth(curDate.getMonth() + 1);

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
    curDate,
    futureDate,
    yearBeforeDate,
  };
};
datesLimit.value = { ...getDates() };

const postsQuery = computed(() => {
  // sorting
  let sortDirection = "asc";
  if (currentSortOrder.value.sortOrder === -1) {
    sortDirection = "desc";
  } else if (currentSortOrder.value.sortOrder === 1) {
    sortDirection = "asc";
  } else if (currentSortOrder.value.sortOrder === null) {
    currentSortOrder.value.sortField = "date";
    sortDirection = "asc";
  }

  // pagination
  let dirPagination;
  if (dir === "next") {
    dirPagination = startAt(...test.value);
  } else {
    dirPagination = endAt(...test.value);
  }

  return query(
    postsRef,
    filterCategory.value.length
      ? where("category", "in", filterCategory.value)
      : where("category", "==", null),
    where("name", ">=", searchByName.value),
    where("name", "<=", searchByName.value + "\uf8ff"),
    datesLimit.value.startDate
      ? where("date", ">=", datesLimit.value.startDate)
      : where("date", ">=", datesLimit.value.yearBeforeDate),
    datesLimit.value.endDate
      ? where("date", "<=", datesLimit.value.endDate)
      : where("date", "<=", datesLimit.value.futureDate),
    filterTags.value.length
      ? where("tags", "array-contains-any", filterTags.value)
      : where("tags", "!=", null),
    orderBy(currentSortOrder.value.sortField, sortDirection),
    orderBy("id"),
    dir === "next"
      ? limit(rowsPerPage.value + 1)
      : limitToLast(rowsPerPage.value + 1),
    test.value.length === 2
      ? dirPagination
      : currentSortOrder.value.sortOrder !== -1
      ? startAt(null)
      : endAt(null)
  );
});

// const {
//   data: posts,
//   pending: loadingPosts,
//   error,
//   promise,
// } = useCollection(postsQuery);

const posts = ref([]);
const errorPosts = ref();
const loadingPosts = ref(false);

// первая загрузка 
const getPosts = async () => {
  loadingPosts.value = true;
  try {
    const querySnapshot = await getDocs(postsQuery.value);
    querySnapshot.forEach((doc) => {
      posts.value.push(doc.data());
    })
  } catch (err) {
    errorPosts.value = err;
  } finally {
    loadingPosts.value = false;
  }
}
getPosts();

// подписка на изменения
let unsubscribe;
const startListening = () => {
  unsubscribe = onSnapshot(
    postsQuery.value,
    { includeMetadataChanges: true, source: "cache" },
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const { newIndex, oldIndex, doc, type } = change;
        if (type === "added") {
          posts.value.splice(newIndex, 0, doc.data());
        } else if (type === "modified") {
          posts.value.splice(oldIndex, 1);
          posts.value.splice(newIndex, 0, doc.data());
        } else if (type === "removed") {
          posts.value.splice(oldIndex, 1);
        }
      });
    },
    (error) => {
      errorPosts.value = error;
      unsubscribe = null;
    } 
  );
}
startListening();

// отсоединение слушателя
const stopListening = () => {
  if(unsubscribe) {
    unsubscribe();
  }
}
onUnmounted(() => {
  stopListening();
});

// обработка ошибок
const onErrorHandler = () => {
  errorPosts.value = null;
  if(!unsubscribe) {
    startListening();
  }
  if(!posts.value.length) {
    getPosts();
  }
}

// get image
const getImage = (id, name) => {
  // if (!images.value[id]) {
  //   images.value[id] = { url: name, loading: false, error: null };
  // }
  // images.value[id].loading = true;
  // images.value[id].error = null;
  // loadImage(name)
  //   .then((url) => {
  //     // images.value[id].url = url;
  //   })
  //   .catch((err) => {
  //     // images.value[id].error = JSON.parse(err.message);
  //   })
  //   .finally(() => {
  //     // images.value[id].loading = false;
  //   });
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
  weather: { color: "#77c9f1", colorBack: "#162e3c" },
  nature: { color: "#77b56f", colorBack: "#16352c" },
  animals: { color: "#77a4c9", colorBack: "#163547" },
  auto: { color: "#778ac9", colorBack: "#16274e" },
  science: { color: "#77c981", colorBack: "#16392c" },
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

const editPost = (prod) => {
  post.value = { ...prod };
  postDialog.value = true;
};

// delete one
const confirmDeletePost = (prod) => {
  post.value = prod;
  deletePostDialog.value = true;
};

// delete selected
const confirmDeleteSelected = () => {
  deletePostsDialog.value = true;
};

// error
const onToBack = () => {
  router.go(-1);
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

// datepicker
const setMinMaxDate = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const startMonth = month;
  const startYear = year - 1;
  const endMonth = month;
  const endYear = year;

  minDate.value.setMonth(startMonth);
  minDate.value.setFullYear(startYear);
  maxDate.value.setMonth(endMonth);
  maxDate.value.setFullYear(endYear);
};
setMinMaxDate();

// sorting
const sortingPosts = (value) => {
  for (let key in sortOrders.value) {
    if (key !== value.sortField) {
      sortOrders.value[key] = null;
    }
  }
  currentSortOrder.value = value;

  moveFirstPage();
};

// count rows per page (for select)
const getOptions = (countPosts) => {
  if (countPosts > startRowsPerPage * 2) {
    return [startRowsPerPage, startRowsPerPage * 2, startRowsPerPage * 3];
  } else {
    return [startRowsPerPage, startRowsPerPage * 2];
  }
};

const onSelectRows = (newRowsPerPage) => {
  const countPosts =
    (currentPage.value - 1) * oldRowsPerPage +
    Math.min(posts.value.length, oldRowsPerPage);
  const remainder = countPosts % newRowsPerPage;

  // увеличение количества строк
  if (newRowsPerPage > oldRowsPerPage) {
    // в начало предыдущей страницы
    if (remainder > oldRowsPerPage || remainder === 0) {
      dir = "prev";
      keyFirstPost.value = {
        key: posts.value[0].id,
        value: posts.value[0][sort.value],
      };
      nextTick(() => {
        dir = "next";
        oldRowsPerPage = newRowsPerPage;
        keyLastPost.value = {
          key: posts.value[0].id,
          value: posts.value[0][sort.value],
        };
      });
    }
    // в начало текущей страницы
    if (remainder <= oldRowsPerPage && remainder > 0) {
      oldRowsPerPage = newRowsPerPage;
      dir = "next";
      keyLastPost.value = {
        key: posts.value[0].id,
        value: posts.value[0][sort.value],
      };
    }

    // change current page
    const beforePages = countPosts / newRowsPerPage;
    currentPage.value = Math.ceil(beforePages);
  }
  // уменьшение количества строк
  if (newRowsPerPage < oldRowsPerPage) {
    // в начало текущей страницы
    oldRowsPerPage = newRowsPerPage;
    dir = "next";
    keyLastPost.value = {
      key: posts.value[0].id,
      value: posts.value[0][sort.value],
    };

    // change current page
    const integerPages = Math.trunc(countPosts / newRowsPerPage);
    if (remainder === 0) {
      currentPage.value = integerPages - 1;
    }
    if (remainder > newRowsPerPage) {
      currentPage.value = integerPages;
    }
    if (remainder <= newRowsPerPage && remainder > 0) {
      currentPage.value = integerPages + 1;
    }
  }
};

// event change page
const onClickPrev = () => {
  dir = "prev";

  // if (currentPage.value === 1) {
  //   dir = "next";
  //   test.value = [];
  // } else {
  test.value = [
    posts.value[0][currentSortOrder.value.sortField],
    posts.value[0].id,
  ];
  // }
};

const onClickNext = () => {
  dir = "next";

  test.value = [
    posts.value[posts.value.length - 1][currentSortOrder.value.sortField],
    posts.value[posts.value.length - 1].id,
  ];
};

// при поиске возврат на первую страницу
const onInputName = () => {
  moveFirstPage();
};

// при выборе даты возврат на первую страницу
const dateSelect = () => {
  moveFirstPage();

  // вычисление дат для границ
  datesLimit.value = getDates(filterDate.value);
};

// первая страница
const moveFirstPage = () => {
  dir = "next";

  test.value = [];

  currentPage.value = 1;
};
</script>

<style lang="scss" scoped>
.dashboard {
  width: 100%;
  color: #e2e2e2;
  display: flex;
  flex-direction: column;
}
.dashboard-title {
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
    border-radius: 5px;
    overflow: hidden;
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
</style>

<style lang="scss">
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
    transition: background-color 0.3s, color 0.3s;
    height: 35px;
  }
}
.new-btn,
.export-btn,
.yes-btn {
  background-color: #7b9dcf;
  &:not(:disabled):hover {
    background-color: #a9caff;
  }
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
}

.delete-btn {
  color: #fff;
  border: 2px solid #7b9dcf;
  &:not(:disabled):hover {
    background-color: #7b9dcf;
    color: #000;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}

.edit {
  &-btn {
    border: 1px solid #3d404e;
    width: 37px;
    height: 37px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;
    svg {
      font-size: 14px;
      color: #c8c8c8;
    }
    &:hover {
      background-color: #3d404e66;
    }
  }
}

.remove {
  &-btn {
    border: 1px solid #af1313;
    width: 37px;
    height: 37px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.3s;

    svg {
      font-size: 16px;
      color: #ff7e7e;
    }
    &:hover {
      background-color: #4d262673;
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
    background-color: $grey;
    border-radius: 10px;
    border: 1px solid #3b3b3b;
    &-start {
      display: flex;
      gap: 10px;
    }

    &-end {
    }
  }
}

// search
.dashboard-search {
  &-iconfield {
    display: flex;
    align-items: center;
    background-color: #18181b;
    border-radius: 6px;
    gap: 10px;
    padding: 0 10px;
    height: 100%;
    border: 1px solid #52525b;
  }
  &-inputicon {
    font-size: 14px;
    line-height: 1;
  }
  &-inputtext {
    line-height: 1;
    color: #fff;
    font-size: 14px;
    &::placeholder {
      color: #959595;
    }
  }
}

// datatable
.dashboard {
  &-datatable {
    &-table-container {
      @include Scroll(10px, 10px, #333333, #7d7d7d);
    }

    &-mask {
    }
    &-loading-icon {
    }
    &-header {
      padding: 10px;
    }
    &-paginator {
    }
    &-virtualscroller {
    }
    &-virtualscroller-spacer {
    }
    &-footer {
    }
    &-tbody {
    }
    &-row-group-header {
    }
    &-row-group-header-cell {
    }

    &-body {
      &-row {
      }
    }
    &-row-expansion {
    }
    &-row-expansion-cell {
    }
    &-row-group-footer {
    }
    &-row-group-footer-cell {
    }
    &-empty-message {
    }
    &-empty-message-cell {
    }
    &-tfoot {
    }
    &-footer-row {
    }
    &-column-resize-indicator {
    }
    &-row-reorder-indicator-up {
    }
    &-row-reorder-indicator-down {
    }
    &-column-group {
    }
    &-row {
    }
    &-column {
    }
  }
}

// column
.dashboard {
  &-datatable {
    &-header {
      &-cell {
        background-color: #3c4a60af;
        padding: 10px 15px;
        &:focus-visible {
          outline: none;
        }
        &.p-datatable-column-sorted {
          background-color: #45617d;
          svg {
            color: #fff;
          }
        }
        // sorting component
        &:has(.sort--active) {
          // background-color: #45617d;
          // svg {
          //   color: #fff;
          // }
        }
      }
    }
    &-column {
      &-header-content {
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
      svg {
        color: #b0b0b0;
      }
      &-icon {
      }
      &-badge {
      }
    }
    &-filter {
      max-height: 35px;
      height: 35px;
    }
    &-filter-element-container {
      height: 100%;
    }
    &-column-filter-button {
    }
    &-filter-menu-icon {
    }
    &-column-filter-clear-button {
    }
    &-filter-clear-icon {
    }
    &-filter-overlay {
    }
    &-filter-constraint-list {
    }
    &-filter-constraint {
    }
    &-filter-constraint-separator {
    }
    &-filter-operator {
    }
    &-filter-operator-dropdown {
    }
    &-filter-rule-list {
    }
    &-filter-rule {
    }
    &-filter-constraint-dropdown {
    }
    &-filter-remove {
    }
    &-filter-remove-rule-button {
    }
    &-filter-add-button-container {
    }
    &-filter-add-rule-button {
    }
    &-filter-buttonbar {
    }
    &-filter-clear-button {
    }
    &-filter-apply-button {
    }
    &-row-toggle-button {
    }
    &-row-toggle-icon {
    }
    &-body-cell {
      padding: 10px 15px;
      font-size: 14px;
      &-content {
      }
    }
    &-reorderable-row-handle {
    }
    &-row-radiobutton {
    }
    &-row-checkbox {
    }
    &-row-editor-init {
    }
    &-row-editor-save {
    }
    &-row-editor-cancel {
    }
    &-footer-cell {
    }
    &-column-footer {
    }
  }
}

// checkbox
.dashboard {
  &-checkbox {
    &-input {
      &:checked {
        & + .dashboard-checkbox-box {
          background: #6b99c6;
          border-color: #6b99c6;
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
  background: $grey;
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
    background-color: $grey;
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
        border-color: #8b8b8b;
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
          border-color: $blue;
          .post-dialog-radiobutton-icon {
            background-color: $blue;
            transform: translateZ(0) scale(1);
          }
        }
      }
    }
    &-box {
      border: 2px solid #52525b;
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: border-color 0.3s;
      background-color: #000;
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
    background-color: $grey;
    border-radius: 10px;
    border: 1px solid #525252;
    overflow-y: auto;
    overflow-x: hidden;
    @include Scroll(10px, 10px, #333333, #7d7d7d);

    &-container {
      padding: 20px;
    }
    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
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
          background-color: #444444;
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
    }
  }
}

// multiselect
.category {
  &-multiselect {
    width: 180px;
    height: 100%;
    background-color: #18181b;
    border-color: #52525b;
    &:not(:disabled):focus-within {
      border-color: #3f3f46;
      box-shadow: none;
      outline: none;
    }
    &.p-multiselect-open {
      .category-multiselect-dropdown-icon {
        transform: rotate(180deg);
      }
    }
    &-placeholder {
      padding: 0 5px;
    }
    &-label-container {
    }
    &-label {
      padding: 5px;
      font-size: 14px;
      height: 100%;
      overflow: hidden;
    }
    &-dropdown {
      width: 30px;
    }
    &-loading-icon {
    }
    &-dropdown-icon {
      width: 10px;
      transition: transform 0.3s;
    }
    &-overlay {
    }
    &-header {
    }
    &-header-checkbox {
    }
    &-filter-container {
    }
    &-filter {
    }
    &-filter-icon-container {
    }
    &-filter-icon {
    }
    &-list-container {
    }
    &-virtualscroller {
    }
    &-list {
    }
    &-option-group {
    }
    &-option {
      padding: 8px;
      gap: 10px;
    }
    &-option-label {
      font-size: 14px;
    }
    &-option-checkbox {
    }
    &-empty-message {
    }
    &-hidden-input-container {
    }
    &-hidden-input {
    }
    &-hidden-first-focusable-el {
    }
    &-hidden-filter-result {
    }
    &-hidden-selected-message {
    }
    &-hidden-last-focusable-el {
    }
    &-tags {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    &-tag {
      height: 100%;
      font-size: 14px;
      font-weight: 600;
      padding: 5px 10px;
      line-height: 1;
    }
  }
}

// tags select
.dashboard-filter {
  &.select-wrapper {
    z-index: 999;
  }
  .tags-header {
    flex-direction: column;
    padding: 7px 7px 10px;
    gap: 5px;
  }
  .tags-iconfield {
    padding: 0 8px;
    height: 35px;
    font-size: 14px;
    border-radius: 5px;
  }
  .tags-inputtext {
    width: 100%;
  }
  .tags-inputicon {
    padding: 0 0 0 7px;
  }
  .tags-header-btn {
    height: 30px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 14px;
  }
  .tags-body {
    @include Scroll(7px, 7px, #333333, #7d7d7d);
  }
  .tags__list-group-label {
    font-size: 15px;
  }
  .tags__list-item-text {
    font-size: 13px;
    @include TextOverflow(2);
  }
  .tags__footer {
    padding: 5px 10px;
  }
  .tags-empty {
    padding: 5px 10px;
    font-size: 14px;
  }
  .tags-input-wrapper {
    flex-direction: column;
    gap: 5px;
  }
  .error {
    position: static;
    font-size: 11px;
  }
}

// tags container
.dashboard-filter-tags {
  height: 100%;
  .tags__wrapper {
    min-height: auto;
    height: 100%;
    background-color: #18181b;
    color: #a1a1aa;
    padding: 5px 0 5px 5px;
  }
  .tags-placeholder {
    font-size: 14px;
    padding-left: 5px;
  }
  .tags-arrow {
    width: 30px;
    padding: 0 10px;
  }
  .tags__content {
    gap: 5px;
    flex-wrap: nowrap;
    overflow: hidden;
  }
  .chip {
    gap: 6px;
    border-radius: 5px;
    padding: 0 5px 0 8px;
    height: 100%;
    svg {
      font-size: 12px;
    }
  }
  .chip-label {
    font-size: 14px;
  }
}

// datepicker
.dashboard {
  &-datepicker {
    height: 100%;
    &-inputtext {
      border-color: #52525b;
      background-color: #18181b;
      font-size: 13px;
      overflow: visible;
      padding: 10px;
      &::placeholder {
        color: #a1a1aa;
        font-size: 14px;
      }
    }
    &-dropdown {
      border-color: #52525b;
    }
    &-dropdown-icon {
    }
    &-input-icon-container {
    }
    &-input-icon {
    }
    &-panel {
    }
    &-calendar-container {
    }
    &-calendar {
    }
    &-header {
    }
    &-prev-button {
    }
    &-title {
    }
    &-select-month {
    }
    &-select-year {
    }
    &-decade {
    }
    &-day-view {
    }
    &-next-button {
    }
    &-container {
    }
    &-table {
    }
    &-tableheader {
    }
    &-tableheader-row {
    }
    &-weekheader {
    }
    &-weekheader-label {
    }
    &-tableheader-cell {
    }
    &-weekday-cell {
    }
    &-weekday {
    }
    &-table-body {
    }
    &-table-body-row {
    }
    &-weeknumber {
    }
    &-weeklabel-container {
    }
    &-day-cell {
    }
    &-day {
      &.p-datepicker-day-selected {
        background-color: $blue;
      }
      &.p-datepicker-day-selected-range {
        background: $blue;
        filter: brightness(0.5);
        color: $black;
      }
    }
    &-month-view {
    }
    &-month {
      &.p-datepicker-month-selected {
        background: $blue;
      }
    }
    &-year-view {
    }
    &-year {
      &.p-datepicker-year-selected {
        background: $blue;
      }
    }
    &-time-picker {
    }
    &-hour-picker {
    }
    &-hour {
    }
    &-separator-container {
    }
    &-separator {
    }
    &-minute-picker {
    }
    &-minute {
    }
    &-second-picker {
    }
    &-second {
    }
    &-ampm-picker {
    }
    &-ampm {
    }
    &-buttonbar {
    }
    &-increment-button {
    }
    &-decrement-button {
    }
    &-today-button {
    }
    &-clear-button {
    }
    &-hidden-selectedday {
    }
    &-hidden-month {
    }
    &-hidden-year {
    }
  }
}
</style>
