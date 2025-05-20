<template>
  <div class="form-step">
    <h2>Location</h2>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Address*</ion-label>
        <Field name="address" v-slot="{ field, errorMessage }">
          <ion-input
            v-bind="field"
            :value="field.value"
            :class="inputClass(errorMessage, field.value)"
            @ionInput="field.onInput"
            type="text"
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
  address: z.string().min(5, 'Address is required'),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{ formData: FormValues }>();
const emit =
  defineEmits<(e: 'update-form', payload: { address: string }) => void>();

const { values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(values, (val) => emit('update-form', val as FormValues), { deep: true });

function inputClass(error: string | undefined, value: string) {
  return { 'ion-invalid': !!error, 'ion-valid': !error && value };
}
</script>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
