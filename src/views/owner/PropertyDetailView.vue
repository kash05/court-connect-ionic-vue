<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/vue';
import {
  saveOutline,
  cashOutline,
  calendarOutline,
  peopleOutline,
  trendingUpOutline,
  locationOutline,
  timeOutline,
  settingsOutline,
  imagesOutline,
  cardOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { onMounted, ref } from 'vue';

import { useFormStore } from '@/stores/useFormStore';
import BasicInfoStep from '@/components/multistep-forms/add-property/BasicInfoStep.vue';
import PropertyDetail from '@/components/multistep-forms/add-property/PropertyDetail.vue';
import TimingAndAvailabilityStep from '@/components/multistep-forms/add-property/TimingAndAvailabilityStep.vue';
import BookinAndPricingForm from '@/components/multistep-forms/add-property/BookinAndPricingForm.vue';
import MediaStep from '@/components/multistep-forms/add-property/MediaStep.vue';
import { useRouter } from 'vue-router';
import { useStepValidation } from '@/composables/useStepValidation';

const router = useRouter();

const formStore = useFormStore();

const { validateEntireForm } = useStepValidation();

const propertyStats = ref({
  totalRevenue: 45000,
  monthlyRevenue: 15600,
  todayBookings: 4,
  totalBookings: 156,
  averageRating: 4.8,
  occupancyRate: 78,
});

const activeTab = ref('basic');

onMounted(() => {
  initializePropertyData();
});

const initializePropertyData = () => {
  formStore.setPropertyForm({
    basicInfo: {
      name: 'Elite Sports Arena',
      description:
        'A premium multi-sport facility with state-of-the-art equipment and professional-grade surfaces. Perfect for tournaments and casual games.',
      address: '123 Sports Complex, Downtown Mumbai, Maharashtra 400001',
      latitude: 19.076,
      longitude: 72.8777,
      contactPhone: '+91 98765 43210',
      contactEmail: 'contact@elitesportsarena.com',
    },
    propertyDetail: {
      sports: ['Football', 'Cricket', 'Basketball', 'Tennis'],
      subUnits: {
        'Football Ground': 2,
        'Cricket Pitch': 1,
        'Basketball Court': 2,
        'Tennis Court': 4,
      },
      surfaceType: 'Artificial Turf',
      facilities: [
        'Parking',
        'Locker Room',
        'Cafeteria',
        'First Aid',
        'Security',
      ],
      equipmentRental: true,
      accessibility: [
        'Wheelchair Access',
        'Disabled Parking',
        'Accessible Restrooms',
      ],
      additionalAmenities: [
        'WiFi',
        'Air Conditioning',
        'Sound System',
        'Scoreboard',
      ],
    },
    timingAndAvailability: {
      openingHours: {
        open: '06:00',
        close: '22:00',
      },
      bookingMode: 'slots',
      slotDuration: 60,
      maxAdvanceDays: 30,
      minNoticeHours: 2,
    },
    bookingAndPricing: {
      pricingModel: 'hourly',
      baseRate: 2500,
      additionalFees: {
        lightingFee: 300,
        equipmentFee: 200,
        maintenanceSurcharge: 100,
      },
      securityDeposit: 5000,
      preBooking: true,
      fullDayBooking: true,
      discounts: {
        earlyBirdPercent: 10,
        multiDayDiscountPercent: 15,
      },
      cancellationPolicy: {
        freeWindowHours: 24,
        feePercent: 25,
        noShowCharge: 50,
      },
    },
    media: {
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400&h=300&fit=crop',
      ],
      videoUrl: 'https://example.com/property-video.mp4',
      floorPlan: 'https://example.com/floor-plan.pdf',
    },
  });
};

const saveProperty = () => {
  console.log('Saving property:', formStore.propertyForm);
  // Handle save logic here - you can access all form data from formStore.propertyForm
  // Example: API call to update property
  // updateProperty(propertyId, formStore.propertyForm);
};

