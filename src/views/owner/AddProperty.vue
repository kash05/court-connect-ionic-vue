<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { IonPage, IonContent, useIonRouter, IonSpinner } from '@ionic/vue';
import { useFormStore } from '@/stores/useFormStore';
import BasicInfoStep from '@/components/multistep-forms/add-property/BasicInfoStep.vue';
import HeaderComponent from '@/components/multistep-forms/add-property/HeaderComponent.vue';
import StepIndicator from '@/components/multistep-forms/add-property/StepIndicator.vue';
import FooterComponent from '@/components/multistep-forms/add-property/FooterComponent.vue';

const formStore = useFormStore();
const ionRouter = useIonRouter();

const currentStep = ref(1);
const totalSteps = 5;
const isInitialized = ref(false);

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
    await formStore.initializeForm();
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
      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="bubbles"></ion-spinner>
      </div>

      <div v-else>
        <StepIndicator
          :current-step="currentStep - 1"
          :step-titles="stepTitles"
        />

        <BasicInfoStep
          v-if="currentStep === 1"
          :form-data="formStore.formData.basicInfo"
          @update-form="(val) => formStore.updateForm({ basicInfo: val })"
          @validation-change="
            (isValid: boolean) => updateValidationStatus(1, isValid)
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
