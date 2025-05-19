<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import PageTabBarComponent from '@/components/tabbar/PlayerTabBarComponent.vue';
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <div class="page-container">
        <h1 class="page-title">Events</h1>
        <p>Events view content will go here.</p>
      </div>
    </IonContent>
    <PageTabBarComponent />
  </IonPage>
</template>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
</style>
