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

const chartInstance = ref<Chart | null>(null);

const mockBookingData = {
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
      label: 'Bookings',
      data: [45, 52, 48, 61, 58, 65, 72, 68, 75, 82, 78, 89],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Cancellations',
      data: [8, 12, 9, 15, 11, 13, 18, 14, 16, 19, 17, 21],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    },
  ],
};

onMounted(() => {
  initializeChart();
});

const initializeChart = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  isLoading.value = false;

  await nextTick();

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: mockBookingData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Monthly Booking Trends',
            },
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Number of Bookings',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Month',
              },
            },
          },
          elements: {
            point: {
              radius: 5,
              hoverRadius: 7,
            },
          },
        },
      });
    }
  }
};
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Booking Trends</ion-card-title>
      <ion-card-subtitle>Monthly booking patterns</ion-card-subtitle>
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
