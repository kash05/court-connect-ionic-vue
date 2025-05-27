<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonChip,
  IonIcon,
  IonSkeletonText,
} from '@ionic/vue';
import { starOutline } from 'ionicons/icons';
import GlobalFilter, {
  FilterData,
  FilterOption,
} from '../DateRangeFilterComponent.vue';

const isLoading = ref(true);

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

const filterOptions: FilterOption[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'thisMonth', label: 'This Month' },
  { value: 'lastMonth', label: 'Last Month' },
  { value: 'thisYear', label: 'This Year' },
];

const propertyData = ref<PropertyPerformance[]>([]);

const fetchPropertyData = async (
  filterData?: FilterData,
): Promise<PropertyPerformance[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const baseData = [
    {
      id: '1',
      name: 'Downtown Tennis Court',
      location: 'City Center',
      type: 'Tennis',
      image: 'https://via.placeholder.com/50x50/4CAF50/ffffff?text=T',
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
      image: 'https://via.placeholder.com/50x50/FF9800/ffffff?text=B',
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
      image: 'https://via.placeholder.com/50x50/2196F3/ffffff?text=S',
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
      image: 'https://via.placeholder.com/50x50/9C27B0/ffffff?text=F',
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
      image: 'https://via.placeholder.com/50x50/607D8B/ffffff?text=BD',
      bookings: 52,
      revenue: 7280,
      occupancy: 88,
      rating: 4.7,
      isActive: false,
    },
  ];

  const multiplier = getDataMultiplier(filterData?.period || 'last30days');

  return baseData.map((property) => ({
    ...property,
    bookings: Math.round(property.bookings * multiplier),
    revenue: Math.round(property.revenue * multiplier),
    occupancy: Math.min(100, Math.round(property.occupancy * multiplier)),
  }));
};

const getDataMultiplier = (period: string): number => {
  const multipliers: Record<string, number> = {
    today: 0.1,
    yesterday: 0.08,
    last7days: 0.3,
    last30days: 1,
    thisMonth: 1.1,
    lastMonth: 0.95,
    thisYear: 12,
    custom: 0.7,
  };
  return multipliers[period] || 1;
};

const handleFilterChange = async (filterData: FilterData) => {
  console.log('Filter changed:', filterData);
  isLoading.value = true;

  try {
    const stats = await fetchPropertyData(filterData);
    propertyData.value = stats;
  } catch (error) {
    console.error('Failed to apply filter:', error);
  } finally {
    isLoading.value = false;
  }
};

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

onMounted(() => {});
</script>

