<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { IonPage, IonContent, useIonRouter } from '@ionic/vue';
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
import FooterComponent from '@/components/multistep-forms/add-property/FooterComponent.vue';

const formStore = useFormStore();
const ionRouter = useIonRouter();

const currentStep = ref(1);
const totalSteps = 8;

const validationStatus = reactive<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
});

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

onMounted(async () => {
  await formStore.initializeForm();
});

const canProceed = computed(() => {
  return validationStatus[currentStep.value];
});

const updateValidationStatus = (step: number, isValid: boolean) => {
  validationStatus[step] = isValid;
  console.log(validationStatus[step]);
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

function cancelForm() {
  ionRouter.push('/owner');
}
</script>

<template>
  <ion-page>
    <HeaderComponent @cancel="cancelForm" />
    <ion-content class="ion-padding">
      <StepIndicator
        :current-step="currentStep - 1"
        :step-titles="stepTitles"
      />

      <BasicInfoStep
        v-if="currentStep === 1"
        :form-data="formStore.formData.basicInfo"
        @update-form="formStore.updateBasicInfo"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(1, isValid)
        "
      />

      <ContactDetailsStep
        v-if="currentStep === 2"
        :form-data="formStore.formData.contactDetails"
        @update-form="formStore.updateContactDetails"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(2, isValid)
        "
      />

      <LocationStep
        v-if="currentStep === 3"
        :form-data="formStore.formData.location"
        @update-form="formStore.updateLocation"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(3, isValid)
        "
      />

      <SportsDetailsStep
        v-if="currentStep === 4"
        :form-data="formStore.formData.sportsDetails"
        @update-form="formStore.updateSportsDetails"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(4, isValid)
        "
      />

      <TimingAvailabilityStep
        v-if="currentStep === 5"
        :form-data="formStore.formData.timingAndAvailability"
        @update-form="formStore.updateTimingAndAvailability"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(5, isValid)
        "
      />

      <BookingSettingsStep
        v-if="currentStep === 6"
        :form-data="formStore.formData.bookingSettings"
        @update-form="formStore.updateBookingSettings"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(6, isValid)
        "
      />

      <AmenitiesPoliciesStep
        v-if="currentStep === 7"
        :form-data="formStore.formData.amenitiesAndPolicies"
        @update-form="formStore.updateAmenitiesAndPolicies"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(7, isValid)
        "
      />

      <MediaStep
        v-if="currentStep === 8"
        :form-data="formStore.formData.media"
        @update-form="formStore.updateMedia"
        @validation-change="
          (isValid: boolean) => updateValidationStatus(8, isValid)
        "
      />

      <FooterComponent
        :current-step="currentStep"
        :total-steps="totalSteps"
        :can-proceed="canProceed"
        @prev="currentStep--"
        @next="currentStep++"
        @submit="submitForm"
      />
    </ion-content>
  </ion-page>
</template>
