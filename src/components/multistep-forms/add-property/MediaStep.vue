<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  IonItem,
  IonInput,
  IonText,
  IonNote,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonActionSheet,
  IonThumbnail,
  IonImg,
} from '@ionic/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import {
  addOutline,
  trashOutline,
  videocamOutline,
  documentOutline,
  closeOutline,
  imageOutline,
} from 'ionicons/icons';
import { watch, onMounted, ref } from 'vue';
import { MediaForm } from '@/types/addPropertyInterface';
import { mediaSchema } from '@/lib/validation/addPropertyFormValidation';

const props = defineProps<{
  formData: MediaForm;
}>();

const emit = defineEmits<{
  'update-form': [payload: MediaForm];
  'validation-change': [isValid: boolean];
}>();

const imageInput = ref<HTMLInputElement>();
const floorPlanInput = ref<HTMLInputElement>();
const isActionSheetOpen = ref(false);
const currentImageIndex = ref(0);
const isImageViewerOpen = ref(false);
const thumbsSwiper = ref(null);
const mainSwiper = ref(null);

const swiperModules = [Navigation, Pagination, Thumbs, FreeMode];

onMounted(async () => {
  emit('validation-change', meta.value.valid);
});

const { errors, values, meta } = useForm<MediaForm>({
  validationSchema: toTypedSchema(mediaSchema),
  initialValues: props.formData,
});

const { value: images } = useField<string[]>('images');
const { value: videoUrl } = useField<string>('videoUrl');
const { value: floorPlan } = useField<string>('floorPlan');

watch(
  values,
  (val) => {
    emit('update-form', val as MediaForm);
  },
  { deep: true },
);

watch(
  () => meta.value.valid,
  (valid) => {
    emit('validation-change', valid);
  },
);

const openImagePicker = () => {
  imageInput.value?.click();
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && !images.value.includes(result)) {
          images.value = [...images.value, result];
        }
      };
      reader.readAsDataURL(file);
    });
  }

  target.value = '';
};

const removeImage = (index: number) => {
  images.value = images.value.filter((_, i) => i !== index);
};

const openImageViewer = (index: number) => {
  currentImageIndex.value = index;
  isImageViewerOpen.value = true;
};

const closeImageViewer = () => {
  isImageViewerOpen.value = false;
};

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const setMainSwiper = (swiper: any) => {
  mainSwiper.value = swiper;
};

const openFloorPlanPicker = () => {
  floorPlanInput.value?.click();
};

const handleFloorPlanUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        floorPlan.value = result;
      }
    };
    reader.readAsDataURL(file);
  }

  target.value = '';
};

const removeFloorPlan = () => {
  floorPlan.value = undefined;
};

const actionSheetButtons = [
  {
    text: 'Add Images',
    icon: imageOutline,
    handler: () => {
      openImagePicker();
    },
  },
  {
    text: 'Add Floor Plan',
    icon: documentOutline,
    handler: () => {
      openFloorPlanPicker();
    },
  },
  {
    text: 'Cancel',
    role: 'cancel',
    icon: closeOutline,
  },
];
</script>

