<template>
  <FilterModal v-model="showModal" @apply-filters="applyFilters" />
  <div class="container">
    <div class="search-tab">
      <div class="tabs">
        <div
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['tab', { active: activeTab === index }]"
          @click="activeTab = index"
        >
          {{ tab }}
        </div>
      </div>
      <div class="search-container">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="search-input"
          />
          <button class="search-button">
            <ISearch class="search-icon" />
          </button>
        </div>
        <button class="filter-btn" @click="showModal = true">
          Filter
          <IFilter :fontControlled="false" style="width: 8px; height: 8px" />
        </button>
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="header.key" class="table-header">
              <div
                class="header-content"
                :class="{ 'non-clickable': index === 0 }"
                @click="index !== 0 ? sortBy(header.key) : null"
              >
                <p class="header-label base__font">{{ header.label }}</p>
                <span v-if="index !== 0" class="sort-icon">
                  <ISort
                    class="ISort"
                    style="width: 16px; height: 16px"
                    :fontControlled="false"
                  />
                </span>
              </div>
            </th>

            <th class="table-header actions-header"></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="`loading-${i}`" class="table-row">
              <td
                v-for="(header, index) in headers"
                :key="`loading-cell-${index}`"
                class="table-cell"
              >
                <div class="loading-placeholder"></div>
              </td>
              <td class="table-cell actions-cell">
                <div class="loading-placeholder-small"></div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(item, index) in filteredAndSortedData"
              :key="index"
              class="table-row"
            >
              <td class="table-cell">
                {{ formatName(item.full_name) }}
              </td>
              <td class="table-cell">
                {{ item.message_sent.toLocaleString() }}
              </td>
              <td class="table-cell">
                {{ formatStorageSize(item.media_storage_used) }}
              </td>
              <td class="table-cell">
                {{ formatDate(item.date_created) }}
              </td>
              <td class="table-cell">
                {{ item.media_sent.toLocaleString() }}
              </td>
              <td class="table-cell actions-cell">
                <div class="dropdown-container">
                  <button class="action-button" @click.stop="toggleDropdown(index)">
                    <IThreedots />
                  </button>
                  <div
                    v-show="activeDropdown === index"
                    class="dropdown-menu"
                    :class="{
                      'dropdown-menu-active': activeDropdown === index,
                      'dropdown-menu-up': index >= sortedData.length - 2,
                    }">
                    <div class="dropdown-item" @click="viewItem(item)">
                      <IEye
                        class="IEye"
                        :fontControlled="false"
                        style="width: 16px; height: 16px"
                      />
                      View
                    </div>
                    <div class="dropdown-item" @click="disableItem(item)">
                      <IFixcircle
                        class="IFixcircle"
                        :fontControlled="false"
                        style="width: 16px; height: 16px"
                      />
                      Disable
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && filteredAndSortedData.length === 0">
              <td colspan="6" class="empty-cell">No data found</td>
            </tr>
          </template>
        </tbody>
      </table>
      <div class="pagination">
        <nav class="pagination-nav">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="!hasPrevPage || loading"
            :class="['pagination-button', { disabled: !hasPrevPage || loading }]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              :class="{ 'disabled-icon': !hasPrevPage || loading }"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="pagination-icon"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <button
            v-for="page in displayedPages"
            :key="page"
            @click="goToPage(page)"
            :disabled="loading"
            :class="[
              'pagination-number',
              { active: currentPage === page, disabled: loading },
            ]"
          >
            {{ page }}
          </button>

          <span v-if="showEllipsis" class="pagination-ellipsis">...</span>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="!hasNextPage || loading"
            :class="['pagination-button', { disabled: !hasNextPage || loading }]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              :class="{ 'disabled-icon': !hasNextPage || loading }"
              class="pagination-icon"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { ISearch, IThreedots, ISort, IEye, IFixcircle, IFilter } from "~/components/svg";
import { formatName, formatStorageSize, formatDate } from "~/utils/utils.ts";
import axios from "axios";

const route = useRoute();
const router = useRouter();

interface MessageData {
  full_name: string;
  message_sent: number;
  media_storage_used: number;
  date_created: string;
  media_sent: number;
}

