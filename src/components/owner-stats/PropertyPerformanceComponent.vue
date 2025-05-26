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

const propertyData = ref<PropertyPerformance[]>([]);

const fetchPropertyData = async (): Promise<PropertyPerformance[]> => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  isLoading.value = false;

  return [
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

onMounted(async () => {
  propertyData.value = await fetchPropertyData();
});
</script>

<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Property Performance</ion-card-title>
      <ion-card-subtitle>Revenue breakdown by property</ion-card-subtitle>
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
              <td class="revenue">${{ formatCurrency(property.revenue) }}</td>
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

    <div class="loading-skeleton" v-else>
      <div v-for="i in 5" :key="i" class="skeleton-row">
        <ion-skeleton-text
          animated
          style="width: 200px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 80px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 60px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 100px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 80px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 60px; height: 20px"
        ></ion-skeleton-text>
        <ion-skeleton-text
          animated
          style="width: 80px; height: 20px"
        ></ion-skeleton-text>
      </div>
    </div>
  </ion-card>
</template>

<style scoped>
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

.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 0;
}

.skeleton-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

@media (max-width: 768px) {
  .table-container {
    font-size: 0.9rem;
  }

  .property-info {
    flex-direction: column;
    text-align: center;
  }
}
</style>
