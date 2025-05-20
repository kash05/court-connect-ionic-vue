<template>
  <div class="form-step">
    <h2>Sports Details</h2>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Sports Available*</ion-label>
        <Field name="sportsAvailable" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value.join(', ')"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="text"
          />
          <ion-note slot="helper"
            >Comma-separated values (e.g. Football, Tennis)</ion-note
          >
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
  sportsAvailable: z.array(z.string()).min(1, 'At least one sport is required'),
  pricing: z.record(z.string()).optional(),
});

const props = defineProps<{
  formData: { sportsAvailable: string[]; pricing: Record<string, string> };
}>();
const emit = defineEmits<{
  (
    e: 'update-form',
    payload: { sportsAvailable: string[]; pricing: Record<string, string> },
  ): void;
}>();

const { values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(values, (val) => emit('update-form', val), { deep: true });

function inputClass(error: string | undefined, value: unknown) {
  return { 'ion-invalid': !!error, 'ion-valid': !error && value };
}
</script>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
