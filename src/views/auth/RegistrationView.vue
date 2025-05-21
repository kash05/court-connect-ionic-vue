<script setup lang="ts">
import { IonButton, IonContent, IonPage, useIonRouter } from '@ionic/vue';

const ionRouter = useIonRouter();

function redirect(type: string) {
  ionRouter.push(`/register/${type}`);
}
</script>

<template>
  <IonPage>
    <IonContent>
      <IonButton @click="redirect('player')"> Register as player </IonButton>
      <IonButton @click="redirect('owner')"> Register as Owner </IonButton>
    </IonContent>
  </IonPage>
</template>
