<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
</script>

<template>
  <IonPage>
    <IonContent>
      <div class="page-container">
        <h1 class="page-title">Teams</h1>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- <div v-for="team in teams" :key="team.id" class="card">
            <div class="flex items-center space-x-4">
              <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                <img
                  :src="team.logo || 'https://via.placeholder.com/64'"
                  :alt="team.name"
                  class="h-full w-full object-cover"
                />
              </div>

              <div>
                <h3 class="text-xl font-bold">{{ team.name }}</h3>
                <p class="text-gray-600">{{ team.sport }}</p>
              </div>
            </div>

            <p v-if="team.description" class="mt-4 text-gray-600">
              {{ team.description }}
            </p>

            <div class="mt-4 flex justify-end">
              <button class="btn btn-primary">View Details</button>
            </div>
          </div>-->
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped lang="scss">
.page-container {
  padding: 20px;
}
</style>
