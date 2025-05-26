<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import {
  locationOutline,
  cashOutline,
  peopleOutline,
  statsChartOutline,
  calendarOutline,
  checkmarkCircleOutline,
  hourglassOutline,
} from 'ionicons/icons';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import OwnerTabBarComponent from '@/components/tabbar/OwnerTabBarComponent.vue';
import { computed, ref } from 'vue';

const properties = ref([
  {
    id: 1,
    name: 'Elite Sports Arena',
    type: 'Multi-Sport Complex',
    location: 'Downtown Mumbai',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    pricePerHour: 2500,
    amenities: ['Parking', 'Locker Room', 'Cafeteria', 'AC'],
    rating: 4.8,
    totalBookings: 156,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Champions Cricket Ground',
    type: 'Cricket Ground',
    location: 'Andheri West',
    image:
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=200&fit=crop',
    pricePerHour: 3000,
    amenities: ['Parking', 'Changing Room', 'Floodlights'],
    rating: 4.6,
    totalBookings: 89,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Urban Football Club',
    type: 'Football Ground',
    location: 'Bandra East',
    image:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop',
    pricePerHour: 2000,
    amenities: ['Parking', 'Seating', 'Restrooms'],
    rating: 4.7,
    totalBookings: 124,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Pro Tennis Courts',
    type: 'Tennis Court',
    location: 'Juhu',
    image:
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=200&fit=crop',
    pricePerHour: 1800,
    amenities: ['Parking', 'Equipment Rental', 'Coaching'],
    rating: 4.9,
    totalBookings: 203,
    status: 'Active',
  },
]);

const revenueStats = ref({
  totalRevenue: 145000,
  todayRevenue: 8500,
  yesterdayRevenue: 12300,
  weeklyRevenue: 45600,
  monthlyRevenue: 98400,
  todayBookings: 12,
  pendingBookings: 5,
  completedBookings: 7,
  totalProperties: properties.value.length,
});

const showAllProperties = ref(false);
const displayedProperties = computed(() => {
  return showAllProperties.value
    ? properties.value
    : properties.value.slice(0, 3);
});

const navigateToPropertyDetails = (propertyId: number) => {
  // Navigate to property details page
  console.log('Navigate to property details:', propertyId);
  // router.push(`/owner/property/${propertyId}`);
};

