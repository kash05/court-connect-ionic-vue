<script setup lang="ts">
import { ref } from 'vue';
import {
    IonPage,
    IonContent,
    IonSpinner,
    IonSegment,
    IonSegmentButton,
    IonLabel,
} from '@ionic/vue';
import OwnerTabBarComponent from '@/components/tabbar/OwnerTabBarComponent.vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import RevenueChartComponent from '@/components/owner-stats/RevenueChartComponent.vue';
import BookingChartComponent from '@/components/owner-stats/BookingChartComponent.vue';
import BookingStatusOverviewComponent from '@/components/owner-stats/BookingStatusOverviewComponent.vue';
import PropertyPerformanceComponent from '@/components/owner-stats/PropertyPerformanceComponent.vue';
import PeakHoursChartComponent from '@/components/owner-stats/PeakHoursChartComponent.vue';
import StatisticsCardComponent from '@/components/owner-stats/StatisticsCardComponent.vue';

const loading = ref(false);
const activeTab = ref('stats');

const handleTabChange = (event: CustomEvent) => {
    activeTab.value = event.detail.value;
};
</script>

<template>
    <ion-page>
        <PageHeaderComponent />
        <ion-content :scroll-y="false">
            <div class="tab-container">
                <ion-segment
                    :value="activeTab"
                    @ionChange="handleTabChange"
                    mode="md"
                    class="custom-segment"
                >
                    <ion-segment-button value="stats">
                        <ion-label>Stats</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="analytics">
                        <ion-label>Analytics</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </div>

            <div class="scrollable-content">
                <div v-show="activeTab === 'stats'" class="tab-panel">
                    <StatisticsCardComponent />
                    <BookingStatusOverviewComponent />
                    <PropertyPerformanceComponent />
                </div>

                <div v-show="activeTab === 'analytics'" class="tab-panel">
                    <RevenueChartComponent />
                    <BookingChartComponent />
                    <PeakHoursChartComponent />
                </div>
            </div>

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
.tab-container {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 16px;
    background: var(--ion-color-light);
    border-bottom: 1px solid var(--ion-color-light-shade);
}

.custom-segment {
    --background: var(--ion-color-light);
    --indicator-color: var(--ion-color-primary);
    --color-checked: var(--ion-color-primary);
    --color: var(--ion-color-dark);
    border-radius: 8px;
    background: var(--ion-color-step-50);
}

.scrollable-content {
    height: calc(100vh - 160px);
    overflow-y: auto;
    padding-bottom: 40px;
}

.tab-panel {
    padding: 16px 0;
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
