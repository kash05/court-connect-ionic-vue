<template>
  <IonPage
    class="flex items-center justify-center h-full bg-gradient-to-br from-purple-500 to-indigo-600"
  >
    <div class="text-center animate-fade-in-up max-w-[90%]">
      <div ref="lottieContainer" class="w-72 h-72 mx-auto mb-4"></div>

      <h1 class="text-3xl md:text-5xl font-bold text-white mb-4">
        Switching to {{ capitalizedMode }} mode...
      </h1>

      <div class="w-64 h-3 bg-white/30 rounded-full mx-auto overflow-hidden">
        <div
          class="h-full bg-white rounded-full animate-progress-bar"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
  </IonPage>
</template>

<script setup lang="ts">
import { IonPage, onIonViewWillEnter, useIonRouter } from '@ionic/vue';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import lottie from 'lottie-web';

import ownerAnimation from '@/assets/animations/owner-mode.json';
import playerAnimation from '@/assets/animations/player-mode.json';

const route = useRoute();
const ionRouter = useIonRouter();

const mode = route.params.mode as 'owner' | 'player';
const redirectTo = (route.query.redirectTo as string) || '/';

const capitalizedMode = computed(
  () => mode.charAt(0).toUpperCase() + mode.slice(1),
);

const progress = ref(0);
const lottieContainer = ref<HTMLDivElement>();

const animationMap = {
  owner: ownerAnimation,
  player: playerAnimation,
};

const animateProgress = () => {
  const interval = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        ionRouter.push(redirectTo);
      }, 300);
    } else {
      progress.value += 2 + Math.random() * 3;
    }
  }, 50);
};

onMounted(() => {
  const animData = animationMap[mode];
  if (lottieContainer.value && animData) {
    lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animData,
    });
  }
});

onIonViewWillEnter(() => {
  progress.value = 0;
  animateProgress();
});

onBeforeUnmount(() => {
  lottie.destroy();
});
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-progress-bar {
  transition: width 0.3s ease-in-out;
}
</style>