const navigateToAllProperties = () => {
  showAllProperties.value = true;
};
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <div class="page-container">
        <!-- Revenue Stats Cards -->
        <div class="mb-8">
          <h2
            class="text-lg font-semibold text-[var(--ion-color-medium-shade)] mb-4"
          >
            Revenue Overview
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <!-- Total Revenue -->
            <div
              class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm">
                    <span class="block">Total</span> Revenue
                  </p>
                  <p class="text-2xl font-bold">
                    ₹{{ revenueStats.totalRevenue.toLocaleString() }}
                  </p>
                </div>
                <IonIcon :icon="cashOutline" class="text-2xl text-blue-200" />
              </div>
            </div>

            <!-- Today's Revenue -->
            <div
              class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm">
                    <span>
                      <span class="block">Today's</span>
                    </span>
                    Revenue
                  </p>
                  <p class="text-2xl font-bold">
                    ₹{{ revenueStats.todayRevenue.toLocaleString() }}
                  </p>
                </div>
                <IonIcon
                  :icon="statsChartOutline"
                  class="text-2xl text-green-200"
                />
              </div>
            </div>

            <!-- Today's Bookings -->
            <div
              class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm">
                    <span class="block">Today's</span> Bookings
                  </p>
                  <p class="text-2xl font-bold">
                    {{ revenueStats.todayBookings }}
                  </p>
                </div>
                <IonIcon
                  :icon="calendarOutline"
                  class="text-2xl text-purple-200"
                />
              </div>
            </div>

            <!-- Pending Bookings -->
            <div
              class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-orange-100 text-sm">
                    <span class="block">Pending</span> Bookings
                  </p>
                  <p class="text-2xl font-bold">
                    {{ revenueStats.pendingBookings }}
                  </p>
                </div>
                <IonIcon
                  :icon="hourglassOutline"
                  class="text-2xl text-orange-200"
                />
              </div>
            </div>
          </div>

          <!-- Additional Stats Row -->
          <div class="grid grid-cols-3 gap-3 mt-4">
            <div
              class="bg-[var(--ion-color-light-tint)] rounded-lg p-3 shadow-lg"
            >
              <div class="text-center">
                <p class="text-xs text-[var(--ion-color-dark)]">Yesterday</p>
                <p class="text-lg font-semibold text-[var(--ion-color-dark)]">
                  ₹{{ revenueStats.yesterdayRevenue.toLocaleString() }}
                </p>
              </div>
            </div>
            <div
              class="bg-[var(--ion-color-light-tint)] rounded-lg p-3 shadow-lg"
            >
              <div class="text-center">
                <p class="text-xs text-[var(--ion-color-dark)]">This Week</p>
                <p class="text-lg font-semibold text-[var(--ion-color-dark)]">
                  ₹{{ revenueStats.weeklyRevenue.toLocaleString() }}
                </p>
              </div>
            </div>
            <div
              class="bg-[var(--ion-color-light-tint)] rounded-lg p-3 shadow-lg"
            >
              <div class="text-center">
                <p class="text-xs text-[var(--ion-color-dark)]">Completed</p>
                <p
                  class="text-lg font-semibold text-[var(--ion-color-success)]"
                >
                  {{ revenueStats.completedBookings }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Properties Section -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2
              class="text-lg font-semibold text-[var(--ion-color-medium-shade)]"
            >
              My Properties
            </h2>
          </div>

          <!-- Properties Grid -->
          <div class="space-y-4">
            <div
              v-for="property in displayedProperties"
              :key="property.id"
              @click="navigateToPropertyDetails(property.id)"
              class="bg-[var(--ion-color-light-tint)] rounded-xl shadow-sm boverflow-hidden active:bg-[var(--ion-color-medium-tint)] transition-colors"
            >
              <div class="flex">
                <!-- Property Image -->
                <div class="w-24 flex-shrink-0">
                  <img
                    :src="property.image"
                    :alt="property.name"
                    class="w-full h-full object-cover"
                  />
                </div>

                <!-- Property Details -->
                <div class="flex-1 p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3
                        class="font-semibold text-[var(--ion-color-dark)] text-sm mb-1"
                      >
                        {{ property.name }}
                      </h3>
                      <p class="text-xs text-[var(--ion-color-medium)] mb-2">
                        {{ property.type }}
                      </p>

                      <div class="flex items-center mb-2">
                        <IonIcon
                          :icon="locationOutline"
                          class="text-[var(--ion-color-dark-tint)] text-xs mr-1"
                        />
                        <span
                          class="text-xs text-[var(--ion-color-dark-tint)]"
                          >{{ property.location }}</span
                        >
                      </div>

                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          <IonIcon
                            :icon="cashOutline"
                            class="text-[var(--ion-color-success)] text-xs mr-1"
                          />
                          <span
                            class="text-xs font-medium text-[var(--ion-color-success)]"
                            >₹{{ property.pricePerHour }}/hr</span
                          >
                        </div>
                        <div class="flex items-center">
                          <span class="text-xs text-yellow-600 mr-1"
                            >⭐ {{ property.rating }}</span
                          >
                          <span
                            class="text-xs text-[var(--ion-color-dark-tint)]"
                            >({{ property.totalBookings }})</span
                          >
                        </div>
                      </div>
                    </div>

                    <div class="flex-shrink-0 ml-3">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        <IonIcon
                          :icon="checkmarkCircleOutline"
                          class="w-3 h-3 mr-1"
                        />
                        {{ property.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="properties.length > 3 && !showAllProperties" class="mt-4">
            <IonButton
              expand="block"
              fill="outline"
              @click="navigateToAllProperties"
              class="h-12"
            >
              <IonIcon :icon="peopleOutline" slot="start" />
              View All Properties ({{ properties.length }})
            </IonButton>
          </div>
          <div v-if="showAllProperties" class="mt-4">
            <IonButton
              expand="block"
              fill="outline"
              @click="showAllProperties = false"
              class="h-12"
            >
              <IonIcon :icon="peopleOutline" slot="start" />
              View less
            </IonButton>
          </div>
        </div>
      </div>
    </IonContent>
    <OwnerTabBarComponent />
  </IonPage>
</template>

<style scoped>
.page-container {
  padding: 20px;
  padding-bottom: 30px;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.bg-white:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

.bg-gradient-to-r {
  background: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-500 {
  --tw-gradient-from: #3b82f6;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-blue-600 {
  --tw-gradient-to: #2563eb;
}

.from-green-500 {
  --tw-gradient-from: #10b981;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(16, 185, 129, 0));
}

.to-green-600 {
  --tw-gradient-to: #059669;
}

.from-purple-500 {
  --tw-gradient-from: #8b5cf6;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(139, 92, 246, 0));
}

.to-purple-600 {
  --tw-gradient-to: #7c3aed;
}

.from-orange-500 {
  --tw-gradient-from: #f97316;
  --tw-gradient-stops:
    var(--tw-gradient-from), var(--tw-gradient-to, rgba(249, 115, 22, 0));
}

.to-orange-600 {
  --tw-gradient-to: #ea580c;
}
</style>
