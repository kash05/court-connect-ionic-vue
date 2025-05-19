<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import OwnerTabBarComponent from '@/components/tabbar/OwnerTabBarComponent.vue';
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <div class="page-container">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
            <p class="text-gray-600">Welcome back, Kashish</p>
          </div>
        </div>
      </div>
    </IonContent>
    <OwnerTabBarComponent />
  </IonPage>
</template>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
