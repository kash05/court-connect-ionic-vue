<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonLabel,
  IonItem,
  IonDatetime,
  IonIcon,
  IonChip,
  IonSpinner,
  IonSelect,
  IonButton,
  IonSelectOption,
} from '@ionic/vue';
import {
  cashOutline,
  calendarOutline,
  businessOutline,
  starOutline,
  timeOutline,
  checkmarkCircleOutline,
  checkmarkDoneOutline,
  closeCircleOutline,
  trendingUpOutline,
  refreshOutline,
} from 'ionicons/icons';

import Chart from 'chart.js/auto';
import OwnerTabBarComponent from '@/components/tabbar/OwnerTabBarComponent.vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';

interface PropertyPerformance {
  id: string;
  name: string;
  location: string;
  type: string;
  image: string;
  bookings: number;
  revenue: number;
  occupancy: number;
  rating: number;
  isActive: boolean;
}

interface BookingStats {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface Trend {
  type: 'positive' | 'negative';
  percentage: number;
  icon: string;
}

const selectedPeriod = ref('thisMonth');
const customDateRange = ref({
  from: new Date().toISOString(),
  to: new Date().toISOString(),
});

const loading = ref(false);
const totalRevenue = ref(45620);
const totalBookings = ref(312);
const activeProperties = ref(8);
const averageOccupancy = ref(78);
const averageRating = ref(4.6);
const totalReviews = ref(245);

const revenueTrend = ref<Trend>({
  type: 'positive',
  percentage: 12.5,
  icon: trendingUpOutline,
});

const bookingsTrend = ref<Trend>({
  type: 'positive',
  percentage: 8.3,
  icon: trendingUpOutline,
});

const bookingStats = ref<BookingStats>({
  pending: 23,
  confirmed: 156,
  completed: 298,
  cancelled: 35,
});

const propertyPerformance = ref<PropertyPerformance[]>([
  {
    id: '1',
    name: 'Downtown Tennis Court',
    location: 'City Center',
    type: 'Tennis',
    image: '/api/placeholder/50/50',
    bookings: 45,
    revenue: 8920,
    occupancy: 85,
    rating: 4.8,
    isActive: true,
  },
  {
    id: '2',
    name: 'Sunset Basketball Court',
    location: 'West District',
    type: 'Basketball',
    image: '/api/placeholder/50/50',
    bookings: 38,
    revenue: 6450,
    occupancy: 72,
    rating: 4.5,
    isActive: true,
  },
  {
    id: '3',
    name: 'Olympic Swimming Pool',
    location: 'Sports Complex',
    type: 'Swimming',
    image: '/api/placeholder/50/50',
    bookings: 67,
    revenue: 12340,
    occupancy: 91,
    rating: 4.9,
    isActive: true,
  },
  {
    id: '4',
    name: 'Community Football Field',
    location: 'North Park',
    type: 'Football',
    image: '/api/placeholder/50/50',
    bookings: 29,
    revenue: 4830,
    occupancy: 65,
    rating: 4.2,
    isActive: true,
  },
  {
    id: '5',
    name: 'Indoor Badminton Court',
    location: 'Sports Center',
    type: 'Badminton',
    image: '/api/placeholder/50/50',
    bookings: 52,
    revenue: 7280,
    occupancy: 88,
    rating: 4.7,
    isActive: false,
  },
]);

const revenueChart = ref<HTMLCanvasElement>();
const bookingStatusChart = ref<HTMLCanvasElement>();
const peakHoursChart = ref<HTMLCanvasElement>();

onMounted(() => {
  fetchData();
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    Tennis: 'success',
    Basketball: 'warning',
    Swimming: 'primary',
    Football: 'secondary',
    Badminton: 'tertiary',
  };
  return colors[type] || 'medium';
};

const onPeriodChange = (event: CustomEvent) => {
  selectedPeriod.value = event.detail.value;
  fetchData();
};

const onDateRangeChange = () => {
  if (selectedPeriod.value === 'custom') {
    fetchData();
  }
};

const refreshData = async () => {
  loading.value = true;
  await fetchData();
  loading.value = false;
};

const fetchData = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Here you would make actual API calls based on selectedPeriod
  // and update all the reactive data
  console.log('Fetching data for period:', selectedPeriod.value);

  // Update charts after data is loaded
  nextTick(() => {
    initializeCharts();
  });
};

