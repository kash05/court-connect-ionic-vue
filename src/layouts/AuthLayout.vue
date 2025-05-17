<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <IonPage>
    <IonContent>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </IonContent>
  </IonPage>
</template>
