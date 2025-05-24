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
import { watch, onMounted, ref } from 'vue';
import { BasicInfoForm } from '@/types/addPropertyInterface';
import LocationMapComponent from './LocationMapComponent.vue';
import {
  BasicInfoFormData,
  basicInfoSchema,
} from '@/lib/validation/addPropertyFormValidation';

const props = defineProps<{
  formData: BasicInfoForm;
}>();

const emit = defineEmits<{
  'update-form': [payload: BasicInfoForm];
  'validation-change': [isValid: boolean];
}>();

const isModalOpen = ref(false);

onMounted(async () => {
  emit('validation-change', meta.value.valid);
});

const { errors, values, meta } = useForm<BasicInfoFormData>({
  validationSchema: toTypedSchema(basicInfoSchema),
  initialValues: props.formData,
});

const { value: name } = useField<string>('name');
const { value: description } = useField<string>('description');
const { value: address } = useField<string>('address');
const { value: latitude } = useField<number>('latitude');
const { value: longitude } = useField<number>('longitude');
const { value: contactPhone } = useField<string>('contactPhone');
const { value: contactEmail } = useField<string>('contactEmail');

watch(
  values,
  (val) => {
    emit('update-form', val as BasicInfoForm);
  },
  { deep: true },
);

watch(
  () => meta.value.valid,
  (valid) => {
    emit('validation-change', valid);
  },
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
};
</script>

<template>
  <div class="personal-details-form">
    <h2>Basic Info</h2>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Property Name</IonLabel>
        <IonNote class="helper-text"
          >Your property's name (e.g. Spartan Arena)</IonNote
        >
        <IonInput
          type="text"
          placeholder="Property Name"
          v-model="name"
          class="ion-no-padding"
        />
        <IonText color="danger" class="form-error" v-if="errors.name">
          {{ errors.name }}
        </IonText>
      </div>
    </IonItem>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Description</IonLabel>
        <IonNote class="helper-text"
          >Brief description of your property</IonNote
        >
        <IonTextarea
          type="text"
          placeholder="Description"
          v-model="description"
          class="description"
        />
        <IonText color="danger" class="form-error" v-if="errors.description">
          {{ errors.description }}
        </IonText>
      </div>
    </IonItem>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Address</IonLabel>
        <IonNote class="helper-text">Property location address</IonNote>
        <IonInput
          type="text"
          placeholder="Click to select location"
          v-model="address"
          readonly
          @click="openAddressModal"
          class="ion-no-padding"
        />
        <IonText color="danger" class="form-error" v-if="errors.address">
          {{ errors.address }}
        </IonText>
      </div>
    </IonItem>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Contact Phone</IonLabel>
        <IonNote class="helper-text"
          >Phone number for property inquiries</IonNote
        >
        <IonInput
          type="tel"
          placeholder="Phone Number"
          v-model="contactPhone"
          class="ion-no-padding"
        />
        <IonText color="danger" class="form-error" v-if="errors.contactPhone">
          {{ errors.contactPhone }}
        </IonText>
      </div>
    </IonItem>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Contact Email</IonLabel>
        <IonNote class="helper-text"
          >Email address for property inquiries</IonNote
        >
        <IonInput
          type="email"
          placeholder="Email Address"
          v-model="contactEmail"
          class="ion-no-padding"
        />
        <IonText color="danger" class="form-error" v-if="errors.contactEmail">
          {{ errors.contactEmail }}
        </IonText>
      </div>
    </IonItem>
  </div>

  <IonModal
    :is-open="isModalOpen"
    @didDismiss="closeAddressModal"
    class="location-modal"
    backdrop-dismiss="false"
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

.personal-details-form {
  max-height: calc(100vh - 240px);
  overflow: auto;
  padding: 16px;
}

.location-modal {
  --height: 100%;
  --width: 100%;
}
</style>
