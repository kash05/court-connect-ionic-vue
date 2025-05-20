import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Preferences } from '@capacitor/preferences';

const STORAGE_KEY = 'propertyFormData';

export const useFormStore = defineStore('form', () => {
  const formData = ref({
    basicInfo: {
      propertyName: '',
      description: '',
    },
    contactDetails: {
      phoneNumber: '',
      email: '',
    },
    location: {
      address: '',
    },
    sportsDetails: {
      sportsAvailable: [] as string[],
      pricing: {} as Record<string, string>,
    },
    timingAndAvailability: {
      openingTime: '',
      closingTime: '',
      sportSlots: {} as Record<
        string,
        { start: string; end: string; available: boolean }[]
      >,
      isAvailable: true,
    },
    bookingSettings: {
      preBookingAllowed: false,
      fullDayBookingAllowed: false,
    },
    amenitiesAndPolicies: {
      amenities: [] as string[],
      cancellationPolicy: '',
    },
    media: {
      images: [] as string[],
    },
  });

  async function saveFormData() {
    try {
      await Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify(formData.value),
      });
    } catch (error) {
      console.error('Error saving form data to Preferences:', error);
    }
  }

  async function initializeForm() {
    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        formData.value = JSON.parse(value);
      }
    } catch (error) {
      console.error('Error loading form data from Preferences:', error);
    }
  }

  async function resetForm() {
    formData.value = {
      basicInfo: {
        propertyName: '',
        description: '',
      },
      contactDetails: {
        phoneNumber: '',
        email: '',
      },
      location: {
        address: '',
      },
      sportsDetails: {
        sportsAvailable: [],
        pricing: {},
      },
      timingAndAvailability: {
        openingTime: '',
        closingTime: '',
        sportSlots: {},
        isAvailable: true,
      },
      bookingSettings: {
        preBookingAllowed: false,
        fullDayBookingAllowed: false,
      },
      amenitiesAndPolicies: {
        amenities: [],
        cancellationPolicy: '',
      },
      media: {
        images: [],
      },
    };

    await Preferences.remove({ key: STORAGE_KEY });
  }

  function updateBasicInfo(data: Partial<typeof formData.value.basicInfo>) {
    Object.assign(formData.value.basicInfo, data);
    saveFormData();
  }

  function updateContactDetails(
    data: Partial<typeof formData.value.contactDetails>,
  ) {
    Object.assign(formData.value.contactDetails, data);
    saveFormData();
  }

  function updateLocation(data: Partial<typeof formData.value.location>) {
    Object.assign(formData.value.location, data);
    saveFormData();
  }

  function updateSportsDetails(
    data: Partial<typeof formData.value.sportsDetails>,
  ) {
    Object.assign(formData.value.sportsDetails, data);
    saveFormData();
  }

  function updateTimingAndAvailability(
    data: Partial<typeof formData.value.timingAndAvailability>,
  ) {
    Object.assign(formData.value.timingAndAvailability, data);
    saveFormData();
  }

  function updateBookingSettings(
    data: Partial<typeof formData.value.bookingSettings>,
  ) {
    Object.assign(formData.value.bookingSettings, data);
    saveFormData();
  }

  function updateAmenitiesAndPolicies(
    data: Partial<typeof formData.value.amenitiesAndPolicies>,
  ) {
    Object.assign(formData.value.amenitiesAndPolicies, data);
    saveFormData();
  }

  function updateMedia(data: Partial<typeof formData.value.media>) {
    Object.assign(formData.value.media, data);
    saveFormData();
  }

  const isBasicStepComplete = computed(() => {
    const { propertyName, description } = formData.value.basicInfo;
    return !!propertyName && !!description;
  });

  return {
    formData,
    initializeForm,
    saveFormData,
    resetForm,
    updateBasicInfo,
    updateContactDetails,
    updateLocation,
    updateSportsDetails,
    updateTimingAndAvailability,
    updateBookingSettings,
    updateAmenitiesAndPolicies,
    updateMedia,
    isBasicStepComplete,
  };
});
