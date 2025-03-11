<template>
  <div class="dashboard-container">
    <div class="metrics-container">
      <Card 
        v-for="metric in metrics" 
        :key="metric.id"
        :label="metric.label"
        :value="metric.value"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Metric {
  id: number
  label: string
  value: string | number
}

const loading = ref(false)

const metrics = ref<Metric[]>([
  { id: 1, label: 'NO OF USERS', value: 0 },
  { id: 2, label: 'TOTAL MESSAGE SENT', value: 0 },
  { id: 3, label: 'TOTAL MEDIA STORAGE USED', value: 0 },
  { id: 4, label: 'TOTAL MEDIA SENT', value: 0 }
])

async function fetchMetricData(){
  try {
    loading.value = true
    const { data } = await axios.get('https://sfe-m3if.onrender.com/api/v1/chat_dashboard')
    metrics.value = [
      { id: 1, label: 'NO OF USERS', value: data.data.numberOfUsers },
      { id: 2, label: 'TOTAL MESSAGE SENT', value: data.data.totalMessagesSent },
      { id: 3, label: 'TOTAL MEDIA STORAGE USED', value: `${(data.data.totalStorageUsed / (1024 * 1024)).toFixed(2)} MB` },
      { id: 4, label: 'TOTAL MEDIA SENT', value: data.data.totalMediaSent }
    ]
  } catch (error) {
    console.error('Error fetching metrics:', error)
  } finally{
    loading.value = false
  }
}

onMounted(() => {
  fetchMetricData()
})
</script>

<style scoped>
.dashboard-container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
}

.metrics-container {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  justify-content: flex-start;
}

.metrics-container > * {
  flex: 1 1 calc(25% - 13px); /* Default: 4 cards per row */
  max-width: calc(25% - 13px);
}

/* When screen size is smaller and can’t fit 4 cards, adjust */
@media (max-width: 1024px) {
  .metrics-container > * {
    flex: 1 1 calc(33.33% - 13px); /* 3 cards per row */
    max-width: calc(33.33% - 13px);
  }
}

/* For smaller tablets */
@media (max-width: 768px) {
  .metrics-container > * {
    flex: 1 1 calc(50% - 13px); /* 2 cards per row */
    max-width: calc(50% - 13px);
  }
}

/* Extra small screens */
@media (max-width: 480px) {
  .metrics-container > * {
    flex: 1 1 100%; /* Full width for very small screens */
    max-width: 100%;
  }
}

</style>
