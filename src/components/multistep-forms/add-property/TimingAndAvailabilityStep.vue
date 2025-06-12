<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
    IonItem,
    IonText,
    IonNote,
    IonLabel,
    IonCheckbox,
    IonChip,
    IonDatetime,
    IonIcon,
} from '@ionic/vue';
import { watch, onMounted, computed } from 'vue';
import { timeOutline, calendarOutline, settingsOutline } from 'ionicons/icons';
import {
    TimingAndAvailabilityFormData,
    timingAndAvailabilitySchema,
} from '@/lib/validation/addPropertyFormValidation';
import { useFormStore } from '@/stores/useFormStore';

const formStore = useFormStore();

const formData = computed(() => formStore.propertyForm.timingAndAvailability);

const BOOKING_MODES = [
    {
        value: 'slots' as const,
        label: 'Time Slots',
        description: 'Customers book specific time slots',
    },
    {
        value: 'full-day' as const,
        label: 'Full Day',
        description: 'Customers book entire day access',
    },
];

const SLOT_DURATION_OPTIONS = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 240, label: '4 hours' },
];

const MAX_ADVANCE_OPTIONS = [
    { value: 1, label: '1 day' },
    { value: 3, label: '3 days' },
    { value: 7, label: '1 week' },
    { value: 14, label: '2 weeks' },
    { value: 30, label: '1 month' },
    { value: 60, label: '2 months' },
    { value: 90, label: '3 months' },
];

const MIN_NOTICE_OPTIONS = [
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 4, label: '4 hours' },
    { value: 8, label: '8 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' },
    { value: 48, label: '48 hours' },
];

onMounted(() => {
    if (formData.value) {
        setValues(formData.value);
    }
});
const { errors, values, setValues } = useForm<TimingAndAvailabilityFormData>({
    validationSchema: toTypedSchema(timingAndAvailabilitySchema),
    initialValues: formData.value,
});

const { value: openingHours } = useField<{ open: string; close: string }>(
    'openingHours',
);
const { value: bookingModes } =
    useField<('slots' | 'full-day')[]>('bookingModes');
const { value: slotDurations } = useField<number[]>('slotDurations');
const { value: maxAdvanceDays } = useField<number>('maxAdvanceDays');
const { value: minNoticeHours } = useField<number>('minNoticeHours');

watch(
    formData,
    (newData) => {
        if (newData) {
            setValues(newData);
        }
    },
    { deep: true, immediate: true },
);

watch(
    values,
    (newValues) => {
        if (newValues && Object.keys(newValues).length > 0) {
            formStore.updatePropertyForm({
                timingAndAvailability: newValues,
            });
        }
    },
    { deep: true },
);

const toggleBookingMode = (mode: 'slots' | 'full-day') => {
    const currentModes = bookingModes.value || [];
    if (currentModes.includes(mode)) {
        bookingModes.value = currentModes.filter((m) => m !== mode);
        if (mode === 'slots' && !bookingModes.value.includes('slots')) {
            slotDurations.value = [];
        }
    } else {
        bookingModes.value = [...currentModes, mode];
    }
};

const toggleSlotDuration = (duration: number) => {
    const currentDurations = slotDurations.value || [];
    if (currentDurations.includes(duration)) {
        slotDurations.value = currentDurations.filter((d) => d !== duration);
    } else {
        slotDurations.value = [...currentDurations, duration].sort(
            (a, b) => a - b,
        );
    }
};

const selectedBookingModes = computed(() => bookingModes.value || []);
const selectedSlotDurations = computed(() => slotDurations.value || []);
const showSlotDurations = computed(() =>
    selectedBookingModes.value.includes('slots'),
);

const updateOpeningHour = (type: 'open' | 'close', value: string) => {
    openingHours.value = {
        ...openingHours.value,
        [type]: value,
    };
};

const formatTimeForInput = (time: string) => {
    if (!time) return '';
    return time.includes('T') ? time : `2024-01-01T${time}:00`;
};

const formatTimeFromInput = (isoString: string) => {
    if (!isoString) return '';
    return isoString.split('T')[1]?.substring(0, 5) || '';
};

const getFieldError = (fieldName: keyof TimingAndAvailabilityFormData) => {
    return errors.value[fieldName];
};