<template>
  <ion-card>
    <ion-card-header>
      <div class="card-header-content">
        <div class="title-section">
          <ion-card-title>Property Performance</ion-card-title>
          <ion-card-subtitle>Revenue breakdown by property</ion-card-subtitle>
        </div>
        <div class="filter-section">
          <GlobalFilter
            :available-filters="filterOptions"
            default-filter="last30days"
            placeholder="Select Period"
            :custom-range-enabled="true"
            @filter-change="handleFilterChange"
          />
        </div>
      </div>
    </ion-card-header>

    <ion-card-content v-if="!isLoading">
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
            <tr v-for="property in propertyData" :key="property.id">
              <td>
                <div class="property-info">
                  <img
                    :src="property.image"
                    :alt="property.name"
                    class="property-image"
                  />
                  <div class="property-details">
                    <strong>{{ property.name }}</strong>
                    <small>{{ property.location }}</small>
                  </div>
                </div>
              </td>
              <td>
                <ion-chip :color="getTypeColor(property.type)" size="small">
                  {{ property.type }}
                </ion-chip>
              </td>
              <td class="number-cell">{{ property.bookings }}</td>
              <td class="revenue">${{ formatCurrency(property.revenue) }}</td>
              <td>
                <div class="occupancy-container">
                  <div class="occupancy-bar">
                    <div
                      class="occupancy-fill"
                      :style="{ width: property.occupancy + '%' }"
                    ></div>
                    <span class="occupancy-text"
                      >{{ property.occupancy }}%</span
                    >
                  </div>
                </div>
              </td>
              <td>
                <div class="rating">
                  <ion-icon :icon="starOutline"></ion-icon>
                  <span>{{ property.rating.toFixed(1) }}</span>
                </div>
              </td>
              <td>
                <ion-chip
                  :color="property.isActive ? 'success' : 'medium'"
                  size="small"
                >
                  {{ property.isActive ? 'Active' : 'Inactive' }}
                </ion-chip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ion-card-content>

    <div class="loading-skeleton" v-else>
      <div class="skeleton-header">
        <ion-skeleton-text
          animated
          style="width: 200px; height: 24px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 150px; height: 20px"
        ></ion-skeleton-text>
      </div>

      <div class="skeleton-table">
        <div class="skeleton-table-header">
          <ion-skeleton-text
            v-for="i in 7"
            :key="i"
            animated
            style="width: 80px; height: 16px"
          ></ion-skeleton-text>
        </div>

        <div v-for="i in 5" :key="i" class="skeleton-row">
          <div class="skeleton-property">
            <ion-skeleton-text
              animated
              style="width: 40px; height: 40px; border-radius: 8px"
            ></ion-skeleton-text>
            <div class="skeleton-property-text">
              <ion-skeleton-text
                animated
                style="width: 120px; height: 16px"
              ></ion-skeleton-text>
              <ion-skeleton-text
                animated
                style="width: 80px; height: 12px"
              ></ion-skeleton-text>
            </div>
          </div>
          <ion-skeleton-text
            animated
            style="width: 60px; height: 20px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 40px; height: 16px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 80px; height: 16px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 60px; height: 16px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 50px; height: 16px"
          ></ion-skeleton-text>
          <ion-skeleton-text
            animated
            style="width: 60px; height: 20px"
          ></ion-skeleton-text>
        </div>
      </div>
    </div>
  </ion-card>
</template>

<style scoped>
.card-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.title-section {
  flex: 1;
}

.filter-section {
  min-width: 200px;
  flex-shrink: 0;
}

.table-container {
  overflow-x: auto;
  margin-top: 16px;
}

.property-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.property-table th,
.property-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid var(--ion-color-light);
  vertical-align: middle;
}

.property-table th {
  font-weight: 600;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  background: var(--ion-color-light-tint);
  white-space: nowrap;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.property-image {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.property-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.property-details strong {
  font-size: 0.95rem;
  line-height: 1.2;
}

.property-details small {
  color: var(--ion-color-medium);
  font-size: 0.8rem;
}

.number-cell {
  text-align: center;
  font-weight: 500;
}

.revenue {
  font-weight: 600;
  color: var(--ion-color-success);
  text-align: right;
}

.occupancy-container {
  min-width: 80px;
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
  background: linear-gradient(
    90deg,
    var(--ion-color-primary),
    var(--ion-color-primary-shade)
  );
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
  min-width: 20px;
}

.occupancy-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--ion-color-warning);
}

.loading-skeleton {
  padding: 16px;
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.skeleton-table-header {
  display: flex;
  gap: 16px;
  padding: 12px 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--ion-color-light);
}

.skeleton-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 8px;
  margin-bottom: 12px;
}

.skeleton-property {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.skeleton-property-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media (max-width: 768px) {
  .card-header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section {
    min-width: auto;
    width: 100%;
  }

  .table-container {
    font-size: 0.85rem;
  }

  .property-table th,
  .property-table td {
    padding: 8px 6px;
  }

  .property-info {
    min-width: 150px;
  }

  .property-details strong {
    font-size: 0.85rem;
  }

  .occupancy-bar {
    width: 60px;
    height: 16px;
  }

  .occupancy-text {
    font-size: 0.6rem;
  }
}

@media (max-width: 480px) {
  .property-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    min-width: 120px;
  }

  .property-details {
    align-items: center;
  }
}
</style>
