<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/vue';
import { ref } from 'vue';
import PageHeaderComponent from '@/components/PageHeaderComponent.vue';
import PageTabBarComponent from '@/components/tabbar/PlayerTabBarComponent.vue';

const selectedTab = ref('live');

const liveMatches = ref([
  {
    id: 1,
    title: 'Champions FC vs Tigers',
    time: '45:00',
    score: { home: 2, away: 1 },
    status: 'In Progress',
    location: 'Main Stadium',
  },
]);

const upcomingMatches = ref([
  {
    id: 1,
    title: 'Weekly Practice',
    date: '2025-01-15T18:00:00',
    type: 'practice',
    location: 'Training Ground',
  },
  {
    id: 2,
    title: 'Quarter Finals',
    date: '2025-01-18T14:30:00',
    type: 'tournament',
    location: 'City Stadium',
  },
]);

const matchHistory = ref([
  {
    id: 1,
    title: 'Semi Finals',
    date: '2025-01-10',
    result: 'Won',
    score: { home: 3, away: 1 },
    stats: {
      goals: 2,
      assists: 1,
      minutesPlayed: 90,
    },
  },
  {
    id: 2,
    title: 'League Match',
    date: '2025-01-05',
    result: 'Lost',
    score: { home: 1, away: 2 },
    stats: {
      goals: 1,
      assists: 0,
      minutesPlayed: 85,
    },
  },
  {
    id: 2,
    title: 'League Match',
    date: '2025-01-05',
    result: 'Lost',
    score: { home: 1, away: 2 },
    stats: {
      goals: 1,
      assists: 0,
      minutesPlayed: 85,
    },
  },
  {
    id: 2,
    title: 'League Match',
    date: '2025-01-05',
    result: 'Lost',
    score: { home: 1, away: 2 },
    stats: {
      goals: 1,
      assists: 0,
      minutesPlayed: 85,
    },
  },
]);

const playerStats = ref({
  matches: 28,
  goals: 15,
  assists: 10,
  winRate: 75,
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
</script>

<template>
  <IonPage>
    <PageHeaderComponent />
    <IonContent>
      <div class="page-container">
        <!-- Header Section -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Your Dashboard</h1>
            <p class="text-gray-600">Welcome back, Kashish</p>
          </div>

          <button class="btn btn-primary flex items-center">
            <span class="mr-2">Create Match</span>
            <span class="text-lg">+</span>
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div class="card flex items-center p-4">
            <div class="mr-4 rounded-full bg-primary-100 p-3 text-primary-600">
              <span class="text-xl">🎮</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total Matches</p>
              <p class="text-xl font-bold text-gray-900">
                {{ playerStats.matches }}
              </p>
            </div>
          </div>

          <div class="card flex items-center p-4">
            <div class="mr-4 rounded-full bg-success-100 p-3 text-success-600">
              <span class="text-xl">⚽</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Goals</p>
              <p class="text-xl font-bold text-gray-900">
                {{ playerStats.goals }}
              </p>
            </div>
          </div>

          <div class="card flex items-center p-4">
            <div class="mr-4 rounded-full bg-accent-100 p-3 text-accent-600">
              <span class="text-xl">🎯</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Assists</p>
              <p class="text-xl font-bold text-gray-900">
                {{ playerStats.assists }}
              </p>
            </div>
          </div>

          <div class="card flex items-center p-4">
            <div
              class="mr-4 rounded-full bg-secondary-100 p-3 text-secondary-600"
            >
              <span class="text-xl">🏆</span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Win Rate</p>
              <p class="text-xl font-bold text-gray-900">
                {{ playerStats.winRate }}%
              </p>
            </div>
          </div>
        </div>

        <!-- Matches Section -->
        <div class="card">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-xl font-bold">Matches</h2>
            <IonSegment v-model="selectedTab" class="w-auto">
              <IonSegmentButton value="live">
                <IonLabel>Live</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="upcoming">
                <IonLabel>Upcoming</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="history">
                <IonLabel>History</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          <!-- Live Matches -->
          <div v-if="selectedTab === 'live'" class="space-y-4">
            <div
              v-for="match in liveMatches"
              :key="match.id"
              class="live-match-card rounded-lg border border-primary-100 bg-primary-50 p-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{{ match.title }}</h3>
                <span
                  class="rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-600"
                >
                  {{ match.time }}
                </span>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <div class="text-2xl font-bold text-primary-600">
                  {{ match.score.home }} - {{ match.score.away }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ match.location }}
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Matches -->
          <div v-if="selectedTab === 'upcoming'" class="space-y-4">
            <div
              v-for="match in upcomingMatches"
              :key="match.id"
              class="upcoming-match-card rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{{ match.title }}</h3>
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-sm font-medium',
                    match.type === 'practice'
                      ? 'bg-secondary-100 text-secondary-600'
                      : 'bg-accent-100 text-accent-600',
                  ]"
                >
                  {{ match.type }}
                </span>
              </div>

              <div
                class="mt-2 flex items-center justify-between text-sm text-gray-600"
              >
                <div>{{ formatDate(match.date) }}</div>
                <div>{{ match.location }}</div>
              </div>
            </div>
          </div>

          <!-- Match History -->
          <div v-if="selectedTab === 'history'" class="space-y-4">
            <div
              v-for="match in matchHistory"
              :key="match.id"
              class="history-match-card rounded-lg border border-gray-200 bg-white p-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{{ match.title }}</h3>
                <span
                  :class="[
                    'rounded-full px-3 py-1 text-sm font-medium',
                    match.result === 'Won'
                      ? 'bg-success-100 text-success-600'
                      : 'bg-error-100 text-error-600',
                  ]"
                >
                  {{ match.result }}
                </span>
              </div>

              <div class="mt-2 flex items-center justify-between">
                <div class="text-lg font-semibold">
                  {{ match.score.home }} - {{ match.score.away }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ match.date }}
                </div>
              </div>

              <div
                class="mt-2 flex items-center space-x-4 text-sm text-gray-600"
              >
                <div>Goals: {{ match.stats.goals }}</div>
                <div>Assists: {{ match.stats.assists }}</div>
                <div>Minutes: {{ match.stats.minutesPlayed }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
    <PageTabBarComponent />
  </IonPage>
</template>

<style scoped>
.page-container {
  padding: 20px;
}

ion-segment {
  --background: var(--ion-color-light);
}

ion-segment-button {
  --background-checked: var(--ion-color-primary);
  --color-checked: white;
  --indicator-color: transparent;
}

.live-match-card {
  animation: pulse 2s infinite;
}
</style>
