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
} from '@ionic/vue';
import { watch, onMounted, computed } from 'vue';
import {
	PropertyDetailFormData,
	propertyDetailSchema,
} from '@/lib/validation/addPropertyFormValidation';

const props = defineProps<{
  formData: PropertyDetailFormData;
}>();

const emit = defineEmits<{
  'update-form': [payload: PropertyDetailFormData];
  'validation-change': [isValid: boolean];
}>();

const SPORTS_OPTIONS = [
  'Football',
  'Basketball',
  'Tennis',
  'Cricket',
  'Badminton',
  'Volleyball',
  'Swimming',
  'Table Tennis',
  'Squash',
  'Hockey',
];

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

const FACILITIES_OPTIONS = [
  'Parking',
  'Restrooms',
  'Changing Rooms',
  'Showers',
  'Lockers',
  'First Aid',
  'Cafeteria',
  'Equipment Storage',
  'Seating Area',
  'Lighting',
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

const AMENITIES_OPTIONS = [
  'WiFi',
  'Air Conditioning',
  'Sound System',
  'Scoreboard',
  'CCTV',
  'Security Guard',
  'Referee Services',
  'Coaching Available',
];

onMounted(async () => {
  emit('validation-change', meta.value.valid);
});

const { errors, values, meta } = useForm<PropertyDetailFormData>({
  validationSchema: toTypedSchema(propertyDetailSchema),
  initialValues: props.formData,
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
  values,
  (val) => {
    emit('update-form', val as PropertyDetailFormData);
  },
  { deep: true },
);

watch(
  () => meta.value.valid,
  (valid) => {
    emit('validation-change', valid);
  },
);

const toggleSport = (sport: string) => {
  const currentSports = sports.value || [];
  if (currentSports.includes(sport)) {
    sports.value = currentSports.filter((s) => s !== sport);
    const newSubUnits = { ...subUnits.value };
    delete newSubUnits[sport];
    subUnits.value = newSubUnits;
  } else {
    sports.value = [...currentSports, sport];
  }
};

const toggleArrayItem = (
  array: string[],
  item: string,
  field: 'facilities' | 'accessibility' | 'additionalAmenities',
) => {
  const newArray = array.includes(item)
    ? array.filter((i) => i !== item)
    : [...array, item];

  if (field === 'facilities') {
    facilities.value = newArray;
  } else if (field === 'accessibility') {
    accessibility.value = newArray;
  } else if (field === 'additionalAmenities') {
    additionalAmenities.value = newArray;
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
</script>

<template>
  <div class="property-detail-form">
    <h2>Property Details</h2>
    <p class="subtitle">Tell us about the sports and facilities available</p>

    <div class="form-section">
      <IonLabel class="section-label">Sports Available *</IonLabel>
      <div class="chip-container">
        <IonChip
          v-for="sport in SPORTS_OPTIONS"
          :key="sport"
          :color="selectedSports.includes(sport) ? 'primary' : 'medium'"
          :outline="!selectedSports.includes(sport)"
          @click="toggleSport(sport)"
          class="sport-chip"
        >
          {{ sport }}
        </IonChip>
      </div>
      <IonText color="danger" class="form-error" v-if="errors.sports">
        {{ errors.sports }}
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
          @ion-input="updateSubUnit(sport, $event.target.value)"
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
      <IonText color="danger" class="form-error" v-if="errors.surfaceType">
        {{ errors.surfaceType }}
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
          :key="facility"
          :color="selectedFacilities.includes(facility) ? 'primary' : 'medium'"
          :outline="!selectedFacilities.includes(facility)"
          @click="toggleArrayItem(selectedFacilities, facility, 'facilities')"
          class="facility-chip"
        >
          {{ facility }}
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
          :key="amenity"
          :color="selectedAmenities.includes(amenity) ? 'primary' : 'medium'"
          :outline="!selectedAmenities.includes(amenity)"
          @click="
            toggleArrayItem(selectedAmenities, amenity, 'additionalAmenities')
          "
          class="amenity-chip"
        >
          {{ amenity }}
        </IonChip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/theme/addPropertyForm.scss';

.property-detail-form {
  height: max-content;
  overflow: auto;
  padding: 16px;
  margin-bottom: 50px;
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

.sport-chip,
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

  .sport-chip,
  .surface-chip,
  .facility-chip,
  .accessibility-chip,
  .amenity-chip {
    font-size: 12px;
    --padding-start: 8px;
    --padding-end: 8px;
  }
}
</style>
