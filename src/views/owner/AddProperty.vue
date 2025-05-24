<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  reactive,
  ComponentPublicInstance,
} from 'vue';
import { IonPage, IonContent, useIonRouter, IonSpinner } from '@ionic/vue';
import { useFormStore } from '@/stores/useFormStore';
import BasicInfoStep from '@/components/multistep-forms/add-property/BasicInfoStep.vue';
import HeaderComponent from '@/components/multistep-forms/add-property/HeaderComponent.vue';
import StepIndicator from '@/components/multistep-forms/add-property/StepIndicator.vue';
import FooterComponent from '@/components/multistep-forms/add-property/FooterComponent.vue';
import PropertyDetail from '@/components/multistep-forms/add-property/PropertyDetail.vue';
import TimingAndAvailabilityStep from '@/components/multistep-forms/add-property/TimingAndAvailabilityStep.vue';
import GlobalMessage from '@/components/GlobalMessage.vue';
import BookinAndPricingForm from '@/components/multistep-forms/add-property/BookinAndPricingForm.vue';
import MediaStep from '@/components/multistep-forms/add-property/MediaStep.vue';

const formStore = useFormStore();
const ionRouter = useIonRouter();

const currentStep = ref(1);
const totalSteps = 5;
const isInitialized = ref(false);
const content = ref<ComponentPublicInstance<typeof IonContent> | null>(null);

const validationStatus = reactive<Record<number, boolean>>({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
});

const stepTitles = [
  'Basic Info',
  'Property Details',
  'Timing and availability',
  'Booking and pricing',
  'Media',
];

const isLoading = ref<boolean>(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    await formStore.loadFormData();
    isInitialized.value = true;
    isLoading.value = false;
  } catch (error) {
    console.error('Error initializing form:', error);
    isLoading.value = false;
  }
});

const canProceed = computed(() => {
  if (!isInitialized.value) return false;
  return validationStatus[currentStep.value];
});

const updateValidationStatus = (step: number, isValid: boolean) => {
  validationStatus[step] = isValid;
};

const submitForm = async () => {
  try {
    alert('Form submitted successfully!');
    // formStore.resetForm();
    currentStep.value = 1;
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Failed to submit form. Please try again.');
  }
};

function cancelForm() {
  ionRouter.push('/owner');
}

function scrollToTop() {
  content.value?.$el?.scrollToTop?.(500);
}
</script>

<template>
  <ion-page>
    <HeaderComponent @cancel="cancelForm" />
    <ion-content class="ion-padding" ref="content">
      <StepIndicator
        :current-step="currentStep - 1"
        :step-titles="stepTitles"
      />

      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="bubbles"></ion-spinner>
      </div>

      <div v-else>
        <GlobalMessage
          type="info"
          message="These settings can be modified later in your 'My Properties' section after registration."
        />
        <BasicInfoStep
          v-if="currentStep === 1"
          :form-data="formStore.propertyForm.basicInfo"
          @update-form="
            (val) => formStore.updatePropertyForm({ basicInfo: val })
          "
          @validation-change="
            (isValid: boolean) => updateValidationStatus(1, isValid)
          "
        />

        <PropertyDetail
          v-if="currentStep === 2"
          :form-data="formStore.propertyForm.propertyDetail"
          @update-form="
            (val) => formStore.updatePropertyForm({ propertyDetail: val })
          "
          @validation-change="
            (isValid: boolean) => updateValidationStatus(2, isValid)
          "
        />

        <TimingAndAvailabilityStep
          v-if="currentStep === 3"
          :form-data="formStore.propertyForm.timingAndAvailability"
          @update-form="
            (val) =>
              formStore.updatePropertyForm({ timingAndAvailability: val })
          "
          @validation-change="
            (isValid: boolean) => updateValidationStatus(3, isValid)
          "
        />

        <BookinAndPricingForm
          v-if="currentStep === 4"
          :form-data="formStore.propertyForm.bookingAndPricing"
          @update-form="
            (val) => formStore.updatePropertyForm({ bookingAndPricing: val })
          "
          @validation-change="
            (isValid: boolean) => updateValidationStatus(4, isValid)
          "
        />

        <MediaStep
          v-if="currentStep === 5"
          :form-data="formStore.propertyForm.media"
          @update-form="(val) => formStore.updatePropertyForm({ media: val })"
          @validation-change="
            (isValid: boolean) => updateValidationStatus(5, isValid)
          "
        />

        <FooterComponent
          :current-step="currentStep"
          :total-steps="totalSteps"
          :can-proceed="canProceed"
          @prev="
            {
              scrollToTop();
              currentStep--;
            }
          "
          @next="
            {
              scrollToTop();
              currentStep++;
            }
          "
          @submit="submitForm"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  ion-spinner {
    margin-bottom: 20px;
  }
}
</style>
