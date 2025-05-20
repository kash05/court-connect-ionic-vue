<template>
  <div class="form-step">
    <h2>Timing & Availability</h2>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Opening Time*</ion-label>
        <Field name="openingTime" v-slot="{ field, errorMessage }">
          <ion-input
            type="time"
            v-bind="field"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
          />
          <ion-note slot="error" v-if="errorMessage">{{
            errorMessage
          }}</ion-note>
        </Field>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Closing Time*</ion-label>
        <Field name="closingTime" v-slot="{ field, errorMessage }">
          <ion-input
            type="time"
            v-bind="field"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
          />
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
  openingTime: z.string().nonempty('Opening time is required'),
  closingTime: z.string().nonempty('Closing time is required'),
  isAvailable: z.boolean(),
  sportSlots: z.record(z.any()).optional(),
});

const props = defineProps<{
  formData: {
    openingTime: string;
    closingTime: string;
    sportSlots: Record<string, any>;
    isAvailable: boolean;
  };
}>();
const emit = defineEmits<{
  (e: 'update-form', payload: (typeof props)['formData']): void;
}>();

const { values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(values, (val) => emit('update-form', val), { deep: true });

function inputClass(error: string | undefined, value: string) {
  return { 'ion-invalid': !!error, 'ion-valid': !error && value };
}
</script>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
