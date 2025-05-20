<template>
  <div class="form-step">
    <h2>Media</h2>
    <ion-list>
      <ion-item>
        <ion-label>Upload Images</ion-label>
        <input type="file" multiple @change="handleFileUpload" />
      </ion-item>
    </ion-list>
  </div>
</template>

<script setup lang="ts">
defineProps<{ formData: { images: string[] } }>();
const emit =
  defineEmits<(e: 'update-form', payload: { images: string[] }) => void>();

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const urls: string[] = [];
  for (const element of files) {
    urls.push(URL.createObjectURL(element));
  }

  emit('update-form', { images: urls });
}
</script>

<style scoped>
.form-step {
  margin-bottom: 20px;
}
</style>
