<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Revenue Analytics</ion-card-title>
      <ion-card-subtitle>Track your earnings over time</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content v-if="!isLoading">
      <canvas ref="chartCanvas" class="chart-canvas"></canvas>
    </ion-card-content>

    <div class="chart-skeleton" v-else>
      <ion-skeleton-text
        animated
        style="width: 100%; height: 300px"
      ></ion-skeleton-text>
    </div>
  </ion-card>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSkeletonText,
} from '@ionic/vue';
import Chart from 'chart.js/auto';

const isLoading = ref(true);

const chartCanvas = ref<HTMLCanvasElement>();
let chartInstance: Chart | null = null;

const mockRevenueData = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  datasets: [
    {
      label: 'Revenue',
      data: [
        3500, 4200, 3800, 5100, 4800, 5500, 6200, 5800, 6500, 7200, 6800, 8900,
      ],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Target',
      data: [
        4000, 4000, 4500, 4500, 5000, 5000, 5500, 5500, 6000, 6000, 6500, 6500,
      ],
      backgroundColor: 'rgba(255, 99, 132, 0.1)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
    },
  ],
};

const initializeChart = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 4000));
  isLoading.value = false;

  await nextTick();

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: mockRevenueData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Revenue vs Target',
            },
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return '$' + new Intl.NumberFormat().format(Number(value));
                },
              },
            },
          },
          elements: {
            point: {
              radius: 6,
              hoverRadius: 8,
            },
          },
        },
      });
    }
  }
};

onMounted(() => {
  initializeChart();
});
</script>

<style scoped>
.chart-canvas {
  width: 100%;
  height: 300px;
}

.chart-skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
