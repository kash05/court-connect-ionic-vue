<script setup lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import TabBarComponent from "@/components/layout/TabBarComponent.vue";
import {
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
} from "@ionic/vue";
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

const { width } = useWindowSize();

const isDesktop = computed(() => width.value >= 768);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonMenuButton slot="start" class="menu-button" v-if="!isDesktop" />
        <NavBar />
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <TabBarComponent />
    </IonContent>
  </IonPage>
</template>

<style scoped>
.main-content {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.menu-button {
  display: block !important;
}
</style>