<template>
  <div class="media-form">
    <h2>Property Media</h2>

    <!-- Images Section -->
    <IonCard class="images-card">
      <IonCardHeader>
        <IonCardTitle>Property Images</IonCardTitle>
        <IonNote class="helper-text"
          >Add photos of your property (at least 1 required)</IonNote
        >
      </IonCardHeader>

      <IonCardContent>
        <!-- Image Slider -->
        <div v-if="images && images.length > 0" class="images-slider-container">
          <Swiper
            :modules="swiperModules"
            :slides-per-view="1.2"
            :space-between="10"
            :centered-slides="true"
            :thumbs="{ swiper: thumbsSwiper }"
            :pagination="{ clickable: true }"
            class="main-slider"
            @swiper="setMainSwiper"
          >
            <SwiperSlide v-for="(image, index) in images" :key="index">
              <div class="image-slide" @click="openImageViewer(index)">
                <IonImg :src="image" :alt="`Property image ${index + 1}`" />
                <IonButton
                  fill="clear"
                  color="danger"
                  class="remove-image-btn"
                  @click.stop="removeImage(index)"
                >
                  <IonIcon :icon="trashOutline" />
                </IonButton>
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- Thumbnail Navigation -->
          <Swiper
            :modules="swiperModules"
            :slides-per-view="4"
            :space-between="8"
            :free-mode="true"
            :watch-slides-progress="true"
            class="thumbnail-slider"
            @swiper="setThumbsSwiper"
          >
            <SwiperSlide v-for="(image, index) in images" :key="index">
              <IonThumbnail class="thumbnail-item">
                <IonImg :src="image" :alt="`Thumbnail ${index + 1}`" />
              </IonThumbnail>
            </SwiperSlide>
          </Swiper>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-images-state">
          <IonIcon :icon="imageOutline" class="empty-icon" />
          <p>No images added yet</p>
          <IonButton @click="openImagePicker" color="primary">
            <IonIcon :icon="addOutline" slot="start" />
            Add Images
          </IonButton>
        </div>

        <!-- Add Images Button (when images exist) -->
        <IonButton
          v-if="images && images.length > 0"
          @click="openImagePicker"
          fill="outline"
          color="primary"
          class="add-more-btn"
        >
          <IonIcon :icon="addOutline" slot="start" />
          Add More Images
        </IonButton>

        <IonText color="danger" class="form-error" v-if="errors.images">
          {{ errors.images }}
        </IonText>
      </IonCardContent>
    </IonCard>

    <!-- Video URL Section -->
    <IonCard class="video-card">
      <IonCardHeader>
        <IonCardTitle>Property Video</IonCardTitle>
        <IonNote class="helper-text"
          >Add a video tour URL (YouTube, Vimeo, etc.)</IonNote
        >
      </IonCardHeader>

      <IonCardContent>
        <IonItem class="form-item ion-no-padding">
          <div class="w-full">
            <IonInput
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              v-model="videoUrl"
              class="ion-no-padding"
            >
              <IonIcon :icon="videocamOutline" slot="start" />
            </IonInput>
            <IonText color="danger" class="form-error" v-if="errors.videoUrl">
              {{ errors.videoUrl }}
            </IonText>
          </div>
        </IonItem>
      </IonCardContent>
    </IonCard>

    <!-- Floor Plan Section -->
    <IonCard class="floorplan-card">
      <IonCardHeader>
        <IonCardTitle>Floor Plan</IonCardTitle>
        <IonNote class="helper-text"
          >Upload a floor plan or layout diagram</IonNote
        >
      </IonCardHeader>

      <IonCardContent>
        <div v-if="floorPlan" class="floorplan-preview">
          <IonImg :src="floorPlan" alt="Floor plan" class="floorplan-image" />
          <div class="floorplan-actions">
            <IonButton
              @click="openFloorPlanPicker"
              fill="outline"
              color="primary"
            >
              <IonIcon :icon="documentOutline" slot="start" />
              Replace Floor Plan
            </IonButton>
            <IonButton @click="removeFloorPlan" fill="clear" color="danger">
              <IonIcon :icon="trashOutline" slot="start" />
              Remove
            </IonButton>
          </div>
        </div>

        <div v-else class="empty-floorplan-state">
          <IonIcon :icon="documentOutline" class="empty-icon" />
          <p>No floor plan added</p>
          <IonButton @click="openFloorPlanPicker" color="primary">
            <IonIcon :icon="addOutline" slot="start" />
            Add Floor Plan
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>

    <!-- Floating Action Button -->
    <IonFab vertical="center" horizontal="end" slot="fixed">
      <IonFabButton @click="isActionSheetOpen = true" color="primary">
        <IonIcon :icon="addOutline" />
      </IonFabButton>
    </IonFab>

    <!-- Hidden File Inputs -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      multiple
      style="display: none"
      @change="handleImageUpload"
    />

    <input
      ref="floorPlanInput"
      type="file"
      accept="image/*,.pdf"
      style="display: none"
      @change="handleFloorPlanUpload"
    />

    <!-- Action Sheet -->
    <IonActionSheet
      :is-open="isActionSheetOpen"
      header="Add Media"
      :buttons="actionSheetButtons"
      @didDismiss="isActionSheetOpen = false"
    />

    <!-- Image Viewer Modal -->
    <div
      v-if="isImageViewerOpen"
      class="image-viewer-modal"
      @click="closeImageViewer"
    >
      <div class="image-viewer-content">
        <IonButton
          fill="clear"
          color="light"
          class="close-viewer-btn"
          @click="closeImageViewer"
        >
          <IonIcon :icon="closeOutline" />
        </IonButton>

        <Swiper
          :modules="swiperModules"
          :initial-slide="currentImageIndex"
          :navigation="true"
          :pagination="{ clickable: true }"
          class="viewer-slider"
        >
          <SwiperSlide v-for="(image, index) in images" :key="index">
            <IonImg
              :src="image"
              :alt="`Property image ${index + 1}`"
              class="viewer-image"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';

