<script setup lang="ts">
import { IonButton, IonIcon } from '@ionic/vue';
import { arrowBack, arrowForward, checkmark } from 'ionicons/icons';

defineProps<{
    currentStep: number;
    totalSteps: number;
    canProceed: string | boolean;
}>();

const emit = defineEmits(['prev', 'next', 'submit']);

const prevStep = () => emit('prev');
const nextStep = () => emit('next');
const submitForm = () => emit('submit');
</script>

<template>
    <div class="bottom-navigation-container">
        <div class="navigation-buttons">
            <ion-button
                v-if="currentStep > 1"
                fill="outline"
                class="prev-button ion-no-margin"
                @click="prevStep"
            >
                <ion-icon slot="start" :icon="arrowBack" />
                Previous
            </ion-button>

            <div class="right-buttons">
                <ion-button
                    v-if="currentStep < totalSteps"
                    class="next-button ion-no-margin"
                    @click="nextStep"
                    :disabled="!canProceed"
                >
                    Next
                    <ion-icon slot="end" :icon="arrowForward" />
                </ion-button>

                <ion-button
                    v-if="currentStep === totalSteps"
                    color="success"
                    class="submit-button ion-no-margin"
                    @click="submitForm"
                    :disabled="!canProceed"
                >
                    Submit
                    <ion-icon slot="end" :icon="checkmark" />
                </ion-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.bottom-navigation-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--ion-color-light);
    z-index: 1000;
    box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1);
    padding: 8px 16px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.navigation-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 768px;
}

.right-buttons {
    display: flex;
    flex: 1;
    justify-content: flex-end;
}

ion-button {
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
    --border-radius: 12px;
    font-weight: 500;
    --padding-start: 20px;
    --padding-end: 20px;
    transform: translateY(0);
    transition: transform 0.2s ease;
}

ion-button:active {
    transform: translateY(2px);
}

.prev-button {
    --border-color: var(--ion-color-medium);
    --color: var(--ion-color-medium);
    --background: transparent;
    --background-hover: rgba(var(--ion-color-medium-rgb), 0.04);
    --background-activated: rgba(var(--ion-color-medium-rgb), 0.08);
}

.next-button {
    --background: var(--ion-color-primary);
    --background-hover: var(--ion-color-primary-shade);
    --box-shadow: 0 4px 12px rgba(var(--ion-color-primary-rgb), 0.3);
}

.submit-button {
    --background: var(--ion-color-success);
    --background-hover: var(--ion-color-success-shade);
    --box-shadow: 0 4px 12px rgba(var(--ion-color-success-rgb), 0.3);
}

ion-button[disabled] {
    opacity: 0.3;
    --box-shadow: none;
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
    .bottom-navigation-container {
        padding-bottom: calc(12px + env(safe-area-inset-bottom));
    }
}

@media (max-width: 480px) {
    ion-button {
        --padding-start: 16px;
        --padding-end: 16px;
        font-size: 14px;
    }
}
</style>
