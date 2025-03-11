<template>
  <div class="dashboard-container">
    <div class="metrics-container">
      <Card 
        v-for="metric in metrics" 
        :key="metric.id"
        :label="metric.label"
        :value="metric.value"
        :memory="metric.memory"
        :total="metric.total"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import Card from './Card.vue'

interface Metric {
  id: number
  label: string
  value: string | number
  total?: string | number
  memory?: boolean
}

defineProps({
  metrics: {
    type: Array as PropType<Metric[]>,
    required: true
  },
  loading: {
    type: Boolean,
    required: true
  }
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
  gap: 16px;
  justify-content: flex-start;
}

.metric-card {
  flex: 1 1 calc(25% - 16px); 
  max-width: calc(25% - 16px);
}

@media (max-width: 1024px) {
  .metric-card {
    flex: 1 1 calc(33.333% - 16px);
    max-width: calc(33.333% - 16px);
  }
}

@media (max-width: 768px) {
  .metric-card {
    flex: 1 1 calc(50% - 16px);
    max-width: calc(50% - 16px);
  }
}

@media (max-width: 480px) {
  .metric-card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}
</style>
