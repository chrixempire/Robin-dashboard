<template>
  <div class="metric-card">
    <h3 class="metric-label">{{ label }}</h3>
    <div v-if="loading" class="loading-placeholder"></div>
    <p v-else class="metric-value">{{ value }} <span v-if="memory">of {{total}}</span></p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  loading?: boolean;
  memory?: boolean;
  total?:string | number
}

defineProps<Props>()
</script>

<style>
.metric-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #E7E9FF;
  gap: 12px;
  background: white;
  border-radius: 6px;
  padding:22px 24px;
  width: 100%;
}

.metric-label {
  font-size: 12px;
  line-height: 24px;
  color: #566ba0;
  font-weight: 400;
  text-transform: uppercase;
}

.metric-value {
  font-size: 28px;
  line-height: 32px;
  color: #566ba0;
  font-weight: 400;
}
.loading-placeholder {
  display: inline-block;
  height: 30px;
  width: 70px;
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
  background-size: 200% 100%;
  animation: loading-animation 1.5s infinite;
  border-radius: 4px;
}

span{
  font-size: 15px;
  line-height: 32px;
  font-weight: 400;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>