const hasFieldError = (fieldName: keyof TimingAndAvailabilityFormData) => {
    return !!errors.value[fieldName];
};
</script>

<template>
    <div class="timing-availability-form">
        <h2>Timing & Availability</h2>
        <p class="subtitle">
            Set your property's operating hours and booking preferences
        </p>

        <!-- Opening Hours -->
        <div class="form-section">
            <IonLabel class="section-label">
                <IonIcon :icon="timeOutline" class="label-icon" />
                Operating Hours *
            </IonLabel>
            <IonNote class="helper-text">
                Set your property's daily opening and closing times
            </IonNote>

            <div class="time-inputs">
                <IonItem class="time-item">
                    <div class="time-input-container">
                        <IonLabel>Opening Time *</IonLabel>
                        <IonDatetime
                            presentation="time"
                            :prefer-wheel="true"
                            :value="
                                formatTimeForInput(
                                    openingHours?.open || '09:00',
                                )
                            "
                            @ionChange="
                                updateOpeningHour(
                                    'open',
                                    formatTimeFromInput(
                                        $event.detail.value as string,
                                    ),
                                )
                            "
                            class="time-picker"
                            :show-default-buttons="true"
                            :show-clear-button="false"
                        >
                            <div slot="title">Select Opening Time</div>
                        </IonDatetime>
                    </div>
                </IonItem>

                <IonItem class="time-item">
                    <div class="time-input-container">
                        <IonLabel>Closing Time *</IonLabel>
                        <IonDatetime
                            presentation="time"
                            :prefer-wheel="true"
                            :value="
                                formatTimeForInput(
                                    openingHours?.close || '21:00',
                                )
                            "
                            @ionChange="
                                updateOpeningHour(
                                    'close',
                                    formatTimeFromInput(
                                        $event.detail.value as string,
                                    ),
                                )
                            "
                            class="time-picker"
                            :show-default-buttons="true"
                            :show-clear-button="false"
                        >
                            <div slot="title">Select Closing Time</div>
                        </IonDatetime>
                    </div>
                </IonItem>
            </div>

            <IonText
                color="danger"
                class="form-error"
                v-if="hasFieldError('openingHours')"
            >
                {{ getFieldError('openingHours') }}
            </IonText>
        </div>

        <!-- Booking Modes -->
        <div class="form-section">
            <IonLabel class="section-label">
                <IonIcon :icon="calendarOutline" class="label-icon" />
                Booking Methods *
            </IonLabel>
            <IonNote class="helper-text">
                Choose how customers can book your property (multiple selections
                allowed)
            </IonNote>

            <div class="booking-modes">
                <div
                    v-for="mode in BOOKING_MODES"
                    :key="mode.value"
                    class="booking-mode-card"
                    :class="{
                        selected: selectedBookingModes.includes(mode.value),
                    }"
                    @click="toggleBookingMode(mode.value)"
                >
                    <div class="mode-header">
                        <IonCheckbox
                            :checked="selectedBookingModes.includes(mode.value)"
                            @ion-change="toggleBookingMode(mode.value)"
                        />
                        <h4 class="mode-title">{{ mode.label }}</h4>
                    </div>
                    <p class="mode-description">{{ mode.description }}</p>
                </div>
            </div>

            <IonText
                color="danger"
                class="form-error"
                v-if="hasFieldError('bookingMode')"
            >
                {{ getFieldError('bookingMode') }}
            </IonText>
        </div>

        <!-- Slot Durations (only show if slots mode is selected) -->
        <div v-if="showSlotDurations" class="form-section">
            <IonLabel class="section-label">
                <IonIcon :icon="timeOutline" class="label-icon" />
                Available Slot Durations *
            </IonLabel>
            <IonNote class="helper-text">
                Select the time slot durations customers can book (multiple
                selections allowed)
            </IonNote>

            <div class="chip-container">
                <IonChip
                    v-for="option in SLOT_DURATION_OPTIONS"
                    :key="option.value"
                    :color="
                        selectedSlotDurations.includes(option.value)
                            ? 'primary'
                            : 'medium'
                    "
                    :outline="!selectedSlotDurations.includes(option.value)"
                    @click="toggleSlotDuration(option.value)"
                    class="duration-chip"
                >
                    {{ option.label }}
                </IonChip>
            </div>

            <IonText
                color="danger"
                class="form-error"
                v-if="hasFieldError('slotDuration')"
            >
                {{ getFieldError('slotDuration') }}
            </IonText>
        </div>

        <!-- Max Advance Days -->
        <div class="form-section">
            <IonLabel class="section-label">
                <IonIcon :icon="calendarOutline" class="label-icon" />
                Maximum Advance Booking *
            </IonLabel>
            <IonNote class="helper-text">
                How far in advance can customers make bookings?
            </IonNote>

            <div class="chip-container">
                <IonChip
                    v-for="option in MAX_ADVANCE_OPTIONS"
                    :key="option.value"
                    :color="
                        maxAdvanceDays === option.value ? 'primary' : 'medium'
                    "
                    :outline="maxAdvanceDays !== option.value"
                    @click="maxAdvanceDays = option.value"
                    class="advance-chip"
                >
                    {{ option.label }}
                </IonChip>
            </div>

            <IonText
                color="danger"
                class="form-error"
                v-if="hasFieldError('maxAdvanceDays')"
            >
                {{ getFieldError('maxAdvanceDays') }}
            </IonText>
        </div>

        <!-- Min Notice Hours -->
        <div class="form-section">
            <IonLabel class="section-label">
                <IonIcon :icon="settingsOutline" class="label-icon" />
                Minimum Notice Required *
            </IonLabel>
            <IonNote class="helper-text">
                How much advance notice do you need for bookings?
            </IonNote>

            <div class="chip-container">
                <IonChip
                    v-for="option in MIN_NOTICE_OPTIONS"
                    :key="option.value"
                    :color="
                        minNoticeHours === option.value ? 'primary' : 'medium'
                    "
                    :outline="minNoticeHours !== option.value"
                    @click="minNoticeHours = option.value"
                    class="notice-chip"
                >
                    {{ option.label }}
                </IonChip>
            </div>

            <IonText
                color="danger"
                class="form-error"
                v-if="hasFieldError('minNoticeHours')"
            >
                {{ getFieldError('minNoticeHours') }}
            </IonText>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';