const initializeCharts = () => {
  // Initialize Revenue Chart
  if (revenueChart.value) {
    // Chart.js implementation would go here
    const ctx = revenueChart.value.getContext('2d');
    new Chart(ctx, { options: { bar: { groupWidth: '95%' } } });
  }

  // Initialize Booking Status Chart
  if (bookingStatusChart.value) {
    const ctx = bookingStatusChart.value.getContext('2d');
    new Chart(ctx, { options: { bar: { groupWidth: '95%' } } });
  }

  // Initialize Peak Hours Chart
  if (peakHoursChart.value) {
    const ctx = peakHoursChart.value.getContext('2d');
    new Chart(ctx, { options: { bar: { groupWidth: '95%' } } });
  }
};
</script>

<template>
  <ion-page>
    <PageHeaderComponent />

    <ion-content>
      <!-- Filter Section -->
      <div class="filter-section">
        <ion-item>
          <ion-label>Time Period</ion-label>
          <ion-select
            v-model="selectedPeriod"
            @ionChange="onPeriodChange"
            interface="popover"
            placeholder="Select Period"
          >
            <ion-select-option value="thisMonth">This Month</ion-select-option>
            <ion-select-option value="lastMonth">Last Month</ion-select-option>
            <ion-select-option value="thisYear">This Year</ion-select-option>
            <ion-select-option value="lastYear">Last Year</ion-select-option>
            <ion-select-option value="custom">Custom Range</ion-select-option>
          </ion-select>
          <ion-button
            @click="refreshData"
            fill="solid"
            color="primary"
            size="small"
          >
            <ion-icon :icon="refreshOutline"></ion-icon>
          </ion-button>
        </ion-item>

        <!-- Custom Date Range -->
        <div v-if="selectedPeriod === 'custom'" class="custom-date-range">
          <ion-item>
            <ion-label position="stacked">From Date</ion-label>
            <ion-datetime
              v-model="customDateRange.from"
              presentation="date"
              @ionChange="onDateRangeChange"
            >
            </ion-datetime>
          </ion-item>
          <ion-item>
            <ion-label position="stacked">To Date</ion-label>
            <ion-datetime
              v-model="customDateRange.to"
              presentation="date"
              @ionChange="onDateRangeChange"
            >
            </ion-datetime>
          </ion-item>
        </div>
      </div>

      <!-- Quick Stats Cards -->
      <div class="stats-cards">
        <ion-card class="stat-card revenue">
          <ion-card-content>
            <div class="stat-icon">
              <ion-icon :icon="cashOutline"></ion-icon>
            </div>
            <div class="stat-info">
              <h2>${{ formatCurrency(totalRevenue) }}</h2>
              <p>Total Revenue</p>
              <span class="trend" :class="revenueTrend.type">
                <ion-icon :icon="revenueTrend.icon"></ion-icon>
                {{ revenueTrend.percentage }}% vs previous period
              </span>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="stat-card bookings">
          <ion-card-content>
            <div class="stat-icon">
              <ion-icon :icon="calendarOutline"></ion-icon>
            </div>
            <div class="stat-info">
              <h2>{{ totalBookings }}</h2>
              <p>Total Bookings</p>
              <span class="trend" :class="bookingsTrend.type">
                <ion-icon :icon="bookingsTrend.icon"></ion-icon>
                {{ bookingsTrend.percentage }}% vs previous period
              </span>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="stat-card properties">
          <ion-card-content>
            <div class="stat-icon">
              <ion-icon :icon="businessOutline"></ion-icon>
            </div>
            <div class="stat-info">
              <h2>{{ activeProperties }}</h2>
              <p>Active Properties</p>
              <span class="occupancy-rate"
                >{{ averageOccupancy }}% avg occupancy</span
              >
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card class="stat-card rating">
          <ion-card-content>
            <div class="stat-icon">
              <ion-icon :icon="starOutline"></ion-icon>
            </div>
            <div class="stat-info">
              <h2>{{ averageRating.toFixed(1) }}</h2>
              <p>Average Rating</p>
              <span class="rating-count">{{ totalReviews }} reviews</span>
            </div>
          </ion-card-content>
        </ion-card>
      </div>

      <!-- Revenue Chart -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Revenue Analytics</ion-card-title>
          <ion-card-subtitle>Track your earnings over time</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <canvas ref="revenueChart" class="chart-canvas"></canvas>
        </ion-card-content>
      </ion-card>

      <!-- Booking Status Breakdown -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Booking Status Overview</ion-card-title>
        </ion-card-header>
        <ion-card-content>
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

          <!-- Booking Status Pie Chart -->
          <canvas ref="bookingStatusChart" class="chart-canvas"></canvas>
        </ion-card-content>
      </ion-card>

      <!-- Property Performance Table -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Property Performance</ion-card-title>
          <ion-card-subtitle>Revenue breakdown by property</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div class="table-container">
            <table class="property-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Type</th>
                  <th>Bookings</th>
                  <th>Revenue</th>
                  <th>Occupancy</th>
                  <th>Avg. Rating</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in propertyPerformance" :key="property.id">
                  <td>
                    <div class="property-info">
                      <img
                        :src="property.image"
                        :alt="property.name"
                        class="property-image"
                      />
                      <div>
                        <strong>{{ property.name }}</strong>
                        <small>{{ property.location }}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <ion-chip :color="getTypeColor(property.type)">
                      {{ property.type }}
                    </ion-chip>
                  </td>
                  <td>{{ property.bookings }}</td>
                  <td class="revenue">
                    ${{ formatCurrency(property.revenue) }}
                  </td>
                  <td>
                    <div class="occupancy-bar">
                      <div
                        class="occupancy-fill"
                        :style="{ width: property.occupancy + '%' }"
                      ></div>
                      <span>{{ property.occupancy }}%</span>
                    </div>
                  </td>
                  <td>
                    <div class="rating">
                      <ion-icon :icon="starOutline"></ion-icon>
                      {{ property.rating.toFixed(1) }}
                    </div>
                  </td>
                  <td>
                    <ion-chip :color="property.isActive ? 'success' : 'medium'">
                      {{ property.isActive ? 'Active' : 'Inactive' }}
                    </ion-chip>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Peak Hours Analytics -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Peak Hours Analytics</ion-card-title>
          <ion-card-subtitle>Understand your busiest times</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <canvas ref="peakHoursChart" class="chart-canvas"></canvas>
        </ion-card-content>
      </ion-card>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Loading statistics...</p>
      </div>
    </ion-content>
    <OwnerTabBarComponent />
  </ion-page>
