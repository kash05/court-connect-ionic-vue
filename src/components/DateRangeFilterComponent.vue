<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonDatetime,
    IonGrid,
    IonRow,
    IonCol,
} from '@ionic/vue';
import { calendarOutline, closeOutline } from 'ionicons/icons';

export interface FilterOption {
    value: string;
    label: string;
    icon?: string;
}

export interface FilterData {
    period: string;
    customDateRange?: {
        from: string;
        to: string;
    };
}

interface Props {
    availableFilters: FilterOption[];
    defaultFilter?: string;
    showIcon?: boolean;
    placeholder?: string;
    interface?: 'alert' | 'popover' | 'action-sheet';
    customRangeEnabled?: boolean;
}

type Emits = (e: 'filterChange', data: FilterData) => void;

const props = withDefaults(defineProps<Props>(), {
    defaultFilter: '',
    showIcon: true,
    placeholder: 'Select Period',
    interface: 'popover',
    customRangeEnabled: true,
});

const emit = defineEmits<Emits>();

const selectedFilter = ref<string>('');
const isCustomDateModalOpen = ref(false);
const customDateRange = ref({
    from: new Date().toISOString(),
    to: new Date().toISOString(),
});

onMounted(() => {
    if (
        props.defaultFilter &&
        props.availableFilters.some((f) => f.value === props.defaultFilter)
    ) {
        selectedFilter.value = props.defaultFilter;
        emitFilterChange();
    } else if (props.availableFilters.length > 0) {
        selectedFilter.value = props.availableFilters[0].value;
        emitFilterChange();
    }
});

watch(
    () => props.availableFilters,
    (newFilters) => {
        if (newFilters.length > 0 && !selectedFilter.value) {
            selectedFilter.value = newFilters[0].value;
            emitFilterChange();
        }
        if (
            selectedFilter.value &&
            !newFilters.some((f) => f.value === selectedFilter.value)
        ) {
            selectedFilter.value = newFilters[0]?.value || '';
            emitFilterChange();
        }
    },
    // { immediate: true },
);

const handleFilterChange = (event: CustomEvent) => {
    const selectedValue = event.detail.value;

    if (selectedValue === 'custom' && props.customRangeEnabled) {
        isCustomDateModalOpen.value = true;
    } else {
        selectedFilter.value = selectedValue;
        emitFilterChange();
    }
};

const emitFilterChange = () => {
    const filterData: FilterData = {
        period: selectedFilter.value,
    };

    if (selectedFilter.value === 'custom') {
        filterData.customDateRange = {
            from: customDateRange.value.from,
            to: customDateRange.value.to,
        };
    }

    emit('filterChange', filterData);
};

const applyCustomDateRange = () => {
    selectedFilter.value = 'custom';
    isCustomDateModalOpen.value = false;
    emitFilterChange();
};

const cancelCustomDateRange = () => {
    if (selectedFilter.value === 'custom') {
        selectedFilter.value = props.availableFilters[0]?.value || '';
    }
    isCustomDateModalOpen.value = false;
};

// const getCurrentFilterLabel = (): string => {
//   const option = props.availableFilters.find(
//     (opt) => opt.value === selectedFilter.value,
//   );
//   return option?.label || '';
// };

// const formatDateRange = (): string => {
//   if (
//     selectedFilter.value === 'custom' &&
//     customDateRange.value.from &&
//     customDateRange.value.to
//   ) {
//     const fromDate = new Date(customDateRange.value.from).toLocaleDateString();
//     const toDate = new Date(customDateRange.value.to).toLocaleDateString();
//     return `${fromDate} - ${toDate}`;
//   }
//   return '';
// };

const getFilterOptions = () => {
    const options = [...props.availableFilters];
    if (
        props.customRangeEnabled &&
        !options.some((opt) => opt.value === 'custom')
    ) {
        options.push({
            value: 'custom',
            label: 'Custom Range',
            icon: calendarOutline,
        });
    }
    return options;
};
</script>

<template>
    <div class="global-filter">
        <ion-item>
            <ion-select
                slot="end"
                :value="selectedFilter"
                @ionChange="handleFilterChange"
                :interface="interface"
                :placeholder="placeholder"
                class="filter-select"
            >
                <ion-select-option
                    v-for="option in getFilterOptions()"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </ion-select-option>
            </ion-select>
        </ion-item>

        <ion-modal
            :is-open="isCustomDateModalOpen"
            @didDismiss="cancelCustomDateRange"
        >
            <ion-header>
                <ion-toolbar color="light">
                    <ion-title>Select Date Range</ion-title>
                    <ion-buttons slot="end">
                        <ion-button fill="clear" @click="cancelCustomDateRange">
                            <ion-icon :icon="closeOutline"></ion-icon>
                        </ion-button>
                    </ion-buttons>
                </ion-toolbar>
            </ion-header>

            <ion-content class="ion-padding">
                <ion-grid>
                    <ion-row>
                        <ion-col size="12" size-md="6">
                            <ion-item>
                                <ion-label position="stacked"
                                    >From Date</ion-label
                                >
                                <ion-datetime
                                    v-model="customDateRange.from"
                                    presentation="date"
                                    :max="customDateRange.to"
                                ></ion-datetime>
                            </ion-item>
                        </ion-col>

                        <ion-col size="12" size-md="6">
                            <ion-item>
                                <ion-label position="stacked"
                                    >To Date</ion-label
                                >
                                <ion-datetime
                                    v-model="customDateRange.to"
                                    presentation="date"
                                    :min="customDateRange.from"
                                ></ion-datetime>
                            </ion-item>
                        </ion-col>
                    </ion-row>
                </ion-grid>

                <div class="modal-actions">
                    <ion-button
                        @click="applyCustomDateRange"
                        class="apply-button"
                    >
                        Apply Range
                    </ion-button>
                </div>
            </ion-content>
        </ion-modal>
    </div>
</template>

<style scoped>
.global-filter {
    width: 100%;
}

ion-item {
    --inner-border-width: 0;
}

.custom-range-text {
    font-size: 0.875rem;
    color: var(--ion-color-medium);
    font-weight: 400;
}

.apply-button {
    --background: var(--ion-color-primary);
    --color: var(--ion-color-medium-contrast);
}

@media (max-width: 768px) {
    .modal-actions {
        flex-direction: column;
        gap: 12px;
    }

    .cancel-button,
    .apply-button {
        width: 100%;
    }
}
</style>
