<script setup lang="ts">
import { ref, computed, onMounted, ComponentPublicInstance } from 'vue';
import { IonPage, IonContent, useIonRouter, IonSpinner } from '@ionic/vue';
import { useFormStore } from '@/stores/useFormStore';
import { useStepValidation } from '@/composables/useStepValidation';
import BasicInfoStep from '@/components/multistep-forms/add-property/BasicInfoStep.vue';
import HeaderComponent from '@/components/multistep-forms/add-property/HeaderComponent.vue';
import StepIndicator from '@/components/multistep-forms/add-property/StepIndicator.vue';
import FooterComponent from '@/components/multistep-forms/add-property/FooterComponent.vue';
import GlobalMessage from '@/components/GlobalMessage.vue';
import PropertyDetail from '@/components/multistep-forms/add-property/PropertyDetail.vue';
import TimingAndAvailabilityStep from '@/components/multistep-forms/add-property/TimingAndAvailabilityStep.vue';
import BookinAndPricingForm from '@/components/multistep-forms/add-property/BookinAndPricingForm.vue';
import MediaStep from '@/components/multistep-forms/add-property/MediaStep.vue';

const formStore = useFormStore();
const ionRouter = useIonRouter();

const {
    canProceedToStep,
    validateEntireForm,
    getCompletionPercentage,
    getNextInvalidStep,
    computedValidationStatus,
} = useStepValidation();

const currentStep = ref(1);
const totalSteps = 5;
const isInitialized = ref(false);
const content = ref<ComponentPublicInstance<typeof IonContent> | null>(null);

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
    } catch (error) {
        console.error('Error initializing form:', error);
    } finally {
        isLoading.value = false;
    }
});

const canProceed = computed(() => {
    if (!isInitialized.value) return false;
    return canProceedToStep(currentStep.value);
});

const completionPercentage = computed(() => {
    if (!isInitialized.value) return 0;
    return getCompletionPercentage();
});

const validationStatus = computed(() => {
    if (!isInitialized.value) return {};
    return computedValidationStatus.value;
});

const nextStep = () => {
    if (canProceed.value && currentStep.value < totalSteps) {
        currentStep.value++;
        scrollToTop();
    }
};

const prevStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--;
        scrollToTop();
    }
};

const submitForm = async () => {
    try {
        if (!validateEntireForm()) {
            const firstInvalidStep = getNextInvalidStep();

            if (firstInvalidStep) {
                currentStep.value = firstInvalidStep;
                alert(
                    `Please complete step ${firstInvalidStep}: ${stepTitles[firstInvalidStep - 1]}`,
                );
                return;
            }
        }

        alert('Form submitted successfully!');
        // formStore.resetForm();
        // ionRouter.push('/owner/properties');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
    }
};

function cancelForm() {
    ionRouter.push('/owner');
}

function refreshForm() {
    window.location.reload();
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
                :validation-status="validationStatus"
                :completion-percentage="completionPercentage"
            />

            <div v-if="isLoading" class="loading-container">
                <ion-spinner name="bubbles"></ion-spinner>
                <p>Loading form data...</p>
            </div>

            <div v-else-if="!isInitialized" class="error-container">
                <p>Failed to load form data. Please try refreshing the page.</p>
                <button @click="() => refreshForm()">Refresh</button>
            </div>

            <div v-else>
                <GlobalMessage
                    type="info"
                    message="These settings can be modified later in your 'My Properties' section after registration."
                />

                <BasicInfoStep v-if="currentStep === 1" />

                <PropertyDetail v-if="currentStep === 2" />

                <TimingAndAvailabilityStep v-if="currentStep === 3" />

                <BookinAndPricingForm v-if="currentStep === 4" />

                <MediaStep v-if="currentStep === 5" />

                <FooterComponent
                    :current-step="currentStep"
                    :total-steps="totalSteps"
                    :can-proceed="canProceed"
                    @prev="prevStep"
                    @next="nextStep"
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
    height: 200px;
    gap: 16px;

    ion-spinner {
        transform: scale(1.2);
    }

    p {
        color: var(--ion-color-medium);
        font-size: 14px;
    }
}

.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 16px;
    padding: 20px;

    p {
        color: var(--ion-color-danger);
        text-align: center;
    }

    button {
        background: var(--ion-color-primary);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;

        &:hover {
            background: var(--ion-color-primary-shade);
        }
    }
}
</style>
