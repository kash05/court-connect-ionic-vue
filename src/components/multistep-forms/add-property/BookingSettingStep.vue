<script setup lang="ts">
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { IonList, IonItem, IonLabel, IonToggle } from '@ionic/vue';
import { watch, computed, onMounted } from 'vue';

const schema = z.object({
  preBookingAllowed: z.boolean(),
  fullDayBookingAllowed: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: FormValues;
}>();

const emit = defineEmits<{
  'update-form': [payload: FormValues];
  'validation-change': [isValid: boolean];
}>();

const { values, meta, validate, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

function handlePreBookingChange(event: CustomEvent) {
  setFieldValue('preBookingAllowed', event.detail.checked);
}

function handleFullDayBookingChange(event: CustomEvent) {
  setFieldValue('fullDayBookingAllowed', event.detail.checked);
}

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

onMounted(() => {
  validate();
  emit('validation-change', true);
});
</script>

<template>
  <div class="form-step">
    <h2>Booking Settings</h2>
    <ion-list>
      <ion-item>
        <ion-label>Pre-booking Allowed</ion-label>
        <ion-toggle
          :checked="values.preBookingAllowed"
          @ionChange="handlePreBookingChange"
        />
      </ion-item>

      <ion-item>
        <ion-label>Full-day Booking Allowed</ion-label>
        <ion-toggle
          :checked="values.fullDayBookingAllowed"
          @ionChange="handleFullDayBookingChange"
        />
      </ion-item>
    </ion-list>
  </div>
</template>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
