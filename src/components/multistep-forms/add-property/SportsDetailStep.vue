<script setup lang="ts">
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  IonText,
} from '@ionic/vue';
import { computed, watch, ref } from 'vue';

const schema = z.object({
  sportsAvailable: z.array(z.string()).min(1, 'At least one sport is required'),
  pricing: z.record(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: FormValues;
}>();

const emit = defineEmits<{
  'update-form': [payload: FormValues];
  'validation-change': [isValid: boolean];
}>();

const { values, errors, meta, validate, setFieldValue } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

const sportsInputValue = ref(props.formData.sportsAvailable.join(', '));

function handleSportsInput(event: CustomEvent) {
  const value = event.detail.value as string;
  sportsInputValue.value = value;

  const sportsArray = value
    .split(',')
    .map((sport) => sport.trim())
    .filter((sport) => sport !== '');

  setFieldValue('sportsAvailable', sportsArray);

  validate();
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

function inputClass(error: string | undefined, value: unknown) {
  return { 'ion-invalid': !!error, 'ion-valid': !error && value };
}
</script>

<template>
  <div class="form-step">
    <h2>Sports Details</h2>
    <ion-list>
      <ion-item>
        <ion-label position="floating">Sports Available*</ion-label>
        <ion-input
          :value="sportsInputValue"
          @ionInput="handleSportsInput"
          :class="
            inputClass(errors.sportsAvailable, values.sportsAvailable?.length)
          "
          type="text"
        />
        <ion-note slot="helper"
          >Comma-separated values (e.g. Football, Tennis)</ion-note
        >
        <ion-text color="danger" v-if="errors.sportsAvailable">
          {{ errors.sportsAvailable }}
        </ion-text>
      </ion-item>

      <ion-item v-if="values.sportsAvailable?.length">
        <div class="sports-tags">
          <div
            class="sport-tag"
            v-for="(sport, index) in values.sportsAvailable"
            :key="index"
          >
            {{ sport }}
          </div>
        </div>
      </ion-item>
    </ion-list>
  </div>
</template>

<style scoped>
.form-step {
  margin-bottom: 20px;
}

.sports-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.sport-tag {
  background-color: #f0f0f0;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 14px;
}
</style>
