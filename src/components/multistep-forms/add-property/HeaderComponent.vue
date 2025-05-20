<script setup lang="ts">
import { IonHeader, IonToolbar, IonButton, IonTitle } from '@ionic/vue';

const emit = defineEmits(['cancel']);

function cancel() {
  emit('cancel');
}
</script>

<template>
  <IonHeader class="ion-no-border ion-no-padding">
    <IonToolbar>
      <div>
        <IonButton size="small" fill="clear" @click="cancel">Cancel</IonButton>
        <IonTitle>Add Your Property</IonTitle>
      </div>
    </IonToolbar>
  </IonHeader>
</template>

<style scoped lang="scss">
ion-header {
  ion-toolbar {
    padding-top: 10px;
    --background: var(--ion-color-light);
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    ion-button {
      font-size: 17px;
      color: var(--ion-color-primary);
    }

    ion-title {
      margin-top: 2px;
      font-size: 16px;
      font-weight: 800;
      color: var(--ion-color-dark);
    }
  }
}
</style>
