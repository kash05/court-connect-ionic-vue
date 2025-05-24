<script setup lang="ts">
import { UserRole } from '@/types/enums/UserEnum';
import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonContent,
  IonPage,
  IonText,
  useIonRouter,
  IonToolbar,
  IonTitle,
  IonHeader,
} from '@ionic/vue';

const router = useIonRouter();

function redirect(roleId: number) {
  router.push(`/register/${roleId}`);
}

function goToLogin() {
  router.replace('/(auth)/login');
}
</script>

<template>
  <IonPage>
    <IonHeader translucent>
      <IonToolbar color="light">
        <IonTitle class="ion-text-center">Choose Your Role</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <div class="ion-text-center ion-margin-bottom">
        <IonText color="medium">
          <p>Select the type of account you’d like to create.</p>
        </IonText>
      </div>

      <IonCard
        button
        @click="redirect(UserRole.OWNER)"
        class="ion-margin-bottom"
      >
        <IonCardHeader>
          <IonCardTitle>🏟️ Owner</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          Manage your sports facility, schedules, and track player bookings with
          ease.
        </IonCardContent>
      </IonCard>

      <IonCard
        button
        @click="redirect(UserRole.PLAYER)"
        class="ion-margin-bottom"
      >
        <IonCardHeader>
          <IonCardTitle>🎾 Player</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          Search players to play,book courts, join games, and track your
          performance — all in one place.
        </IonCardContent>
      </IonCard>

      <GlobalMessage
        type="info"
        message="You can always register as another role later within the app settings."
      />
      <IonButton
        expand="block"
        color="medium"
        fill="outline"
        class="ion-margin-top"
        @click="goToLogin"
      >
        Back to Sign In
      </IonButton>
    </IonContent>
  </IonPage>
</template>
