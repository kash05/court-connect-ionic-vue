<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IonItem, IonInput, IonText, IonNote, IonLabel } from '@ionic/vue';
import { watch, computed } from 'vue';

const schema = z.object({
  propertyName: z
    .string()
    .min(2, 'Facility name must be at least 2 characters')
    .nonempty('Facility name is required'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .nonempty('Description is required'),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: FormValues;
}>();

const emit = defineEmits<{
  'update-form': [payload: FormValues];
  'validation-change': [isValid: boolean];
}>();

const { errors, values, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

const { value: propertyName } = useField<string>('propertyName');
const { value: description } = useField<string>('description');

watch(values, (val) => emit('update-form', val as FormValues), {
  deep: true,
});

const isFormValid = computed(() => {
  return meta.value.valid;
});

watch(
  isFormValid,
  (valid) => {
    emit('validation-change', valid);
  },
  { immediate: true },
);
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
          v-model="propertyName"
          class="ion-no-padding"
        />

        <IonText color="danger" class="form-error" v-if="errors.propertyName">
          {{ errors.propertyName }}
        </IonText>
      </div>
    </IonItem>

    <IonItem class="form-item ion-no-padding">
      <div class="w-full">
        <IonLabel>Description</IonLabel>
        <IonNote class="helper-text"
          >Your property's name (e.g. Spartan Arena)</IonNote
        >
        <IonInput
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
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';
</style>
