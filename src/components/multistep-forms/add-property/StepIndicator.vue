<template>
    <div class="step-indicator-container">
        <div class="step-indicator">
            <div
                v-for="(title, index) in stepTitles"
                :key="index"
                class="step"
                :class="{
                    completed: index < currentStep,
                    active: index === currentStep,
                }"
            >
                <div class="step-circle">
                    <ion-icon
                        v-if="index < currentStep"
                        :icon="checkmark"
                        class="check-icon"
                    />
                    <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="step-title">{{ title }}</div>
                <div
                    v-if="index < stepTitles.length - 1"
                    class="step-connector"
                    :class="{ completed: index < currentStep }"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { checkmark } from 'ionicons/icons';

defineProps<{
    currentStep: number;
    stepTitles: string[];
}>();
</script>

<style scoped>
.step-indicator-container {
    width: 100%;
    padding: 16px 8px;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.step-indicator {
    display: flex;
    position: relative;
    min-width: fit-content;
    width: 100%;
    justify-content: space-between;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    flex: 1;
    min-width: 80px;
    padding: 0 8px;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 16px;
    color: #757575;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    z-index: 2;
}

.step.completed .step-circle {
    background-color: var(--ion-color-success);
    color: var(--ion-color-light);
    border-color: var(--ion-color-success);
}

.step.active .step-circle {
    background-color: var(--ion-color-primary);
    color: var(--ion-color-light);
    border-color: var(--ion-color-primary);
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(56, 128, 255, 0.3);
}

.step-title {
    font-size: 12px;
    font-weight: 500;
    color: var(--ion-color-medium-tint);
    text-align: center;
    max-width: 100px;
    white-space: normal;
    line-height: 1.2;
    margin-top: 4px;
}

.step.active .step-title {
    color: var(--ion-color-primary-tint);
    font-weight: 600;
}

.step.completed .step-title {
    color: var(--ion-color-success);
}

.step-connector {
    position: absolute;
    top: 20px;
    left: 50%;
    right: -50%;
    height: 3px;
    background-color: #e0e0e0;
    z-index: 1;
}

.step-connector.completed {
    background-color: var(--ion-color-success);
}

.check-icon {
    font-size: 20px;
}

@media (max-width: 480px) {
    .step-indicator-container {
        padding: 12px 4px;
    }

    .step {
        min-width: 70px;
        padding: 0 4px;
    }

    .step-circle {
        width: 36px;
        height: 36px;
        font-size: 14px;
    }

    .step-title {
        font-size: 11px;
    }
}
</style>
