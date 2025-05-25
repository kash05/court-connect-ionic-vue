<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  IonItem,
  IonInput,
  IonText,
  IonNote,
  IonLabel,
  IonModal,
  IonTextarea,
} from '@ionic/vue';
import { watch, onMounted, ref, computed } from 'vue';
import { useFormStore } from '@/stores/useFormStore';
import LocationMapComponent from './LocationMapComponent.vue';
import {
  BasicInfoFormData,
  basicInfoSchema,
} from '@/lib/validation/addPropertyFormValidation';

const formStore = useFormStore();

const formData = computed(() => formStore.propertyForm.basicInfo);

const isModalOpen = ref(false);

const { errors, values, setValues } = useForm<BasicInfoFormData>({
  validationSchema: toTypedSchema(basicInfoSchema),
  initialValues: formData.value,
});

const { value: name } = useField<string>('name');
const { value: description } = useField<string>('description');
const { value: address } = useField<string>('address');
const { value: latitude } = useField<number>('latitude');
const { value: longitude } = useField<number>('longitude');
const { value: contactPhone } = useField<string>('contactPhone');
const { value: contactEmail } = useField<string>('contactEmail');

onMounted(() => {
  if (formData.value) {
    setValues(formData.value);
  }
});

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
        basicInfo: newValues as any,
      });
    }
  },
  { deep: true },
);

const openAddressModal = () => {
  isModalOpen.value = true;
};

const closeAddressModal = () => {
  isModalOpen.value = false;
};

const handleLocationSelected = (location: {
  latitude: number;
  longitude: number;
  address: string;
}) => {
  latitude.value = location.latitude;
  longitude.value = location.longitude;
  address.value = location.address;
  closeAddressModal();
};

const getFieldError = (fieldName: keyof BasicInfoFormData) => {
  return errors.value[fieldName];
};

const hasFieldError = (fieldName: keyof BasicInfoFormData) => {
  return !!errors.value[fieldName];
};
</script>

<template>
  <div class="basic-info-form">
    <div class="form-header">
      <h2>Basic Info</h2>
    </div>

    <div class="form-fields">
      <IonItem class="form-item ion-no-padding">
        <div class="w-full">
          <IonLabel>Property Name *</IonLabel>
          <IonNote class="helper-text">
            Your property's name (e.g. Spartan Arena)
          </IonNote>
          <IonInput
            type="text"
            placeholder="Property Name"
            v-model="name"
            class="ion-no-padding"
            :class="{ valid: name && !hasFieldError('name') }"
          />
          <IonText
            color="danger"
            class="form-error"
            v-if="hasFieldError('name')"
          >
            {{ getFieldError('name') }}
          </IonText>
        </div>
      </IonItem>

      <IonItem class="form-item ion-no-padding">
        <div class="w-full">
          <IonLabel>Description *</IonLabel>
          <IonNote class="helper-text">
            Brief description of your property (minimum 10 characters)
          </IonNote>
          <IonTextarea
            placeholder="Describe your property, facilities, and what makes it special..."
            v-model="description"
            class="description"
            :rows="4"
            :class="{ valid: description && !hasFieldError('description') }"
          />
          <div class="char-counter">
            {{ (description || '').length }}/500 characters
          </div>
          <IonText
            color="danger"
            class="form-error"
            v-if="hasFieldError('description')"
          >
            {{ getFieldError('description') }}
          </IonText>
        </div>
      </IonItem>

      <IonItem class="form-item ion-no-padding">
        <div class="w-full">
          <IonLabel>Address *</IonLabel>
          <IonNote class="helper-text">Property location address</IonNote>
          <IonInput
            type="text"
            placeholder="Click to select location"
            v-model="address"
            readonly
            @click="openAddressModal"
            class="ion-no-padding address-input"
            :class="{ valid: address && !hasFieldError('address') }"
          />
          <IonText
            color="danger"
            class="form-error"
            v-if="hasFieldError('address')"
          >
            {{ getFieldError('address') }}
          </IonText>
        </div>
      </IonItem>

      <IonItem class="form-item ion-no-padding">
        <div class="w-full">
          <IonLabel>Contact Phone *</IonLabel>
          <IonNote class="helper-text">
            Phone number for property inquiries
          </IonNote>
          <IonInput
            type="tel"
            placeholder="+1 (555) 123-4567"
            v-model="contactPhone"
            class="ion-no-padding"
            :class="{ valid: contactPhone && !hasFieldError('contactPhone') }"
          />
          <IonText
            color="danger"
            class="form-error"
            v-if="hasFieldError('contactPhone')"
          >
            {{ getFieldError('contactPhone') }}
          </IonText>
        </div>
      </IonItem>

      <IonItem class="form-item ion-no-padding">
        <div class="w-full">
          <IonLabel>Contact Email *</IonLabel>
          <IonNote class="helper-text">
            Email address for property inquiries
          </IonNote>
          <IonInput
            type="email"
            placeholder="contact@yourproperty.com"
            v-model="contactEmail"
            class="ion-no-padding"
            :class="{ valid: contactEmail && !hasFieldError('contactEmail') }"
          />
          <IonText
            color="danger"
            class="form-error"
            v-if="hasFieldError('contactEmail')"
          >
            {{ getFieldError('contactEmail') }}
          </IonText>
        </div>
      </IonItem>
    </div>
  </div>

  <IonModal
    :is-open="isModalOpen"
    @didDismiss="closeAddressModal"
    class="location-modal"
    :backdrop-dismiss="false"
  >
    <LocationMapComponent
      :initial-latitude="latitude"
      :initial-longitude="longitude"
      :initial-address="address"
      @location-selected="handleLocationSelected"
      @close="closeAddressModal"
    />
  </IonModal>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';

.basic-info-form {
  height: max-content;
  overflow: auto;
  padding: 16px;
  margin-bottom: 50px;
}

.form-header {
  margin-bottom: 24px;

  h2 {
    margin: 0 0 16px 0;
    color: var(--ion-color-primary);
    font-size: 24px;
    font-weight: 600;
  }
}

.form-fields {
  .form-item {
    border: 1px solid var(--ion-color-light);
    border-radius: 8px;
    margin-bottom: 10px;
    transition: all 0.2s ease;

    &.has-error {
      border-color: var(--ion-color-danger);
      background: var(--ion-color-danger-tint);
    }

    .w-full {
      width: 100%;
    }

    ion-label {
      font-weight: 600;
      color: var(--ion-color-dark);
      margin-bottom: 4px;
      display: block;
    }

    .helper-text {
      display: block;
      margin-bottom: 12px;
      font-size: 14px;
      color: var(--ion-color-medium);
    }

    ion-input,
    ion-textarea {
      &.valid {
        border-color: var(--ion-color-success);
      }

      &.address-input {
        cursor: pointer;

        &:hover {
          background: var(--ion-color-light-tint);
        }
      }
    }

    .description {
      min-height: 100px;
    }

    .char-counter {
      text-align: right;
      font-size: 12px;
      color: var(--ion-color-medium);
      margin-top: 4px;
    }

    .form-error {
      display: block;
      margin-top: 8px;
      font-size: 14px;
    }
  }
}

.location-modal {
  --height: 100%;
  --width: 100%;
}

@media (max-width: 768px) {
  .basic-info-form {
    padding: 12px;
  }
}
</style>