</template>

<style scoped>
.filter-section {
  padding: 16px;
  background: var(--ion-color-light);
}

.custom-date-range {
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}

.stat-card {
  margin: 0;
}

.stat-card ion-card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 2.5rem;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.revenue .stat-icon {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  color: var(--ion-color-success);
}

.bookings .stat-icon {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  color: var(--ion-color-primary);
}

.properties .stat-icon {
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  color: var(--ion-color-warning);
}

.rating .stat-icon {
  background: rgba(var(--ion-color-tertiary-rgb), 0.1);
  color: var(--ion-color-tertiary);
}

.stat-info h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stat-info p {
  margin: 4px 0;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.trend.positive {
  color: var(--ion-color-success);
}

.trend.negative {
  color: var(--ion-color-danger);
}

.occupancy-rate,
.rating-count {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
}

.chart-canvas {
  width: 100%;
  height: 300px;
}

.booking-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.status-item {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid transparent;
}

.status-item.pending {
  background: rgba(var(--ion-color-warning-rgb), 0.1);
  border-color: var(--ion-color-warning);
}

.status-item.confirmed {
  background: rgba(var(--ion-color-primary-rgb), 0.1);
  border-color: var(--ion-color-primary);
}

.status-item.completed {
  background: rgba(var(--ion-color-success-rgb), 0.1);
  border-color: var(--ion-color-success);
}

.status-item.cancelled {
  background: rgba(var(--ion-color-danger-rgb), 0.1);
  border-color: var(--ion-color-danger);
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

.table-container {
  overflow-x: auto;
}

.property-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.property-table th,
.property-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--ion-color-light);
}

.property-table th {
  font-weight: 600;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.property-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.property-info div {
  display: flex;
  flex-direction: column;
}

.property-info small {
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}

.revenue {
  font-weight: 600;
  color: var(--ion-color-success);
}

.occupancy-bar {
  position: relative;
  background: var(--ion-color-light);
  border-radius: 10px;
  height: 20px;
  width: 80px;
  overflow: hidden;
}

.occupancy-fill {
  background: var(--ion-color-primary);
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.occupancy-bar span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ion-color-warning);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .custom-date-range {
    grid-template-columns: 1fr;
  }

  .booking-status-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-container {
    font-size: 0.9rem;
  }

  .property-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
