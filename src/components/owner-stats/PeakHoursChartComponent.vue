<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Peak Hours Analytics</ion-card-title>
      <ion-card-subtitle>Understand your busiest times</ion-card-subtitle>
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

const mockPeakHoursData = {
  labels: [
    '6 AM',
    '7 AM',
    '8 AM',
    '9 AM',
    '10 AM',
    '11 AM',
    '12 PM',
    '1 PM',
    '2 PM',
    '3 PM',
    '4 PM',
    '5 PM',
    '6 PM',
    '7 PM',
    '8 PM',
    '9 PM',
    '10 PM',
    '11 PM',
  ],
  datasets: [
    {
      label: 'Weekdays',
      data: [
        5, 12, 25, 35, 45, 42, 38, 32, 28, 35, 48, 52, 55, 62, 58, 45, 28, 15,
      ],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
    {
      label: 'Weekends',
      data: [
        2, 5, 15, 28, 38, 45, 52, 48, 42, 45, 55, 62, 68, 72, 65, 58, 45, 25,
      ],
      backgroundColor: 'rgba(255, 159, 64, 0.6)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 2,
    },
  ],
};

const initializeChart = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 5000));
  isLoading.value = false;

  await nextTick();

  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    if (ctx) {
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: mockPeakHoursData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Booking Frequency by Hour',
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
                text: 'Time of Day',
              },
            },
          },
          elements: {
            bar: {
              borderRadius: 4,
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
