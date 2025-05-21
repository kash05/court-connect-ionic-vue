import { defineStore } from 'pinia';
import { ref } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { PropertyForm } from '@/types/addPropertyInterface';

const STORAGE_KEY = 'propertyFormData';

export const useFormStore = defineStore('form', () => {
  const formData = ref<PropertyForm>({
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
      openingHours: {},
      bookingMode: 'slots',
      slotDuration: 60,
      weeklySlots: {},
      exceptions: [],
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

  async function saveFormData() {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(formData.value),
      });
    } catch (err) {
      console.error('Error saving form data:', err);
    }
  }

  async function initializeForm() {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        formData.value = JSON.parse(value);
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    }
  }

  function updateForm(data: Partial<PropertyForm>) {
    formData.value = { ...formData.value, ...data };
    saveFormData();
  }

  async function resetForm() {
    formData.value = {
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
        openingHours: {},
        bookingMode: 'slots',
        slotDuration: 60,
        weeklySlots: {},
        exceptions: [],
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
    await Preferences.remove({ key: STORAGE_KEY });
  }

  return {
    formData,
    initializeForm,
    saveFormData,
    resetForm,
    updateForm,
  };
});
