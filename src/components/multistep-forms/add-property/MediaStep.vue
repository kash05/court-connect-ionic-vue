<script setup lang="ts">
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { watch, ref, onMounted } from 'vue';
import {
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonButton,
} from '@ionic/vue';

const schema = z.object({
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type FormValues = z.infer<typeof schema>;

const props = defineProps<{
  formData: FormValues;
}>();

const emit = defineEmits<{
  'update-form': [payload: FormValues];
  'validation-change': [isValid: boolean];
}>();

const { errors, values, meta, validate } = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: props.formData,
});

const selectedImages = ref<string[]>(props.formData.images || []);

onMounted(async () => {
  await validate();
  emit('validation-change', meta.value.valid);
});

watch(
  () => values.images,
  (newImages) => {
    selectedImages.value = newImages || [];
    emit('update-form', { images: newImages || [] });
  },
  { deep: true },
);

watch(
  () => meta.value.valid,
  (isValid) => {
    emit('validation-change', isValid);
  },
);

async function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const urls: string[] = [];
  for (const element of files) {
    urls.push(URL.createObjectURL(element));
  }

  values.images = [...selectedImages.value, ...urls];

  await validate();
}

async function removeImage(index: number) {
  const updatedImages = [...selectedImages.value];
  updatedImages.splice(index, 1);
  values.images = updatedImages;

  await validate();
}
</script>

<template>
  <div class="form-step">
    <h2>Media</h2>

    <ion-list>
      <ion-item>
        <ion-label>Upload Images</ion-label>
        <input type="file" multiple @change="handleFileUpload" />
      </ion-item>

      <ion-item v-if="errors.images">
        <ion-text color="danger">{{ errors.images }}</ion-text>
      </ion-item>
    </ion-list>

    <div v-if="selectedImages.length > 0" class="image-preview-container">
      <h3>Selected Images ({{ selectedImages.length }})</h3>
      <div class="image-grid">
        <div
          v-for="(image, index) in selectedImages"
          :key="index"
          class="image-preview"
        >
          <img :src="image" alt="Preview" />
          <ion-button fill="clear" color="danger" @click="removeImage(index)">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-step {
  margin-bottom: 20px;
}

.image-preview-container {
  margin-top: 20px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.image-preview {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.image-preview ion-button {
  position: absolute;
  top: 0;
  right: 0;
  --background: rgba(0, 0, 0, 0.5);
  margin: 0;
}
</style>
