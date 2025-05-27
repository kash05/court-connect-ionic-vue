<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonSkeletonText,
  IonCardContent,
} from '@ionic/vue';
import {
  timeOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import Chart from 'chart.js/auto';
import GlobalFilter, {
  type FilterData,
  type FilterOption,
} from '../../components/DateRangeFilterComponent.vue';

interface BookingStats {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const isLoading = ref(true);
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null;

const bookingStats = ref<BookingStats>({
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0,
});

const filterOptions: FilterOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
];

const hasData = computed(() => {
  const stats = bookingStats.value;
  return (
    stats.pending > 0 ||
    stats.confirmed > 0 ||
    stats.completed > 0 ||
    stats.cancelled > 0
  );
});

const handleFilterChange = async (filterData: FilterData) => {
  console.log('Filter changed:', filterData);
  isLoading.value = true;

  try {
    const stats = await fetchBookingStats(filterData);
    bookingStats.value = stats;
    await initializeChart();
  } catch (error) {
    console.error('Failed to apply filter:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {});

const fetchBookingStats = async (
  filterData?: FilterData,
): Promise<BookingStats> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockDataByPeriod: Record<string, BookingStats> = {
      today: { pending: 5, confirmed: 12, completed: 8, cancelled: 2 },
      yesterday: { pending: 3, confirmed: 15, completed: 22, cancelled: 1 },
      last7days: { pending: 23, confirmed: 89, completed: 156, cancelled: 12 },
      last30days: {
        pending: 45,
        confirmed: 234,
        completed: 567,
        cancelled: 28,
      },
      thisMonth: { pending: 67, confirmed: 345, completed: 678, cancelled: 34 },
      lastMonth: { pending: 89, confirmed: 456, completed: 789, cancelled: 45 },
      thisYear: {
        pending: 234,
        confirmed: 1234,
        completed: 2345,
        cancelled: 123,
      },
      custom: { pending: 15, confirmed: 78, completed: 134, cancelled: 19 },
    };

    const period = filterData?.period || 'last30days';
    return mockDataByPeriod[period] || mockDataByPeriod.last30days;
  } catch (err) {
    console.error('Failed to fetch booking stats:', err);
    return {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
  }
};

const destroyChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
};

const initializeChart = async () => {
  await nextTick();

  destroyChart();

  if (!chartCanvas.value || !hasData.value) {
    return;
  }

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    console.error('Could not get canvas context');
    return;
  }

  try {
    const data = {
      labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      datasets: [
        {
          data: [
            bookingStats.value.pending,
            bookingStats.value.confirmed,
            bookingStats.value.completed,
            bookingStats.value.cancelled,
          ],
          backgroundColor: [
            'rgba(255, 193, 7, 0.8)',
            'rgba(13, 110, 253, 0.8)',
            'rgba(25, 135, 84, 0.8)',
            'rgba(220, 53, 69, 0.8)',
          ],
          borderColor: [
            'rgba(255, 193, 7, 1)',
            'rgba(13, 110, 253, 1)',
            'rgba(25, 135, 84, 1)',
            'rgba(220, 53, 69, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };

    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Booking Status Distribution',
            font: {
              size: 16,
            },
          },
          legend: {
            display: true,
            position: 'bottom',
          },
        },
        animation: {
          duration: 1000,
        },
      },
    });
  } catch (error) {
    console.error('Failed to create chart:', error);
  }
};
</script>

<template>
  <ion-card>
    <ion-card-header>
      <div class="card-header-content">
        <ion-card-title>Booking Status Overview</ion-card-title>
        <GlobalFilter
          :available-filters="filterOptions"
          default-filter="last30days"
          placeholder="Select Period"
          :custom-range-enabled="true"
          @filter-change="handleFilterChange"
        />
      </div>
    </ion-card-header>

    <ion-card-content class="ion-padding" v-if="!isLoading">
      <div class="booking-status-content">
        <!-- Status Grid -->
        <div class="booking-status-grid">
          <div class="status-item pending">
            <div class="status-icon">
              <ion-icon :icon="timeOutline"></ion-icon>
            </div>
            <div class="status-info">
              <h3>{{ bookingStats.pending }}</h3>
              <p>Pending</p>
            </div>
          </div>
          <div class="status-item confirmed">
            <div class="status-icon">
              <ion-icon :icon="checkmarkCircleOutline"></ion-icon>
            </div>
            <div class="status-info">
              <h3>{{ bookingStats.confirmed }}</h3>
              <p>Confirmed</p>
            </div>
          </div>
          <div class="status-item completed">
            <div class="status-icon">
              <ion-icon :icon="checkmarkDoneOutline"></ion-icon>
            </div>
            <div class="status-info">
              <h3>{{ bookingStats.completed }}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div class="status-item cancelled">
            <div class="status-icon">
              <ion-icon :icon="closeCircleOutline"></ion-icon>
            </div>
            <div class="status-info">
              <h3>{{ bookingStats.cancelled }}</h3>
              <p>Cancelled</p>
            </div>
          </div>
        </div>

        <!-- Pie Chart -->
        <div class="chart-container">
          <canvas ref="chartCanvas" class="chart-canvas"></canvas>
        </div>
      </div>
    </ion-card-content>

    <div class="loading-skeleton" v-else>
      <div class="skeleton-grid">
        <div v-for="i in 4" :key="i" class="skeleton-status-item">
          <ion-skeleton-text
            animated
            style="width: 60px; height: 60px; border-radius: 50%"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 80px; height: 20px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 60px; height: 16px"
          ></ion-skeleton-text>
        </div>
      </div>
      <ion-skeleton-text
        animated
        style="width: 100%; height: 300px; margin-top: 24px"
      ></ion-skeleton-text>
    </div>
  </ion-card>
</template>

<style scoped>
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.booking-status-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.booking-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.status-item {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: transform 0.2s ease;
}

.status-item:hover {
  transform: translateY(-2px);
}

.status-item.pending {
  background: rgba(255, 193, 7, 0.1);
  border-color: rgba(255, 193, 7, 1);
}

.status-item.confirmed {
  background: rgba(13, 110, 253, 0.1);
  border-color: rgba(13, 110, 253, 1);
}

.status-item.completed {
  background: rgba(25, 135, 84, 0.1);
  border-color: rgba(25, 135, 84, 1);
}

.status-item.cancelled {
  background: rgba(220, 53, 69, 0.1);
  border-color: rgba(220, 53, 69, 1);
}

.status-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.status-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.status-info p {
  margin: 4px 0 0 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.chart-canvas {
  width: 100% !important;
  height: 100% !important;
}

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px 0;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.skeleton-status-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

@media (max-width: 768px) {
  .card-header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .booking-status-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .status-item {
    padding: 12px;
  }

  .status-info h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .booking-status-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 250px;
  }
}
</style>
