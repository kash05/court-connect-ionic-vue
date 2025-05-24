import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PropertyForm } from '@/types/addPropertyInterface';
import { Preferences } from '@capacitor/preferences';

const FORM_KEY = 'propertyFormData';

export const useFormStore = defineStore('formStore', () => {
  const propertyForm = ref<PropertyForm>({
    basicInfo: {
      name: '',
      description: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      contactPhone: '',
      contactEmail: '',
    },
    propertyDetail: {
      sports: [],
      subUnits: {},
      surfaceType: '',
      facilities: [],
      equipmentRental: false,
      accessibility: [],
      additionalAmenities: [],
    },
    timingAndAvailability: {
      openingHours: {
        open: '00:00',
        close: '23:59',
      },
      bookingMode: 'slots',
      slotDuration: 60,
      maxAdvanceDays: 30,
      minNoticeHours: 2,
    },
    bookingAndPricing: {
      pricingModel: 'hourly',
      baseRate: 0,
      peakRates: [],
      securityDeposit: 0,
      preBooking: false,
      fullDayBooking: false,
      cancellationPolicy: {
        freeWindowHours: 24,
        feePercent: 0,
        noShowCharge: 0,
      },
    },
    media: {
      images: [],
      videoUrl: undefined,
      floorPlan: undefined,
      isActive: true,
    },
  });

  const userProperties = ref<PropertyForm[]>([]);
  const filters = ref<{
    sport?: string;
    location?: string;
    priceRange?: [number, number];
    radius?: number;
  }>({});

  const isLoading = ref(false);

  function setPropertyForm(data: PropertyForm) {
    propertyForm.value = data;
    saveFormData();
  }

  function updatePropertyForm(data: Partial<PropertyForm>) {
    propertyForm.value = { ...propertyForm.value, ...data };
    saveFormData();
  }

  function setUserProperties(properties: PropertyForm[]) {
    userProperties.value = properties;
  }

  function addProperty(property: PropertyForm) {
    userProperties.value.push(property);
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  async function saveFormData() {
    try {
      await Preferences.set({
        key: FORM_KEY,
        value: JSON.stringify(propertyForm.value),
      });
    } catch (error) {
      console.error('Error saving property form:', error);
    }
  }

  async function loadFormData() {
    try {
      const { value } = await Preferences.get({ key: FORM_KEY });
      if (value) {
        propertyForm.value = JSON.parse(value);
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  }

  async function resetForm() {
    propertyForm.value = {
      basicInfo: {
        name: '',
        description: '',
        address: '',
        latitude: undefined,
        longitude: undefined,
        contactPhone: '',
        contactEmail: '',
      },
      propertyDetail: {
        sports: [],
        subUnits: {},
        surfaceType: '',
        facilities: [],
        equipmentRental: false,
        accessibility: [],
        additionalAmenities: [],
      },
      timingAndAvailability: {
        openingHours: {
          open: '00:00',
          close: '23:59',
        },
        bookingMode: 'slots',
        slotDuration: 60,
        maxAdvanceDays: 30,
        minNoticeHours: 2,
      },
      bookingAndPricing: {
        pricingModel: 'hourly',
        baseRate: 0,
        peakRates: [],
        securityDeposit: 0,
        preBooking: false,
        fullDayBooking: false,
        cancellationPolicy: {
          freeWindowHours: 24,
          feePercent: 0,
          noShowCharge: 0,
        },
      },
      media: {
        images: [],
        videoUrl: undefined,
        floorPlan: undefined,
        isActive: true,
      },
    };
    await Preferences.remove({ key: FORM_KEY });
  }

  return {
    propertyForm,
    userProperties,
    filters,
    isLoading,

    setPropertyForm,
    updatePropertyForm,
    setUserProperties,
    addProperty,
    setFilters,

    saveFormData,
    loadFormData,
    resetForm,
  };
});
