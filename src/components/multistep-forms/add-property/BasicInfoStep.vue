<template>
  <div class="personal-details-form">
    <h2>Basic Info</h2>

    <ion-list>
      <ion-item>
        <ion-label position="floating">Facility Name*</ion-label>
        <Field name="propertyName" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="text"
          />
          <ion-note slot="helper">
            Your facility’s name (e.g. Spartan Arena)
          </ion-note>
          <ion-note slot="error" v-if="errorMessage">{{
            errorMessage
          }}</ion-note>
        </Field>
      </ion-item>
      <!-- Description -->
      <ion-item>
        <ion-label position="floating">Description*</ion-label>
        <Field name="description" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="text"
          />
          <ion-note slot="helper">
            A short summary of your property and offerings
          </ion-note>
          <ion-note slot="error" v-if="errorMessage">{{
            errorMessage
          }}</ion-note>
        </Field>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IonList, IonItem, IonLabel, IonInput, IonNote } from '@ionic/vue';
import { watch } from 'vue';

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
  formData: {
    propertyName: string;
    description: string;
  };
}>();
const emit = defineEmits<(e: 'update-form', payload: FormValues) => void>();

const { values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(
  values,
  (val) => {
    emit('update-form', val as FormValues);
  },
  { deep: true },
);

function inputClass(error: string | undefined, value: string) {
  return {
    'ion-invalid': !!error,
    'ion-valid': !error && value,
  };
}
</script>

<style scoped>
.personal-details-form {
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--ion-color-primary);
}
</style>
