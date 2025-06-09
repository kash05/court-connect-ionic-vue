<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import {
  IonItem,
  IonInput,
  IonText,
  IonNote,
  IonLabel,
  IonToggle,
  IonChip,
  IonButton,
  IonSearchbar,
  IonList,
  IonCheckbox,
  IonPopover,
  IonIcon,
} from '@ionic/vue';
import { watch, onMounted, computed, ref } from 'vue';
import {
  PropertyDetailFormData,
  propertyDetailSchema,
} from '@/lib/validation/addPropertyFormValidation';
import { useFormStore } from '@/stores/useFormStore';
import { SystemData } from '@/services/systemDataService';
import { SystemConfigInterface } from '@/types/properyInterface';

const formStore = useFormStore();

const formData = computed(() => formStore.propertyForm.propertyDetail);

const sportsSearchText = ref('');
const sportsPopoverOpen = ref(false);
const sportsPopoverRef = ref();

const AMENITIES_OPTIONS: SystemConfigInterface[] = SystemData.amenities;

const SPORTS_OPTIONS: SystemConfigInterface[] = SystemData.sports;

const FACILITIES_OPTIONS: SystemConfigInterface[] = SystemData.facilities;

const SURFACE_TYPES = [
  'Grass',
  'Artificial Turf',
  'Concrete',
  'Wooden',
  'Clay',
  'Rubber',
  'Synthetic',
  'Sand',
  'Indoor Court',
];

const ACCESSIBILITY_OPTIONS = [
  'Wheelchair Access',
  'Disabled Parking',
  'Accessible Restrooms',
  'Ramps',
  'Wide Doorways',
  'Braille Signage',
  'Audio Announcements',
];

onMounted(() => {
  if (formData.value) {
    setValues(formData.value);
  }
});

const { errors, values, setValues } = useForm<PropertyDetailFormData>({
  validationSchema: toTypedSchema(propertyDetailSchema),
  initialValues: formData.value,
});

const { value: sports } = useField<string[]>('sports');
const { value: subUnits } = useField<Record<string, number>>('subUnits');
const { value: surfaceType } = useField<string>('surfaceType');
const { value: equipmentRental } = useField<boolean>('equipmentRental');
const { value: facilities } = useField<string[]>('facilities');
const { value: accessibility } = useField<string[]>('accessibility');
const { value: additionalAmenities } = useField<string[]>(
  'additionalAmenities',
);

watch(
  formData,
  (newData) => {
    if (newData) {
      setValues(newData);
    }
  },
  { deep: true, immediate: true },
);

watch(
  values,
  (newValues) => {
    if (newValues && Object.keys(newValues).length > 0) {
      formStore.updatePropertyForm({
        propertyDetail: newValues,
      });
    }
  },
  { deep: true },
);

const filteredSports = computed(() => {
  if (!sportsSearchText.value) {
    return SPORTS_OPTIONS;
  }
  return SPORTS_OPTIONS.filter((sport) =>
    sport.display_name
      .toLowerCase()
      .includes(sportsSearchText.value.toLowerCase()),
  );
});

const toggleSportSelection = (sportName: string) => {
  const currentSports = sports.value || [];
  if (currentSports.includes(sportName)) {
    sports.value = currentSports.filter((s) => s !== sportName);
    const newSubUnits = { ...subUnits.value };
    delete newSubUnits[sportName];
    subUnits.value = newSubUnits;
  } else {
    sports.value = [...currentSports, sportName];
  }
};

const removeSport = (sportName: string) => {
  sports.value = sports.value.filter((s) => s !== sportName);
  const newSubUnits = { ...subUnits.value };
  delete newSubUnits[sportName];
  subUnits.value = newSubUnits;
};

const openSportsPopover = () => {
  sportsPopoverOpen.value = true;
};

const closeSportsPopover = () => {
  sportsPopoverOpen.value = false;
  sportsSearchText.value = '';
};

const toggleAmenity = (amenityName: string) => {
  const currentAmenities = additionalAmenities.value || [];
  if (currentAmenities.includes(amenityName)) {
    additionalAmenities.value = currentAmenities.filter(
      (a) => a !== amenityName,
    );
  } else {
    additionalAmenities.value = [...currentAmenities, amenityName];
  }
};