.timing-availability-form {
    height: max-content;
    overflow: auto;
    padding: 16px;
    margin-bottom: 50px;
}

.subtitle {
    color: var(--ion-color-medium);
    font-size: 14px;
    margin-bottom: 24px;
    line-height: 1.4;
}

.form-section {
    margin-bottom: 32px;
}

.section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: var(--ion-color-dark);
    margin-bottom: 8px;

    .label-icon {
        font-size: 18px;
        color: var(--ion-color-primary);
    }
}

.helper-text {
    display: block;
    margin-bottom: 16px;
    color: var(--ion-color-medium);
    font-size: 14px;
    line-height: 1.4;
}

.time-inputs {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;

    .time-item {
        flex: 1;
        overflow: hidden;

        .time-input-container {
            width: 100%;
            padding: 16px;
        }
    }
}

ion-datetime {
    --background: var(--ion-color-light);
    --wheel-highlight-background: var(--ion-color-light);
}

ion-datetime::part(wheel-item) {
    color: var(--ion-color-tertialry);
}

ion-datetime::part(wheel-item active) {
    color: var(--ion-color-primary);
}

.booking-modes {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 8px;
}

.booking-mode-card {
    border: 2px solid var(--ion-color-light);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--ion-color-primary-tint);
        background: rgba(var(--ion-color-primary-rgb), 0.02);
    }

    &.selected {
        border-color: var(--ion-color-primary);
        background: rgba(var(--ion-color-primary-rgb), 0.05);
    }

    .mode-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
    }

    .mode-title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--ion-color-dark);
    }

    .mode-description {
        margin: 0;
        font-size: 14px;
        color: var(--ion-color-medium);
        line-height: 1.4;
    }
}

.chip-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
}

.duration-chip,
.advance-chip,
.notice-chip {
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        transform: translateY(-1px);
    }
}

.form-error {
    display: block;
    font-size: 12px;
    margin-top: 8px;
}

@media (max-width: 768px) {
    .time-inputs {
        flex-direction: column;
        gap: 12px;
    }

    .chip-container {
        gap: 6px;
    }

    .duration-chip,
    .advance-chip,
    .notice-chip {
        font-size: 12px;
        --padding-start: 8px;
        --padding-end: 8px;
    }

    .booking-mode-card {
        padding: 12px;
    }
}
</style>
