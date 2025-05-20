<template>
  <div class="form-step">
    <h2>Contact Details</h2>
    <ion-list>
      <!-- Phone Number -->
      <ion-item>
        <ion-label position="floating">Phone Number*</ion-label>
        <Field name="phoneNumber" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="tel"
          />
          <ion-note slot="error" v-if="errorMessage">{{
            errorMessage
          }}</ion-note>
        </Field>
      </ion-item>

      <!-- Email -->
      <ion-item>
        <ion-label position="floating">Email*</ion-label>
        <Field name="email" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="email"
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
  phoneNumber: z.string().min(10, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
});

const props = defineProps<{
  formData: { phoneNumber: string; email: string };
}>();
const emit = defineEmits<{
  (e: 'update-form', payload: { phoneNumber: string; email: string }): void;
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
