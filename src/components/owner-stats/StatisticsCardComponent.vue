<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonCard, IonCardContent, IonIcon, IonSkeletonText } from '@ionic/vue';
import {
    cashOutline,
    calendarOutline,
    businessOutline,
    starOutline,
    trendingUpOutline,
    trendingDownOutline,
} from 'ionicons/icons';
import GlobalFilter, {
    type FilterData,
    type FilterOption,
} from '../../components/DateRangeFilterComponent.vue';

interface Trend {
    type: 'positive' | 'negative';
    percentage: number;
    icon: string;
}

interface StatsData {
    totalRevenue: number;
    totalBookings: number;
    activeProperties: number;
    averageOccupancy: number;
    averageRating: number;
    totalReviews: number;
    revenueTrend: Trend;
    bookingsTrend: Trend;
}

const isLoading = ref(true);

const availableFilters: FilterOption[] = [
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisQuarter', label: 'This Quarter' },
    { value: 'lastQuarter', label: 'Last Quarter' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'lastYear', label: 'Last Year' },
];

const statsData = ref<StatsData>({
    totalRevenue: 0,
    totalBookings: 0,
    activeProperties: 0,
    averageOccupancy: 0,
    averageRating: 0,
    totalReviews: 0,
    revenueTrend: {
        type: 'positive',
        percentage: 0,
        icon: trendingUpOutline,
    },
    bookingsTrend: {
        type: 'positive',
        percentage: 0,
        icon: trendingUpOutline,
    },
});

onMounted(() => {});

const handleFilterChange = async (filterData: FilterData) => {
    isLoading.value = true;
    statsData.value = await fetchStatsData(filterData);
};

const fetchStatsData = async (filterData: FilterData): Promise<StatsData> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    isLoading.value = false;

    const baseData = {
        thisMonth: {
            totalRevenue: 45620,
            totalBookings: 312,
            revenueTrend: { type: 'positive' as const, percentage: 12.5 },
            bookingsTrend: { type: 'positive' as const, percentage: 8.3 },
        },
        lastMonth: {
            totalRevenue: 38450,
            totalBookings: 285,
            revenueTrend: { type: 'negative' as const, percentage: 5.2 },
            bookingsTrend: { type: 'positive' as const, percentage: 3.1 },
        },
        thisQuarter: {
            totalRevenue: 128400,
            totalBookings: 892,
            revenueTrend: { type: 'positive' as const, percentage: 16.8 },
            bookingsTrend: { type: 'positive' as const, percentage: 12.4 },
        },
        lastQuarter: {
            totalRevenue: 115200,
            totalBookings: 798,
            revenueTrend: { type: 'positive' as const, percentage: 8.9 },
            bookingsTrend: { type: 'positive' as const, percentage: 6.7 },
        },
        thisYear: {
            totalRevenue: 487200,
            totalBookings: 3456,
            revenueTrend: { type: 'positive' as const, percentage: 18.7 },
            bookingsTrend: { type: 'positive' as const, percentage: 15.2 },
        },
        lastYear: {
            totalRevenue: 398600,
            totalBookings: 2891,
            revenueTrend: { type: 'positive' as const, percentage: 22.1 },
            bookingsTrend: { type: 'positive' as const, percentage: 19.6 },
        },
        custom: {
            totalRevenue: 52300,
            totalBookings: 387,
            revenueTrend: { type: 'positive' as const, percentage: 15.8 },
            bookingsTrend: { type: 'positive' as const, percentage: 11.2 },
        },
    };

    const periodData =
        baseData[filterData.period as keyof typeof baseData] ||
        baseData.thisMonth;

    return {
        totalRevenue: periodData.totalRevenue,
        totalBookings: periodData.totalBookings,
        activeProperties: 8,
        averageOccupancy: 78,
        averageRating: 4.6,
        totalReviews: 245,
        revenueTrend: {
            type: periodData.revenueTrend.type,
            percentage: periodData.revenueTrend.percentage,
            icon:
                periodData.revenueTrend.type === 'positive'
                    ? trendingUpOutline
                    : trendingDownOutline,
        },
        bookingsTrend: {
            type: periodData.bookingsTrend.type,
            percentage: periodData.bookingsTrend.percentage,
            icon:
                periodData.bookingsTrend.type === 'positive'
                    ? trendingUpOutline
                    : trendingDownOutline,
        },
    };
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
</script>

<template>
    <div class="stats-container">
        <GlobalFilter
            :available-filters="availableFilters"
            default-filter="thisMonth"
            :custom-range-enabled="true"
            @filter-change="handleFilterChange"
        />

        <div class="stats-cards" v-if="!isLoading">
            <ion-card class="stat-card revenue">
                <ion-card-content>
                    <div class="stat-icon">
                        <ion-icon :icon="cashOutline"></ion-icon>
                    </div>
                    <div class="stat-info">
                        <h2>${{ formatCurrency(statsData.totalRevenue) }}</h2>
                        <p>Total Revenue</p>
                        <span
                            class="trend"
                            :class="statsData.revenueTrend.type"
                        >
                            <ion-icon
                                :icon="statsData.revenueTrend.icon"
                            ></ion-icon>
                            {{ statsData.revenueTrend.percentage }}% vs previous
                            period
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
                        <h2>{{ statsData.totalBookings }}</h2>
                        <p>Total Bookings</p>
                        <span
                            class="trend"
                            :class="statsData.bookingsTrend.type"
                        >
                            <ion-icon
                                :icon="statsData.bookingsTrend.icon"
                            ></ion-icon>
                            {{ statsData.bookingsTrend.percentage }}% vs
                            previous period
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
                        <h2>{{ statsData.activeProperties }}</h2>
                        <p>Active Properties</p>
                        <span class="occupancy-rate"
                            >{{ statsData.averageOccupancy }}% avg
                            occupancy</span
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
                        <h2>{{ statsData.averageRating.toFixed(1) }}</h2>
                        <p>Average Rating</p>
                        <span class="rating-count"
                            >{{ statsData.totalReviews }} reviews</span
                        >
                    </div>
                </ion-card-content>
            </ion-card>
        </div>

        <!-- Skeleton Loading -->
        <div class="skeleton-cards" v-else>
            <ion-card v-for="i in 4" :key="i" class="stat-card skeleton">
                <ion-card-content>
                    <div class="skeleton-content">
                        <ion-skeleton-text
                            animated
                            style="
                                width: 60px;
                                height: 60px;
                                border-radius: 12px;
                            "
                        ></ion-skeleton-text>
                        <div class="skeleton-info">
                            <ion-skeleton-text
                                animated
                                style="width: 80px; height: 32px"
                            ></ion-skeleton-text>
                            <ion-skeleton-text
                                animated
                                style="width: 100px; height: 16px"
                            ></ion-skeleton-text>
                            <ion-skeleton-text
                                animated
                                style="width: 120px; height: 14px"
                            ></ion-skeleton-text>
                        </div>
                    </div>
                </ion-card-content>
            </ion-card>
        </div>
    </div>
</template>

<style scoped>
.stats-container {
    width: 100%;
}

.stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    padding: 0 16px 16px;
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

.skeleton-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    padding: 16px;
}

.skeleton-content {
    display: flex;
    align-items: center;
    gap: 16px;
}

.skeleton-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
}

@media (max-width: 768px) {
    .stats-cards,
    .skeleton-cards {
        grid-template-columns: 1fr;
    }

    .filter-section {
        padding: 12px;
    }
}
</style>
