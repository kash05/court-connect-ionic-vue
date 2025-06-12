<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonDatetime,
} from '@ionic/vue';
import { refreshOutline } from 'ionicons/icons';

interface FilterData {
    period: string;
    customDateRange?: {
        from: string;
        to: string;
    };
}

const emit = defineEmits<{
    filterChange: [filterData: FilterData];
    refresh: [];
}>();

defineProps<{
    loading?: boolean;
}>();

const selectedPeriod = ref('thisMonth');
const customDateRange = reactive({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
});

const onPeriodChange = (event: CustomEvent) => {
    selectedPeriod.value = event.detail.value;
    emitFilterChange();
};

const onDateRangeChange = () => {
    if (selectedPeriod.value === 'custom') {
        emitFilterChange();
    }
};

const emitFilterChange = () => {
    const filterData: FilterData = {
        period: selectedPeriod.value,
    };

    if (selectedPeriod.value === 'custom') {
        filterData.customDateRange = {
            from: customDateRange.from,
            to: customDateRange.to,
        };
    }

    emit('filterChange', filterData);
};

const handleRefresh = () => {
    emit('refresh');
};

emitFilterChange();
</script>

<template>
    <div class="filter-section">
        <ion-item>
            <ion-label>Time Period</ion-label>
            <ion-select
                v-model="selectedPeriod"
                @ionChange="onPeriodChange"
                interface="popover"
                placeholder="Select Period"
            >
                <ion-select-option value="thisMonth"
                    >This Month</ion-select-option
                >
                <ion-select-option value="lastMonth"
                    >Last Month</ion-select-option
                >
                <ion-select-option value="thisYear"
                    >This Year</ion-select-option
                >
                <ion-select-option value="lastYear"
                    >Last Year</ion-select-option
                >
                <ion-select-option value="custom"
                    >Custom Range</ion-select-option
                >
            </ion-select>
            <ion-button
                @click="handleRefresh"
                fill="solid"
                color="primary"
                size="small"
                :disabled="loading"
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
</template>

<style scoped>
.filter-section {
    padding: 16px;
    background: var(--ion-color-light);
    margin-bottom: 16px;
}

.custom-date-range {
    margin-top: 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

@media (max-width: 768px) {
    .custom-date-range {
        grid-template-columns: 1fr;
    }
}
</style>
