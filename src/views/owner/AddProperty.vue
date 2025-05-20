<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { arrowBack, arrowForward, checkmark } from 'ionicons/icons';
import { useFormStore } from '@/stores/useFormStore';

import BasicInfoStep from '@/components/multistep-forms/add-property/BasicInfoStep.vue';
import ContactDetailsStep from '@/components/multistep-forms/add-property/ContactDetailsStep.vue';
import LocationStep from '@/components/multistep-forms/add-property/LocationStep.vue';
import SportsDetailsStep from '@/components/multistep-forms/add-property/SportsDetailStep.vue';
import TimingAvailabilityStep from '@/components/multistep-forms/add-property/TimingAndAvailabilityStep.vue';
import BookingSettingsStep from '@/components/multistep-forms/add-property/BookingSettingStep.vue';
import AmenitiesPoliciesStep from '@/components/multistep-forms/add-property/AmmenitiesAndPoliciesStep.vue';
import MediaStep from '@/components/multistep-forms/add-property/MediaStep.vue';
import HeaderComponent from '@/components/multistep-forms/add-property/HeaderComponent.vue';
import StepIndicator from '@/components/multistep-forms/add-property/StepIndicator.vue';

const formStore = useFormStore();

const currentStep = ref(1);
const totalSteps = 8;

const stepTitles = [
  'Basic Info',
  'Contact Details',
  'Location',
  'Sports Details',
  'Timing & Availability',
  'Booking Settings',
  'Amenities & Policies',
  'Media',
];

const canProceed = computed(() => {
  const { formData } = formStore;
  switch (currentStep.value) {
    case 1:
      return formData.basicInfo.propertyName && formData.basicInfo.description;
    case 2:
      return (
        formData.contactDetails.phoneNumber && formData.contactDetails.email
      );
    case 3:
      return formData.location.address;
    case 4:
      return formData.sportsDetails.sportsAvailable.length > 0;
    case 5:
      return (
        formData.timingAndAvailability.openingTime &&
        formData.timingAndAvailability.closingTime
      );
    case 6:
      return true;
    case 7:
      return true;
    case 8:
      return formData.media.images.length > 0;
    default:
      return false;
  }
});

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const submitForm = async () => {
  try {
    console.log(formStore.formData);
    alert('Form submitted successfully!');
    formStore.resetForm();
    currentStep.value = 1;
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit form. Please try again.');
  }
};

onMounted(() => {
  formStore.initializeForm();
});
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <StepIndicator
        :current-step="currentStep - 1"
        :step-titles="stepTitles"
      />

      <BasicInfoStep
        v-if="currentStep === 1"
        :form-data="formStore.formData.basicInfo"
        @update-form="formStore.updateBasicInfo"
      />

      <ContactDetailsStep
        v-if="currentStep === 2"
        :form-data="formStore.formData.contactDetails"
        @update-form="formStore.updateContactDetails"
      />

      <LocationStep
        v-if="currentStep === 3"
        :form-data="formStore.formData.location"
        @update-form="formStore.updateLocation"
      />

      <SportsDetailsStep
        v-if="currentStep === 4"
        :form-data="formStore.formData.sportsDetails"
        @update-form="formStore.updateSportsDetails"
      />

      <TimingAvailabilityStep
        v-if="currentStep === 5"
        :form-data="formStore.formData.timingAndAvailability"
        @update-form="formStore.updateTimingAndAvailability"
      />

      <BookingSettingsStep
        v-if="currentStep === 6"
        :form-data="formStore.formData.bookingSettings"
        @update-form="formStore.updateBookingSettings"
      />

      <AmenitiesPoliciesStep
        v-if="currentStep === 7"
        :form-data="formStore.formData.amenitiesAndPolicies"
        @update-form="formStore.updateAmenitiesAndPolicies"
      />

      <MediaStep
        v-if="currentStep === 8"
        :form-data="formStore.formData.media"
        @update-form="formStore.updateMedia"
      />

      <div class="navigation-buttons ion-padding">
        <ion-button v-if="currentStep > 1" fill="outline" @click="prevStep">
          <ion-icon slot="start" :icon="arrowBack" />
          Previous
        </ion-button>

        <ion-button
          v-if="currentStep < totalSteps"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Next
          <ion-icon slot="end" :icon="arrowForward" />
        </ion-button>

        <ion-button
          v-if="currentStep === totalSteps"
          color="success"
          @click="submitForm"
          :disabled="!canProceed"
        >
          Submit
          <ion-icon slot="end" :icon="checkmark" />
        </ion-button>
      </div>
    </ion-content>
    <HeaderComponent />
  </ion-page>
</template>

<style scoped>
.step-indicator {
  margin: 15px 0;
  font-weight: bold;
}
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
