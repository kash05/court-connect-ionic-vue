<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IonList, IonItem, IonLabel, IonTextarea, IonNote } from '@ionic/vue';
import { watch, computed } from 'vue';

const schema = z.object({
  amenities: z.array(z.string()).optional(),
  cancellationPolicy: z.string().min(5, 'Cancellation policy is required'),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: { amenities: string[]; cancellationPolicy?: string };
}>();

const emit = defineEmits<{
  'update-form': [payload: FormValues];
  'validation-change': [isValid: boolean];
}>();

const { values, meta } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(values, (val) => emit('update-form', val as FormValues), { deep: true });

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

function inputClass(error: string | undefined, value: string) {
  return { 'ion-invalid': !!error, 'ion-valid': !error && value };
}
</script>

<template>
  <div class="form-step">
    <h2>Amenities & Policies</h2>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Cancellation Policy*</ion-label>
        <Field name="cancellationPolicy" v-slot="{ field, errorMessage }">
          <ion-textarea
            v-bind="field"
            :value="field.value"
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

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