const toggleArrayItem = (
  array: string[],
  item: string,
  field: 'facilities' | 'accessibility',
) => {
  const newArray = array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];

  if (field === 'facilities') {
    facilities.value = newArray;
  } else if (field === 'accessibility') {
    accessibility.value = newArray;
  }
};

const updateSubUnit = (sport: string, count: string) => {
  const numCount = parseInt(count) || 0;
  const newSubUnits = { ...subUnits.value };
  if (numCount > 0) {
    newSubUnits[sport] = numCount;
  } else {
    delete newSubUnits[sport];
  }
  subUnits.value = newSubUnits;
};

const selectedSports = computed(() => sports.value || []);
const selectedFacilities = computed(() => facilities.value || []);
const selectedAccessibility = computed(() => accessibility.value || []);
const selectedAmenities = computed(() => additionalAmenities.value || []);

const getFieldError = (fieldName: keyof PropertyDetailFormData) => {
  return errors.value[fieldName];
};

const hasFieldError = (fieldName: keyof PropertyDetailFormData) => {
  return !!errors.value[fieldName];
};
</script>

<template>
  <div class="property-detail-form">
    <h2>Property Details</h2>
    <p class="subtitle">Tell us about the sports and facilities available</p>

    <div class="form-section">
      <IonLabel class="section-label">Sports Available *</IonLabel>

      <IonButton
        fill="outline"
        expand="block"
        @click="openSportsPopover"
        id="sports-trigger"
        class="sports-select-button"
      >
        <IonText>
          {{
            selectedSports.length === 0
              ? 'Select Sports'
              : `${selectedSports.length} sport(s) selected`
          }}
        </IonText>
      </IonButton>

      <div v-if="selectedSports.length > 0" class="selected-chips-container">
        <IonChip
          v-for="sport in selectedSports"
          :key="sport"
          color="primary"
          @click="removeSport(sport)"
          class="selected-sport-chip"
        >
          {{ sport }}
          <ion-icon name="close" slot="end"></ion-icon>
        </IonChip>
      </div>

      <IonPopover
        ref="sportsPopoverRef"
        :is-open="sportsPopoverOpen"
        trigger="sports-trigger"
        @didDismiss="closeSportsPopover"
        class="sports-popover"
      >
        <div class="popover-content">
          <IonSearchbar
            v-model="sportsSearchText"
            placeholder="Search sports..."
            show-clear-button="focus"
            class="sports-search"
          />
          <IonList class="sports-list">
            <IonItem
              v-for="sport in filteredSports"
              :key="sport.id"
              @click="toggleSportSelection(sport.name)"
              button
            >
              <IonCheckbox
                :checked="selectedSports.includes(sport.name)"
                slot="start"
              />
              <IonLabel>{{ sport.display_name }}</IonLabel>
            </IonItem>
            <IonItem v-if="filteredSports.length === 0">
              <IonLabel color="medium">No sports found</IonLabel>
            </IonItem>
          </IonList>
        </div>
      </IonPopover>

      <IonText color="danger" class="form-error" v-if="hasFieldError('sports')">
        {{ getFieldError('sports') }}
      </IonText>
    </div>

    <div v-if="selectedSports.length > 0" class="form-section">
      <IonLabel class="section-label">Number of Courts/Fields</IonLabel>
      <IonNote class="helper-text">
        Specify how many courts/fields for each sport
      </IonNote>

      <IonItem
        v-for="sport in selectedSports"
        :key="sport"
        class="sub-unit-item ion-no-padding"
      >
        <IonLabel>{{ sport }}</IonLabel>
        <IonInput
          type="number"
          placeholder="0"
          :value="subUnits?.[sport]?.toString() || ''"
          @ion-input="updateSubUnit(sport, $event.target.value as string)"
          class="sub-unit-input"
          slot="end"
        />
      </IonItem>
    </div>

    <div class="form-section">
      <IonLabel class="section-label">Primary Surface Type *</IonLabel>
      <div class="chip-container">
        <IonChip
          v-for="surface in SURFACE_TYPES"
          :key="surface"
          :color="surfaceType === surface ? 'primary' : 'medium'"
          :outline="surfaceType !== surface"
          @click="surfaceType = surface"
          class="surface-chip"
        >
          {{ surface }}
        </IonChip>
      </div>
      <IonText
        color="danger"
        class="form-error"
        v-if="hasFieldError('surfaceType')"
      >
        {{ getFieldError('surfaceType') }}
      </IonText>
    </div>

    <IonItem class="form-item ion-no-padding">
      <IonLabel>Equipment Rental Available</IonLabel>
      <IonToggle v-model="equipmentRental" slot="end" />
    </IonItem>

    <div class="form-section">
      <IonLabel class="section-label">Facilities Available</IonLabel>
      <div class="chip-container">
        <IonChip
          v-for="facility in FACILITIES_OPTIONS"
          :key="facility.id"
          :color="
            selectedFacilities.includes(facility.name)
              ? 'primary'
              : 'medium'
          "
          :outline="!selectedFacilities.includes(facility.name)"
          @click="
            toggleArrayItem(
              selectedFacilities,
              facility.name,
              'facilities',
            )
          "
          class="facility-chip"
        >
          {{ facility.display_name }}
        </IonChip>
      </div>
    </div>

    <div class="form-section">
      <IonLabel class="section-label">Accessibility Features</IonLabel>
      <div class="chip-container">
        <IonChip
          v-for="feature in ACCESSIBILITY_OPTIONS"
          :key="feature"
          :color="
            selectedAccessibility.includes(feature) ? 'primary' : 'medium'
          "
          :outline="!selectedAccessibility.includes(feature)"
          @click="
            toggleArrayItem(selectedAccessibility, feature, 'accessibility')
          "
          class="accessibility-chip"
        >
          {{ feature }}
        </IonChip>
      </div>
    </div>

    <div class="form-section">
      <IonLabel class="section-label">Additional Amenities</IonLabel>
      <div class="chip-container">
        <IonChip
          v-for="amenity in AMENITIES_OPTIONS"
          :key="amenity.id"
          :color="
            selectedAmenities.includes(amenity.name)
              ? 'primary'
              : 'medium'
          "
          :outline="!selectedAmenities.includes(amenity.name)"
          @click="toggleAmenity(amenity.name)"
          class="amenity-chip"
        >
          {{ amenity.display_name }}
        </IonChip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.property-detail-form {
  height: max-content;
  overflow: auto;
  padding: 16px;
  margin-bottom: 50px;
}

