<script setup lang="ts">
import { computed, ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  alertCircleOutline,
  informationCircleOutline,
  warningOutline,
  closeCircleOutline,
} from 'ionicons/icons';

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value: string) => ['error', 'warning', 'info'].includes(value),
  },
  message: {
    type: String,
    required: true,
  },
  dismissible: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close']);

const show = ref(true);

if (props.autoClose > 0) {
  setTimeout(() => {
    show.value = false;
    emit('close');
  }, props.autoClose);
}

const getIcon = computed(() => {
  switch (props.type) {
    case 'error':
      return alertCircleOutline;
    case 'warning':
      return warningOutline;
    case 'info':
    default:
      return informationCircleOutline;
  }
});

const handleClose = () => {
  show.value = false;
  emit('close');
};
</script>

<template>
  <div class="message-box" :class="[type]" v-if="show">
    <ion-icon :icon="getIcon" class="message-icon"></ion-icon>
    <span class="message-text">{{ message }}</span>
    <ion-icon
      v-if="dismissible"
      :icon="closeCircleOutline"
      class="close-icon"
      @click="handleClose"
    ></ion-icon>
  </div>
</template>

<style scoped>
.message-box {
  display: flex;
  align-items: center;
  border-radius: var(--radius-md, 12px);
  padding: 12px 16px;
  margin-bottom: 16px;
  border-left: 4px solid;
  position: relative;
}

.message-icon {
  font-size: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-text {
  font-size: 14px;
  flex: 1;
}

.close-icon {
  font-size: 18px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.close-icon:hover {
  opacity: 1;
}

.error {
  background-color: rgba(var(--ion-color-danger-rgb, 235, 68, 90), 0.1);
  border-left-color: var(--ion-color-danger);
}

.error .message-icon,
.error .message-text,
.error .close-icon {
  color: var(--ion-color-danger-shade);
}

.warning {
  background-color: rgba(var(--ion-color-warning-rgb, 255, 196, 9), 0.1);
  border-left-color: var(--ion-color-warning);
}

.warning .message-icon,
.warning .message-text,
.warning .close-icon {
  color: var(--ion-color-warning-shade);
}

.info {
  background-color: rgba(var(--ion-color-primary-rgb, 56, 128, 255), 0.1);
  border-left-color: var(--ion-color-primary);
}

.info .message-icon,
.info .message-text,
.info .close-icon {
  color: var(--ion-color-primary-shade);
}
</style>
