<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  IonItem,
  IonInput,
  IonText,
  IonNote,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonToggle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/vue';
import { watch, onMounted, ref } from 'vue';
import { bookingAndPricingSchema } from '@/lib/validation/addPropertyFormValidation';
import { BookingAndPricingForm } from '@/types/addPropertyInterface';

const props = defineProps<{
  formData: BookingAndPricingForm;
}>();

const emit = defineEmits<{
  'update-form': [payload: BookingAndPricingForm];
  'validation-change': [isValid: boolean];
}>();

const showAdditionalFees = ref(false);
const showDiscounts = ref(false);

onMounted(async () => {
  emit('validation-change', meta.value.valid);

  if (props.formData.additionalFees) {
    const { lightingFee, equipmentFee, maintenanceSurcharge } =
      props.formData.additionalFees;
    if (lightingFee || equipmentFee || maintenanceSurcharge) {
      showAdditionalFees.value = true;
    }
  }

  if (props.formData.discounts) {
    const { earlyBirdPercent, multiDayDiscountPercent } =
      props.formData.discounts;
    if (earlyBirdPercent || multiDayDiscountPercent) {
      showDiscounts.value = true;
    }
  }
});

const { errors, values, meta } = useForm<BookingAndPricingForm>({
  validationSchema: toTypedSchema(bookingAndPricingSchema),
  initialValues: props.formData,
});

const { value: pricingModel } = useField<'hourly' | 'daily' | 'mixed'>(
  'pricingModel',
);
const { value: baseRate } = useField<number>('baseRate');
const { value: securityDeposit } = useField<number>('securityDeposit');
const { value: preBooking } = useField<boolean>('preBooking');
const { value: fullDayBooking } = useField<boolean>('fullDayBooking');

const { value: lightingFee } = useField<number | undefined>(
  'additionalFees.lightingFee',
);
const { value: equipmentFee } = useField<number | undefined>(
  'additionalFees.equipmentFee',
);
const { value: maintenanceSurcharge } = useField<number | undefined>(
  'additionalFees.maintenanceSurcharge',
);

const { value: earlyBirdPercent } = useField<number | undefined>(
  'discounts.earlyBirdPercent',
);
const { value: multiDayDiscountPercent } = useField<number | undefined>(
  'discounts.multiDayDiscountPercent',
);

const { value: freeWindowHours } = useField<number>(
  'cancellationPolicy.freeWindowHours',
);
const { value: feePercent } = useField<number>('cancellationPolicy.feePercent');
const { value: noShowCharge } = useField<number>(
  'cancellationPolicy.noShowCharge',
);

watch(
  values,
  (val) => {
    emit('update-form', val as BookingAndPricingForm);
  },
  { deep: true },
);

watch(
  () => meta.value.valid,
  (valid) => {
    emit('validation-change', valid);
  },
);

const toggleAdditionalFees = () => {
  showAdditionalFees.value = !showAdditionalFees.value;
  if (!showAdditionalFees.value) {
    lightingFee.value = undefined;
    equipmentFee.value = undefined;
    maintenanceSurcharge.value = undefined;
  }
};

const toggleDiscounts = () => {
  showDiscounts.value = !showDiscounts.value;
  if (!showDiscounts.value) {
    earlyBirdPercent.value = undefined;
    multiDayDiscountPercent.value = undefined;
  }
};
</script>