ion-input {
  --padding-start: 12px !important;
  --padding-end: 12px !important;
  --border-radius: 8px;
  --background: var(--ion-color-light-shade) !important;
}

.subtitle {
  color: var(--ion-color-medium);
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.4;
}

.form-section {
  margin-bottom: 32px;
}

.section-label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin-bottom: 12px;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.sports-select-button {
  margin-bottom: 12px;
  text-align: left;
  --border-radius: 8px;
}

.selected-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.selected-sport-chip {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.sports-popover {
  --width: 300px;
  --max-height: 400px;
}

.popover-content {
  width: 100%;
  height: 100%;
}

.sports-search {
  --padding-start: 16px;
  --padding-end: 16px;
}

.sports-list {
  max-height: 300px;
  overflow-y: auto;
}

.surface-chip,
.facility-chip,
.accessibility-chip,
.amenity-chip {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

.sub-unit-item {
  border-bottom: 1px solid var(--ion-color-light);
  padding: 12px 0;

  .sub-unit-input {
    max-width: 80px;
    text-align: center;
  }
}

.form-item {
  border-bottom: 1px solid var(--ion-color-light);
  padding: 16px 0;

  &:last-child {
    border-bottom: none;
  }
}

.form-error {
  display: block;
  font-size: 12px;
  margin-top: 4px;
}

.helper-text {
  display: block;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .chip-container {
    gap: 6px;
  }

  .surface-chip,
  .facility-chip,
  .accessibility-chip,
  .amenity-chip {
    font-size: 12px;
    --padding-start: 8px;
    --padding-end: 8px;
  }

  .sports-popover {
    --width: 280px;
  }
}
</style>
