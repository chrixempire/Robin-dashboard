<template>
  <div class="page-container">
    <div class="refresh-cards">
      <div class="refresh-container">
        <span class="last-updated">Last updated {{ timeAgo }}</span>
        <button class="refresh-button" @click="handleRefresh" :disabled="isRefreshing">
          <IRefresh class="IRefresh" style="width: 16px; height: 16px" />
          <span class="refresh-text">Refresh</span>
        </button>
      </div>
      <AnalyticsMetrics :metrics="metrics" :loading="loading" />
    </div>
    <div class="graph-container">
      <div class="graph-content">
        <div class="filter-group">
          <div class="daily-active-users">DAILY ACTIVE USERS</div>
          <div class="filters">
            <div class="dropdown" @click.stop="toggleDropdown('period')">
              <span>{{ selectedPeriod }}</span>
              <IChevronDown
                class="IChevron"
                :fontControlled="false"
                :class="{ rotate: isPeriodDropdownOpen }"
                style="width: 12px; height: 12px"
              />
              <div class="dropdown-menu-item" v-if="isPeriodDropdownOpen">
                <div
                  v-for="period in periods"
                  :key="period"
                  @click.stop="updateSelection('period', period)"
                  class="dropdown-items"
                  :class="{ active: period === selectedPeriod }"
                >
                  {{ period }}
                </div>
              </div>
            </div>

            <div class="dropdown" @click.stop="toggleDropdown('activity')">
              <span>{{ selectedActivity }}</span>

              <IChevronDown
                class="IChevron"
                :fontControlled="false"
                :class="{ rotate: isActivityDropdownOpen }"
                style="width: 12px; height: 12px"
              />
              <div class="dropdown-menu-item" v-if="isActivityDropdownOpen">
                <div
                  v-for="activity in activities"
                  :key="activity"
                  @click.stop="updateSelection('activity', activity)"
                  class="dropdown-items"
                  :class="{ active: activity === selectedActivity }"
                >
                  {{ activity }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <LineChart
          :chartData="chartData"
          :lineColor="lineColor"
          :backgroundColor="backgroundColor"
          :title="chartTitle"
        />
      </div>
      <div class="graph-content">
        <div class="filter-group">
          <div class="daily-active-users">MONTHLY ACTIVE USERS</div>
          <div class="filters">
            <div class="dropdown" @click.stop="toggleMonthlyDropdown">
              <span>{{ selectedMonthlyActivity }}</span>

              <IChevronDown
                class="IChevron"
                :fontControlled="false"
                :class="{ rotate: isDropdownOpen }"
                style="width: 12px; height: 12px"
              />
              <div class="dropdown-menu-item" v-if="isDropdownOpen">
                <div
                  v-for="activity in activities"
                  :key="activity"
                  @click.stop="updateActivity(activity)"
                  class="dropdown-items"
                  :class="{ active: activity === selectedMonthlyActivity }"
                >
                  {{ activity }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <LineChart
          :chartData="monthlyChartData"
          :lineColor="monthlyLineColor"
          :backgroundColor="monthlyBackgroundColor"
          :title="selectedMonthlyActivity"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { IChevronDown, IRefresh } from "~/components/svg";
import { calculateTimeAgo } from "~/utils/utils.ts";
import axios from "axios";

definePageMeta({
  layout: "responsive-sidebar-layout",
});

interface Metric {
  id: number;
  label: string;
  value: string | number;
  total?: string | number;
  memory?: boolean;
}

const loading = ref(false);
const isPeriodDropdownOpen = ref(false);
const isDropdownOpen = ref(false);
const isActivityDropdownOpen = ref(false);
const lastUpdateTime = ref(new Date());
const timeAgo = ref("just now");
const isRefreshing = ref(false);
const selectedPeriod = ref("30 Days");
const selectedActivity = ref("All Activities");
const selectedMonthlyActivity = ref("All Activities");
const periods = ["7 Days", "30 Days", "90 Days"];
const activities = ["All Activities", "Logins", "Messages", "Posts"];
const lineColor = "#FF7043";
const backgroundColor = "rgba(255, 112, 67, 0.1)";
const metrics = ref<Metric[]>([
  { id: 1, label: "Users Online", value: 0 },
  { id: 2, label: "Users Active Today", value: 0 },
  { id: 3, label: "Users Active This Month", value: 0 },
  { id: 4, label: "Peak Concurrency This Month", value: 0 },
  { id: 5, label: "Dashboard", value: 0 },
]);

const chartTitle = computed(() => {
  return selectedActivity.value === "All Activities"
    ? "Active Users"
    : selectedActivity.value;
});

const chartData = ref({
  labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
  values: [0, 0, 0, 0, 0, 0, 0],
});

const monthlyLineColor = "#10B981";
const monthlyBackgroundColor = "rgba(16, 185, 129, 0.1)";
const monthlyChartData = ref({
  labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
  values: [0, 0, 0, 0, 0, 0, 0],
});

const generateGraphData = (period: string, activity: string) => {
  let maxValue = 500;
  switch (period) {
    case "7 Days":
      maxValue = 300;
      break;
    case "30 Days":
      maxValue = 500;
      break;
    case "90 Days":
      maxValue = 800;
      break;
  }

  let multiplier = 1;
  switch (activity) {
    case "Logins":
      multiplier = 0.8;
      break;
    case "Messages":
      multiplier = 1.2;
      break;
    case "Posts":
      multiplier = 0.6;
      break;
    default:
      multiplier = 1;
  }

  const randomValues = Array.from({ length: 7 }, () =>
    Math.floor(Math.random() * maxValue * multiplier)
  );

  return {
    labels: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    values: randomValues,
  };
};

const generateTrendingData = (activity: string) => {
  let baseValue = 350;
  let variance = 50;
  if (activity !== "All Activities") {
    baseValue = 250;
    variance = 30;
  }
  const values = [];
  let currentValue = baseValue;
  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * variance;
    currentValue = Math.max(50, Math.min(500, currentValue + change));
    values.push(Math.round(currentValue));
  }
  return {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL"],
    values,
  };
};

const toggleDropdown = (type: "period" | "activity") => {
  isPeriodDropdownOpen.value = false;
  isActivityDropdownOpen.value = false;

  if (type === "period") {
    isPeriodDropdownOpen.value = true;
  } else if (type === "activity") {
    isActivityDropdownOpen.value = true;
  }
};

const toggleMonthlyDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const updateSelection = (type: "period" | "activity", value: string) => {
  if (type === "period") {
    selectedPeriod.value = value;
  } else if (type === "activity") {
    selectedActivity.value = value;
  }
  chartData.value = generateGraphData(selectedPeriod.value, selectedActivity.value);
  isPeriodDropdownOpen.value = false;
  isActivityDropdownOpen.value = false;
};

const updateActivity = (activity: string) => {
  selectedMonthlyActivity.value = activity;
  isDropdownOpen.value = false;
  monthlyChartData.value = generateTrendingData(activity);
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown")) {
    isPeriodDropdownOpen.value = false;
    isActivityDropdownOpen.value = false;
    isDropdownOpen.value = false;
  }
};

