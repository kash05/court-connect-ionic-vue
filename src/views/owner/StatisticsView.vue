<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonSpinner } from '@ionic/vue';
import OwnerTabBarComponent from '@/components/tabbar/OwnerTabBarComponent.vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import StatisticsFilterComponent from '@/components/owner-stats/StatisticsFilterComponent.vue';
import RevenueChartComponent from '@/components/owner-stats/RevenueChartComponent.vue';
import BookingChartComponent from '@/components/owner-stats/BookingChartComponent.vue';
import BookingStatusOverviewComponent from '@/components/owner-stats/BookingStatusOverviewComponent.vue';
import PropertyPerformanceComponent from '@/components/owner-stats/PropertyPerformanceComponent.vue';
import PeakHoursChartComponent from '@/components/owner-stats/PeakHoursChartComponent.vue';
import StatisticsCardComponent from '@/components/owner-stats/StatisticsCardComponent.vue';

interface FilterData {
  period: string;
  customDateRange?: {
    from: string;
    to: string;
  };
}

const loading = ref(false);
const filterData = ref<FilterData>({
  period: 'thisMonth',
});

const handleFilterChange = (newFilterData: FilterData) => {
  filterData.value = newFilterData;
  // You can emit this data to child components or handle it here
  console.log('Filter changed:', newFilterData);
};

const handleRefresh = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));

  loading.value = false;
};
</script>

<template>
  <ion-page>
    <PageHeaderComponent />

    <ion-content>
      <StatisticsFilterComponent
        @filter-change="handleFilterChange"
        @refresh="handleRefresh"
      />

      <StatisticsCardComponent :filter-data="filterData" />

      <RevenueChartComponent />

      <BookingChartComponent />

      <BookingStatusOverviewComponent />

      <PropertyPerformanceComponent />

      <PeakHoursChartComponent />

      <div v-if="loading" class="loading-overlay">
        <div class="loading-container">
          <ion-spinner name="crescent" color="primary"></ion-spinner>
          <p>Refreshing statistics...</p>
        </div>
      </div>
    </ion-content>

    <OwnerTabBarComponent />
  </ion-page>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--ion-color-light);
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.loading-container p {
  margin: 0;
  color: var(--ion-color-medium);
  font-weight: 500;
}
</style>