<template>
  <div class="booking-pricing-form">
    <h2>Booking & Pricing</h2>

    <!-- Pricing Model -->
    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Pricing Model</IonLabel>
        <IonNote class="helper-text"
          >How do you want to charge for your property?</IonNote
        >
        <IonSelect
          v-model="pricingModel"
          placeholder="Select pricing model"
          interface="popover"
        >
          <IonSelectOption value="hourly">Hourly</IonSelectOption>
          <IonSelectOption value="daily">Daily</IonSelectOption>
          <IonSelectOption value="mixed"
            >Mixed (Hourly & Daily)</IonSelectOption
          >
        </IonSelect>
        <IonText color="danger" class="form-error" v-if="errors.pricingModel">
          {{ errors.pricingModel }}
        </IonText>
      </div>
    </IonItem>

    <!-- Base Rate -->
    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Base Rate</IonLabel>
        <IonNote class="helper-text">
          {{
            pricingModel === 'hourly'
              ? 'Price per hour'
              : pricingModel === 'daily'
                ? 'Price per day'
                : 'Base price per hour/day'
          }}
        </IonNote>
        <IonInput
          type="number"
          placeholder="0.00"
          v-model="baseRate"
          class="ion-no-padding"
          min="0"
          step="0.01"
        />
        <IonText color="danger" class="form-error" v-if="errors.baseRate">
          {{ errors.baseRate }}
        </IonText>
      </div>
    </IonItem>

    <!-- Security Deposit -->
    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Security Deposit</IonLabel>
        <IonNote class="helper-text">Refundable deposit amount</IonNote>
        <IonInput
          type="number"
          placeholder="0.00"
          v-model="securityDeposit"
          class="ion-no-padding"
          min="0"
          step="0.01"
        />
        <IonText
          color="danger"
          class="form-error"
          v-if="errors.securityDeposit"
        >
          {{ errors.securityDeposit }}
        </IonText>
      </div>
    </IonItem>

    <!-- Booking Options -->
    <IonCard class="booking-options-card">
      <IonCardHeader>
        <IonCardTitle>Booking Options</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem class="form-item ion-no-padding">
          <IonLabel>Pre-booking Required</IonLabel>
          <IonToggle v-model="preBooking" slot="end" />
        </IonItem>
        <IonNote class="helper-text"
          >Require advance booking before use</IonNote
        >

        <IonItem class="form-item ion-no-padding">
          <IonLabel>Allow Full Day Booking</IonLabel>
          <IonToggle v-model="fullDayBooking" slot="end" />
        </IonItem>
        <IonNote class="helper-text"
          >Allow customers to book for entire days</IonNote
        >
      </IonCardContent>
    </IonCard>

    <!-- Additional Fees Section -->
    <IonCard class="additional-fees-card">
      <IonCardHeader>
        <IonCardTitle>Additional Fees</IonCardTitle>
        <IonItem class="form-item ion-no-padding">
          <IonLabel>Add Additional Fees</IonLabel>
          <IonCheckbox
            v-model="showAdditionalFees"
            @ionChange="toggleAdditionalFees"
            slot="end"
          />
        </IonItem>
      </IonCardHeader>

      <IonCardContent v-if="showAdditionalFees">
        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Lighting Fee</IonLabel>
            <IonNote class="helper-text"
              >Additional charge for lighting usage</IonNote
            >
            <IonInput
              type="number"
              placeholder="0.00"
              v-model="lightingFee"
              class="ion-no-padding"
              min="0"
              step="0.01"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['additionalFees.lightingFee']"
            >
              {{ errors['additionalFees.lightingFee'] }}
            </IonText>
          </div>
        </IonItem>

        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Equipment Fee</IonLabel>
            <IonNote class="helper-text"
              >Additional charge for equipment usage</IonNote
            >
            <IonInput
              type="number"
              placeholder="0.00"
              v-model="equipmentFee"
              class="ion-no-padding"
              min="0"
              step="0.01"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['additionalFees.equipmentFee']"
            >
              {{ errors['additionalFees.equipmentFee'] }}
            </IonText>
          </div>
        </IonItem>

        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Maintenance Surcharge</IonLabel>
            <IonNote class="helper-text"
              >Additional maintenance and cleaning fee</IonNote
            >
            <IonInput
              type="number"
              placeholder="0.00"
              v-model="maintenanceSurcharge"
              class="ion-no-padding"
              min="0"
              step="0.01"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['additionalFees.maintenanceSurcharge']"
            >
              {{ errors['additionalFees.maintenanceSurcharge'] }}
            </IonText>
          </div>
        </IonItem>
      </IonCardContent>
    </IonCard>

    <!-- Discounts Section -->
    <IonCard class="discounts-card">
      <IonCardHeader>
        <IonCardTitle>Discounts</IonCardTitle>
        <IonItem class="form-item ion-no-padding">
          <IonLabel>Add Discounts</IonLabel>
          <IonCheckbox
            v-model="showDiscounts"
            @ionChange="toggleDiscounts"
            slot="end"
          />
        </IonItem>
      </IonCardHeader>

      <IonCardContent v-if="showDiscounts">
        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Early Bird Discount (%)</IonLabel>
            <IonNote class="helper-text"
              >Discount for bookings made in advance</IonNote
            >
            <IonInput
              type="number"
              placeholder="0"
              v-model="earlyBirdPercent"
              class="ion-no-padding"
              min="0"
              max="100"
              step="1"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['discounts.earlyBirdPercent']"
            >
              {{ errors['discounts.earlyBirdPercent'] }}
            </IonText>
          </div>
        </IonItem>

        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Multi-Day Discount (%)</IonLabel>
            <IonNote class="helper-text"
              >Discount for multiple day bookings</IonNote
            >
            <IonInput
              type="number"
              placeholder="0"
              v-model="multiDayDiscountPercent"
              class="ion-no-padding"
              min="0"
              max="100"
              step="1"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['discounts.multiDayDiscountPercent']"
            >
              {{ errors['discounts.multiDayDiscountPercent'] }}
            </IonText>
          </div>
        </IonItem>
      </IonCardContent>
    </IonCard>

    <!-- Cancellation Policy -->
    <IonCard class="cancellation-policy-card">
      <IonCardHeader>
        <IonCardTitle>Cancellation Policy</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Free Cancellation Window (Hours)</IonLabel>
            <IonNote class="helper-text"
              >Hours before booking when cancellation is free</IonNote
            >
            <IonInput
              type="number"
              placeholder="24"
              v-model="freeWindowHours"
              class="ion-no-padding"
              min="0"
              step="1"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['cancellationPolicy.freeWindowHours']"
            >
              {{ errors['cancellationPolicy.freeWindowHours'] }}
            </IonText>
          </div>
        </IonItem>

        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>Cancellation Fee (%)</IonLabel>
            <IonNote class="helper-text"
              >Percentage of booking fee charged for late cancellation</IonNote
            >
            <IonInput
              type="number"
              placeholder="50"
              v-model="feePercent"
              class="ion-no-padding"
              min="0"
              max="100"
              step="1"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['cancellationPolicy.feePercent']"
            >
              {{ errors['cancellationPolicy.feePercent'] }}
            </IonText>
          </div>
        </IonItem>

        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonLabel>No-Show Charge</IonLabel>
            <IonNote class="helper-text"
              >Fixed charge for customers who don't show up</IonNote
            >
            <IonInput
              type="number"
              placeholder="0.00"
              v-model="noShowCharge"
              class="ion-no-padding"
              min="0"
              step="0.01"
            />
            <IonText
              color="danger"
              class="form-error"
              v-if="errors['cancellationPolicy.noShowCharge']"
            >
              {{ errors['cancellationPolicy.noShowCharge'] }}
            </IonText>
          </div>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';

.booking-pricing-form {
  height: max-content;
  overflow: auto;
  padding: 16px;
  margin-bottom: 50px;

  .booking-options-card,
  .additional-fees-card,
  .discounts-card,
  .cancellation-policy-card {
    margin: 16px 0;

    ion-card-header {
      padding-bottom: 8px;

      ion-card-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--ion-color-primary);
      }
    }

    ion-card-content {
      padding-top: 0;
    }
  }

  .helper-text {
    font-size: 12px;
    color: var(--ion-color-medium);
    display: block;
    margin-bottom: 8px;
  }

  .form-error {
    font-size: 12px;
    margin-top: 4px;
    display: block;
  }

  .form-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