const updateTimeAgo = () => {
  timeAgo.value = calculateTimeAgo(lastUpdateTime.value);
};

const handleRefresh = async () => {
  isRefreshing.value = true;

  try {
    fetchMetricData();
    chartData.value = generateGraphData(selectedPeriod.value, selectedActivity.value);
    monthlyChartData.value = generateTrendingData(selectedMonthlyActivity.value);
    lastUpdateTime.value = new Date();
    updateTimeAgo();
  } finally {
    isRefreshing.value = false;
  }
};

async function fetchMetricData() {
  try {
    loading.value = true;
    isRefreshing.value = true;
    const { data } = await axios.get("https://sfe-m3if.onrender.com/api/v1/dashboard");
    metrics.value = [
      { id: 1, label: "Users Online", value: data.data.usersOnline },
      { id: 2, label: "Users Active Today", value: data.data.usersActiveToday },
      { id: 3, label: "Users Active This Month", value: data.data.usersActiveThisMonth },
      { id: 4, label: "Peak Concurrency This Month", value: data.data.peakConcurrency },
      {
        id: 5,
        label: "Dashboard",
        value: `${(data.data.dashboard / (1024 * 1024 * 1024)).toFixed(2)}`,
        memory: true,
        total: `${512} GB`,
      },
    ];
    lastUpdateTime.value = new Date();
    updateTimeAgo();
  } catch (error) {
    console.error("Error fetching metrics:", error);
  } finally {
    loading.value = false;
    isRefreshing.value = false;
  }
}

onMounted(() => {
  fetchMetricData();
  document.addEventListener("click", handleClickOutside);
  chartData.value = generateGraphData(selectedPeriod.value, selectedActivity.value);
  monthlyChartData.value = generateTrendingData(selectedMonthlyActivity.value);
  setInterval(updateTimeAgo, 1000);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>

</style>
