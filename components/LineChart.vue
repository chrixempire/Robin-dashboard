<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps<{
  chartData: {
    labels: string[];
    values: number[];
  };
  lineColor: string;
  backgroundColor: string;
  title?: string;
}>();

const chartRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const initChart = async () => {
  await nextTick(); 
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    if (ctx) {
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: props.chartData.labels,
          datasets: [
            {
              label: props.title || 'Active Users',
              data: props.chartData.values,
              borderColor: props.lineColor,
              backgroundColor: props.backgroundColor,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: props.lineColor,
              pointHoverBorderColor: '#FFFFFF',
              pointHoverBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: '#475569',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              displayColors: false,
              callbacks: {
                title: (items) => `${items[0].label}`,
                label: (item) => `${item.formattedValue} ${props.title}`,
              },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#566BA0' } },
            y: { display: false },
          },
          interaction: { intersect: false, mode: 'index' },
        },
      });
    }
  }
};

watch(() => props.chartData, (newData) => {
  if (chart) {
    chart.data.labels = newData.labels;
    chart.data.datasets[0].data = newData.values;
    chart.update();
  }
}, { deep: true });

watch([() => props.lineColor, () => props.backgroundColor], ([newLineColor, newBgColor]) => {
  if (chart) {
    chart.data.datasets[0].borderColor = newLineColor;
    chart.data.datasets[0].backgroundColor = newBgColor;
    chart.update();
  }
});

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  if (chart) chart.destroy();
});
</script>

<style scoped>
.chart-container {
  height: 400px;
  position: relative;
}
</style>