interface ApiResponse {
  data: MessageData[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface TableHeader {
  key: string;
  label: string;
}

const showModal = ref(false);
const tabs = ref(["Direct Messages", "Groups"]);
const filterCriteria = ref<any>(null);
const activeTab = ref(0);
const data = ref<MessageData[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(parseInt(route.query.page as string) || 1);
const totalPages = ref(0);
const hasPrevPage = ref(false);
const hasNextPage = ref(false);
const searchQuery = ref("");
const sortColumn = ref((route.query.sort as string) || "date_created");
const sortDirection = ref<"asc" | "desc">(
  (route.query.order as "asc" | "desc") || "desc"
);
const limit = ref(5);
const activeDropdown = ref<number | null>(null);
const headers = ref<TableHeader[]>([
  { key: "full_name", label: "USERS" },
  { key: "message_sent", label: "MESSAGES SENT" },
  { key: "media_storage_used", label: "MEDIA STORAGE USED" },
  { key: "date_created", label: "DATE CREATED" },
  { key: "media_sent", label: "MEDIA SENT" },
]);

function toggleDropdown(index: number){
  if (activeDropdown.value === index) {
    activeDropdown.value = null;
  } else {
    activeDropdown.value = index;
  }
};

function closeDropdown(){
  activeDropdown.value = null;
};

function handleClickOutside(event: MouseEvent){
  if (activeDropdown.value !== null) {
    const dropdowns = document.querySelectorAll(".dropdown-container");
    let clickedInside = false;
    dropdowns.forEach((dropdown) => {
      if (dropdown.contains(event.target as Node)) {
        clickedInside = true;
      }
    });
    if (!clickedInside) {
      closeDropdown();
    }
  }
};

function viewItem(item: MessageData){
  closeDropdown();
};

function disableItem(item: MessageData){
  closeDropdown();
};

function applyFilters(filters: any) {
  console.log(filters);
  filterCriteria.value = filters;
}

function updateUrlParams() {
  router.push({
    query: {
      page: currentPage.value,
      sort: sortColumn.value,
      order: sortDirection.value,
    },
  });
};

function sortBy(column: string){
  if (loading.value) return;
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortColumn.value = column;
    sortDirection.value = "desc";
  }
  updateUrlParams();
};

function goToPage (page: number) {
  if (page < 1 || page > totalPages.value || loading.value) return;
  currentPage.value = page;
  updateUrlParams();
};

async function fetchData(){
  loading.value = true;
  data.value = [];
  error.value = null;
  try {
    const response = await axios.get<ApiResponse>(
      `https://sfe-m3if.onrender.com/api/v1/messages?page=${currentPage.value}&limit=${limit.value}`
    );
    data.value = response.data.data;
    totalPages.value = response.data.totalPages;
    hasPrevPage.value = response.data.hasPrevPage;
    hasNextPage.value = response.data.hasNextPage;
  } catch (err) {
    error.value = "Failed to fetch data";
    console.error(err);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 600);
  }
};

const filteredData = computed(() => {
  if (!searchQuery.value) return data.value;
  const query = searchQuery.value.toLowerCase();
  return data.value.filter((item) => {
    return (
      item.full_name.toLowerCase().includes(query) ||
      item.message_sent.toString().includes(query) ||
      formatStorageSize(item.media_storage_used).toLowerCase().includes(query) ||
      formatDate(item.date_created).toLowerCase().includes(query) ||
      item.media_sent.toString().includes(query)
    );
  });
});

const sortedData = computed(() => {
  const dataToSort = [...filteredData.value];
  return dataToSort.sort((a, b) => {
    let valueA, valueB;
    switch (sortColumn.value) {
      case "message_sent":
        valueA = a.message_sent;
        valueB = b.message_sent;
        break;
      case "media_storage_used":
        valueA = a.media_storage_used;
        valueB = b.media_storage_used;
        break;
      case "date_created":
        valueA = new Date(a.date_created).getTime();
        valueB = new Date(b.date_created).getTime();
        break;
      case "media_sent":
        valueA = a.media_sent;
        valueB = b.media_sent;
        break;
      default:
        valueA = a.full_name.toLowerCase();
        valueB = b.full_name.toLowerCase();
    }
    if (sortDirection.value === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
});

const filteredAndSortedData = computed(() => {
  if (!filterCriteria.value) return sortedData.value;

  return sortedData.value.filter((item) => {
    if (
      !item.date_created ||
      item.media_storage_used == null ||
      item.message_sent == null
    )
      return false;
    const itemDate = new Date(item.date_created).getTime();
    const dateFrom = filterCriteria.value.dateFrom
      ? new Date(
          filterCriteria.value.dateFrom.replace(/(\d{2}) - (\d{2}) - (\d{4})/, "$3-$2-$1")
        ).getTime()
      : null;
    const dateTo = filterCriteria.value.dateTo
      ? new Date(
          filterCriteria.value.dateTo.replace(/(\d{2}) - (\d{2}) - (\d{4})/, "$3-$2-$1")
        ).getTime()
      : null;
    if (dateFrom !== null && itemDate < dateFrom) return false;
    if (dateTo !== null && itemDate > dateTo) return false;
    let minStorage = 0,
      maxStorage = Infinity;
    if (filterCriteria.value.mediaStorage) {
      const storageValues = filterCriteria.value.mediaStorage
        .split("-")
        .map((s: string) => parseFloat(s.trim()));
      minStorage = (storageValues[0] ?? 0) * 1024 * 1024;
      maxStorage = (storageValues[1] ?? Infinity) * 1024 * 1024;
    }
    if (item.media_storage_used < minStorage || item.media_storage_used > maxStorage)
      return false;
    let minMessages = 0,
      maxMessages = Infinity;
    if (filterCriteria.value.messages) {
      const messageValues = filterCriteria.value.messages
        .split("-")
        .map((s: string) => parseInt(s.trim(), 10));
      minMessages = messageValues[0] ?? 0;
      maxMessages = messageValues[1] ?? Infinity;
    }
    if (item.message_sent < minMessages || item.message_sent > maxMessages) return false;
    return true;
  });
});

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);
    if (startPage === 2) endPage = Math.min(totalPages.value - 1, 4);
    if (endPage === totalPages.value - 1) startPage = Math.max(2, totalPages.value - 3);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (totalPages.value > 1) {
      pages.push(totalPages.value);
    }
  }
  return pages;
});

const showEllipsis = computed(() => {
  return totalPages.value > 5 && !displayedPages.value.includes(totalPages.value - 1);
});

watch([currentPage], () => {
  fetchData();
});

onMounted(() => {
  fetchData();
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.loading-placeholder {
  height: 30px;
  width: 100%;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: loading-animation 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto;
}

.loading-placeholder-small {
  height: 30px;
  width: 40px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: loading-animation 1.5s infinite;
  border-radius: 4px;
  margin: 0 auto;
}
</style>
