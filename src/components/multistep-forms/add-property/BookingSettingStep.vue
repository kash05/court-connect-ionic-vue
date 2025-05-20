<template>
  <div class="form-step">
    <h2>Booking Settings</h2>
    <ion-list>
      <ion-item>
        <ion-label>Pre-booking Allowed</ion-label>
        <Field name="preBookingAllowed" type="checkbox" v-slot="{ field }">
          <ion-toggle v-bind="field" @ionChange="field.onChange" />
        </Field>
      </ion-item>

      <ion-item>
        <ion-label>Full-day Booking Allowed</ion-label>
        <Field name="fullDayBookingAllowed" type="checkbox" v-slot="{ field }">
          <ion-toggle v-bind="field" @ionChange="field.onChange" />
        </Field>
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
import { Field, useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IonList, IonItem, IonLabel, IonToggle } from '@ionic/vue';
import { watch } from 'vue';

const schema = z.object({
  preBookingAllowed: z.boolean(),
  fullDayBookingAllowed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: {
    preBookingAllowed: boolean;
    fullDayBookingAllowed: boolean;
  };
}>();
const emit = defineEmits<(e: 'update-form', payload: FormValues) => void>();

const { values } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

watch(values, (val) => emit('update-form', val as FormValues), { deep: true });
</script>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
