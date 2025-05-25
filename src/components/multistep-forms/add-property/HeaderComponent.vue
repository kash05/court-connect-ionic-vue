<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonActionSheet,
} from '@ionic/vue';
import { close, exit } from 'ionicons/icons';
import { ref } from 'vue';

const emit = defineEmits(['cancel']);

const isActionSheetOpen = ref(false);

function cancel() {
  emit('cancel');
}

const actionSheetButtons = [
  {
    text: 'Leave',
    role: 'destructive',
    icon: exit,
    handler: cancel,
  },
  {
    text: 'Stay',
    role: 'cancel',
    icon: close,
    handler: () => {
      isActionSheetOpen.value = false;
    },
  },
];
</script>

<template>
  <IonHeader class="ion-no-border ion-no-padding">
    <IonToolbar>
      <div class="ion-padding-start ion-padding-top">
        <IonButton size="small" fill="clear" @click="isActionSheetOpen = true">
          Cancel
        </IonButton>
        <IonTitle>Add Your Property</IonTitle>
      </div>
    </IonToolbar>

    <IonActionSheet
      :is-open="isActionSheetOpen"
      header="Are you sure you want to leave?"
      sub-header="Your data will be saved."
      :buttons="actionSheetButtons"
      @didDismiss="isActionSheetOpen = false"
    />
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