.media-form {
  height: max-content;
  overflow: auto;
  padding: 16px;
  margin-bottom: 50px;

  .images-card,
  .video-card,
  .floorplan-card {
    margin: 16px 0;

    ion-card-header {
      padding-bottom: 8px;

      ion-card-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--ion-color-primary);
      }
    }
  }

  // Image Slider Styles
  .images-slider-container {
    .main-slider {
      height: 200px;
      margin-bottom: 16px;

      .swiper-pagination {
        bottom: 10px;

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.8);
          opacity: 0.7;

          &.swiper-pagination-bullet-active {
            opacity: 1;
            background: var(--ion-color-primary);
          }
        }
      }

      .image-slide {
        position: relative;
        height: 100%;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;

        ion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          --background: rgba(0, 0, 0, 0.6);
          --color: white;
          width: 32px;
          height: 32px;
          --border-radius: 50%;
          z-index: 10;
        }
      }
    }

    .thumbnail-slider {
      height: 60px;

      .thumbnail-item {
        --size: 50px;
        --border-radius: 4px;
        border: 2px solid transparent;
        cursor: pointer;
        transition: border-color 0.2s ease;

        &:hover {
          border-color: var(--ion-color-primary-shade);
        }

        ion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .swiper-slide-thumb-active .thumbnail-item {
        border-color: var(--ion-color-primary);
      }
    }
  }

  // Empty States
  .empty-images-state,
  .empty-floorplan-state {
    text-align: center;
    padding: 40px 20px;

    .empty-icon {
      font-size: 48px;
      color: var(--ion-color-medium);
      margin-bottom: 16px;
    }

    p {
      color: var(--ion-color-medium);
      margin-bottom: 20px;
    }
  }

  // Floor Plan Styles
  .floorplan-preview {
    .floorplan-image {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .floorplan-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }
  }

  // Utility Styles
  .add-more-btn {
    width: 100%;
    margin-top: 16px;
  }

  .helper-text {
    font-size: 12px;
    color: var(--ion-color-medium);
    display: block;
    margin-bottom: 8px;
  }

  .form-error {
    font-size: 12px;
    margin-top: 4px;
    display: block;
  }

  .form-item {
    margin-bottom: 16px;
  }
}

// Image Viewer Modal
.image-viewer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;

  .image-viewer-content {
    position: relative;
    width: 100%;
    height: 100%;

    .close-viewer-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 10000;
      --background: rgba(0, 0, 0, 0.6);
      width: 44px;
      height: 44px;
      --border-radius: 50%;
    }

    .viewer-slider {
      height: 100%;

      .swiper-button-next,
      .swiper-button-prev {
        color: white;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        width: 44px;
        height: 44px;
        margin-top: -22px;

        &:after {
          font-size: 20px;
        }
      }

      .swiper-pagination {
        bottom: 20px;

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.8);
          opacity: 0.7;

          &.swiper-pagination-bullet-active {
            opacity: 1;
            background: white;
          }
        }
      }

      .viewer-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
}
</style>