const goBack = () => {
  router.push('/owner');
};
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <IonButton slot="start" @click="goBack" size="small">
          <IonIcon :icon="arrowBackOutline" slot="start" />
        </IonButton>
        <IonTitle>{{
          formStore.propertyForm.basicInfo?.name || 'Property Details'
        }}</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <!-- Property Stats Section -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card primary">
            <IonIcon :icon="cashOutline" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">
                ₹{{ propertyStats.totalRevenue.toLocaleString() }}
              </div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>

          <div class="stat-card success">
            <IonIcon :icon="trendingUpOutline" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">
                ₹{{ propertyStats.monthlyRevenue.toLocaleString() }}
              </div>
              <div class="stat-label">This Month</div>
            </div>
          </div>

          <div class="stat-card secondary">
            <IonIcon :icon="calendarOutline" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ propertyStats.todayBookings }}</div>
              <div class="stat-label">Today's Bookings</div>
            </div>
          </div>

          <div class="stat-card tertiary">
            <IonIcon :icon="peopleOutline" class="stat-icon" />
            <div class="stat-content">
              <div class="stat-value">{{ propertyStats.totalBookings }}</div>
              <div class="stat-label">Total Bookings</div>
            </div>
          </div>
        </div>

        <!-- Additional Stats Row -->
        <div class="additional-stats">
          <div class="mini-stat">
            <span class="mini-stat-label">Rating</span>
            <span class="mini-stat-value"
              >⭐ {{ propertyStats.averageRating }}</span
            >
          </div>
          <div class="mini-stat">
            <span class="mini-stat-label">Occupancy</span>
            <span class="mini-stat-value"
              >{{ propertyStats.occupancyRate }}%</span
            >
          </div>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="tabs-container">
        <IonSegment v-model="activeTab" color="light">
          <IonSegmentButton value="basic">
            <IonIcon :icon="locationOutline" />
            <IonLabel>Basic Info</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="details">
            <IonIcon :icon="settingsOutline" />
            <IonLabel>Details</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="timing">
            <IonIcon :icon="timeOutline" />
            <IonLabel>Timing</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="pricing">
            <IonIcon :icon="cardOutline" />
            <IonLabel>Pricing</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="media">
            <IonIcon :icon="imagesOutline" />
            <IonLabel>Media</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Basic Info Tab -->
        <div v-if="activeTab === 'basic'" class="tab-panel">
          <BasicInfoStep />
        </div>

        <!-- Property Details Tab -->
        <div v-if="activeTab === 'details'" class="tab-panel">
          <PropertyDetail />
        </div>

        <!-- Timing & Availability Tab -->
        <div v-if="activeTab === 'timing'" class="tab-panel">
          <TimingAndAvailabilityStep />
        </div>

        <!-- Booking & Pricing Tab -->
        <div v-if="activeTab === 'pricing'" class="tab-panel">
          <BookinAndPricingForm />
        </div>

        <!-- Media Tab -->
        <div v-if="activeTab === 'media'" class="tab-panel">
          <MediaStep />
        </div>
      </div>

      <!-- Save Button -->
      <div class="save-section">
        <IonButton
          expand="block"
          @click="saveProperty"
          color="success"
          size="large"
          :disabled="!validateEntireForm()"
        >
          <IonIcon :icon="saveOutline" slot="start" />
          Save Changes
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.stats-section {
  padding: 16px;
  background: var(--ion-color-light);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  color: var(--ion-color-light);
  gap: 12px;
}

.stat-card.primary {
  background: var(--ion-color-primary);
}

.stat-card.success {
  background: var(--ion-color-success);
}

.stat-card.secondary {
  background: var(--ion-color-secondary);
}

.stat-card.tertiary {
  background: var(--ion-color-tertiary);
}

.stat-icon {
  font-size: 24px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 2px;
}

.additional-stats {
  display: flex;
  gap: 8px;
}

.mini-stat {
  flex: 1;
  background: var(--ion-color-light);
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid var(--ion-color-light-shade);
}

.mini-stat-label {
  display: block;
  font-size: 11px;
  color: var(--ion-color-medium);
  margin-bottom: 2px;
}

.mini-stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.tabs-container {
  background: var(--ion-color-light);
  border-bottom: 1px solid var(--ion-color-light-shade);
}

.tabs-container ion-segment-button {
  padding-top: 4px;
  padding-bottom: 4px;
}

.tabs-container ion-segment-button.segment-button-checked {
  color: var(--ion-color-primary);
}

.tab-content {
  padding: 16px;
  padding-bottom: 100px;
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 6px;
  background: var(--ion-color-light);
  border-top: 1px solid var(--ion-color-light-shade);
  z-index: 1000;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>
