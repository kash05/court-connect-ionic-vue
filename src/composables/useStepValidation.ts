import { ref, computed, watch } from 'vue';
import { useFormStore } from '@/stores/useFormStore';
import { stepSchemas } from '@/lib/validation/addPropertyFormValidation';

export function useStepValidation() {
    const formStore = useFormStore();

    const validationStatus = ref<Record<number, boolean>>({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
    });

    const validationErrors = ref<Record<number, string[]>>({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
    });

    /**
     * Validates a specific step using Zod schema
     * @param stepNumber - The step number to validate (1-5)
     * @returns boolean - Whether the step is valid
     */
    const validateStep = (stepNumber: number): boolean => {
        try {
            switch (stepNumber) {
                case 1:
                    return validateBasicInfo(formStore.propertyForm.basicInfo);
                case 2:
                    return validatePropertyDetails(
                        formStore.propertyForm.propertyDetail,
                    );
                case 3:
                    return validateTiming(
                        formStore.propertyForm.timingAndAvailability,
                    );
                case 4:
                    return validatePricing(
                        formStore.propertyForm.bookingAndPricing,
                    );
                case 5:
                    return validateMedia(formStore.propertyForm.media);
                default:
                    return false;
            }
        } catch (error) {
            console.error(`Validation error for step ${stepNumber}:`, error);
            return false;
        }
    };

    /**
     * Validates basic info step using Zod schema
     */
    const validateBasicInfo = (data: any): boolean => {
        try {
            stepSchemas.basicInfo.parse(data);
            validationErrors.value[1] = [];
            return true;
        } catch (error: any) {
            if (error.errors) {
                validationErrors.value[1] = error.errors.map(
                    (err: any) => err.message,
                );
            }
            return false;
        }
    };

    /**
     * Validates property details step using Zod schema
     */
    const validatePropertyDetails = (data: any): boolean => {
        try {
            stepSchemas.propertyDetail.parse(data);
            validationErrors.value[2] = [];
            return true;
        } catch (error: any) {
            if (error.errors) {
                validationErrors.value[2] = error.errors.map(
                    (err: any) => err.message,
                );
            }
            return false;
        }
    };

    /**
     * Validates timing and availability step using Zod schema
     */
    const validateTiming = (data: any): boolean => {
        try {
            stepSchemas.timingAndAvailability.parse(data);
            validationErrors.value[3] = [];
            return true;
        } catch (error: any) {
            if (error.errors) {
                validationErrors.value[3] = error.errors.map(
                    (err: any) => err.message,
                );
            }
            return false;
        }
    };

    /**
     * Validates booking and pricing step using Zod schema
     */
    const validatePricing = (data: any): boolean => {
        try {
            stepSchemas.bookingAndPricing.parse(data);
            validationErrors.value[4] = [];
            return true;
        } catch (error: any) {
            if (error.errors) {
                validationErrors.value[4] = error.errors.map(
                    (err: any) => err.message,
                );
            }
            return false;
        }
    };

    /**
     * Validates media step using Zod schema
     */
    const validateMedia = (data: any): boolean => {
        try {
            stepSchemas.media.parse(data);
            validationErrors.value[5] = [];
            return true;
        } catch (error: any) {
            if (error.errors) {
                validationErrors.value[5] = error.errors.map(
                    (err: any) => err.message,
                );
            }
            return false;
        }
    };

    /**
     * Checks if user can proceed to/from a specific step
     * @param stepNumber - Current step number
     * @returns boolean - Whether user can proceed
     */
    const canProceedToStep = (stepNumber: number): boolean => {
        return validateStep(stepNumber);
    };

    /**
     * Gets validation status for all steps
     * @returns Record<number, boolean> - Validation status for each step
     */
    const getAllValidationStatus = (): Record<number, boolean> => {
        const status: Record<number, boolean> = {};
        for (let i = 1; i <= 5; i++) {
            status[i] = validateStep(i);
        }
        return status;
    };

    /**
     * Updates validation status for all steps reactively
     */
    const updateAllValidationStatus = () => {
        for (let i = 1; i <= 5; i++) {
            validationStatus.value[i] = validateStep(i);
        }
    };

    /**
     * Validates the entire form across all steps
     * @returns boolean - Whether the entire form is valid
     */
    const validateEntireForm = (): boolean => {
        return Object.values(getAllValidationStatus()).every(Boolean);
    };

    /**
     * Gets validation errors for a specific step
     * @param stepNumber - Step number to get errors for
     * @returns string[] - Array of error messages
     */
    const getStepErrors = (stepNumber: number): string[] => {
        validateStep(stepNumber); // Trigger validation to populate errors
        return validationErrors.value[stepNumber] || [];
    };

    /**
     * Gets all validation errors across all steps
     * @returns Record<number, string[]> - Errors for each step
     */
    const getAllErrors = (): Record<number, string[]> => {
        // Trigger validation for all steps to populate errors
        for (let i = 1; i <= 5; i++) {
            validateStep(i);
        }
        return validationErrors.value;
    };

    /**
     * Computed property that returns validation status for all steps
     */
    const computedValidationStatus = computed(() => {
        return getAllValidationStatus();
    });

    /**
     * Computed property that checks if current step is valid
     */
    const isCurrentStepValid = (currentStep: number) =>
        computed(() => {
            return validateStep(currentStep);
        });

    /**
     * Watch for form changes and update validation status
     */
    watch(
        () => formStore.propertyForm,
        () => {
            updateAllValidationStatus();
        },
        { deep: true },
    );

    /**
     * Gets completion percentage of the form
     * @returns number - Percentage (0-100) of completed valid steps
     */
    const getCompletionPercentage = (): number => {
        const validSteps = Object.values(getAllValidationStatus()).filter(
            Boolean,
        ).length;
        return Math.round((validSteps / 5) * 100);
    };

    /**
     * Gets the next invalid step number (useful for navigation)
     * @returns number | null - Next invalid step number or null if all valid
     */
    const getNextInvalidStep = (): number | null => {
        const status = getAllValidationStatus();
        for (let i = 1; i <= 5; i++) {
            if (!status[i]) return i;
        }
        return null;
    };

    return {
        validateStep,
        canProceedToStep,
        getAllValidationStatus,
        validateEntireForm,

        getStepErrors,
        getAllErrors,
        validationErrors: computed(() => validationErrors.value),

        validationStatus: computed(() => validationStatus.value),
        computedValidationStatus,
        isCurrentStepValid,

        updateAllValidationStatus,
        getCompletionPercentage,
        getNextInvalidStep,

        validateBasicInfo,
        validatePropertyDetails,
        validateTiming,
        validatePricing,
        validateMedia,
    };
}

export function useStepSpecificValidation(stepNumber: number) {
    const { validateStep, getStepErrors, isCurrentStepValid } =
        useStepValidation();

    const isValid = isCurrentStepValid(stepNumber);
    const errors = computed(() => getStepErrors(stepNumber));

    const validate = () => validateStep(stepNumber);

    return {
        isValid,
        errors,
        validate,
    };
}
