<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <div class="page-container">
        <h1 class="page-title">Teams</h1>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
</style>
