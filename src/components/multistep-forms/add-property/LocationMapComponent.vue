<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import { IonButton, IonContent, IonIcon, IonSearchbar } from '@ionic/vue';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { locationSharp } from 'ionicons/icons';

const props = defineProps<{
  initialLatitude?: number;
  initialLongitude?: number;
  initialAddress?: string;
}>();

const emit = defineEmits<{
  'location-selected': [
    { latitude: number; longitude: number; address: string },
  ];
}>();

const mapRef = ref<HTMLElement | null>(null);
const map = ref<L.Map>();
const marker = ref<L.Marker | null>(null);
const searchQuery = ref('');
const currentAddress = ref(props.initialAddress || '');
const currentLatitude = ref(props.initialLatitude || 40.7128);
const currentLongitude = ref(props.initialLongitude || -74.006);

onMounted(() => {
  setTimeout(() => {
    initMap();
  }, 300);
});

watch(
  () => [props.initialLatitude, props.initialLongitude],
  ([newLat, newLng]) => {
    if (newLat && newLng && map.value) {
      setMarkerPosition(newLat, newLng);
      map.value.setView([newLat, newLng], 13);
    }
  },
);

const initMap = () => {
  if (!mapRef.value) return;

  const defaultLat = currentLatitude.value;
  const defaultLng = currentLongitude.value;

  map.value = L.map(mapRef.value).setView([defaultLat, defaultLng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map.value);

  marker.value = L.marker([defaultLat, defaultLng], {
    draggable: true,
  }).addTo(map.value);

  marker.value.on('dragend', updateMarkerPosition);

  map.value.on('click', (e: L.LeafletMouseEvent) => {
    setMarkerPosition(e.latlng.lat, e.latlng.lng);
  });

  if (props.initialAddress && props.initialLatitude && props.initialLongitude) {
    currentAddress.value = props.initialAddress;
  } else if (props.initialLatitude && props.initialLongitude) {
    reverseGeocode(props.initialLatitude, props.initialLongitude);
  }
};

const updateMarkerPosition = () => {
  if (!marker.value) return;

  const position = marker.value.getLatLng();
  currentLatitude.value = position.lat;
  currentLongitude.value = position.lng;

  reverseGeocode(position.lat, position.lng);
};

const setMarkerPosition = (lat: number, lng: number) => {
  currentLatitude.value = lat;
  currentLongitude.value = lng;

  if (marker.value && map.value) {
    marker.value.setLatLng([lat, lng]);
  } else if (map.value) {
    marker.value = L.marker([lat, lng], {
      draggable: true,
    }).addTo(map.value);
    marker.value.on('dragend', updateMarkerPosition);
  }

  reverseGeocode(lat, lng);
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await response.json();

    if (data && data.display_name) {
      currentAddress.value = data.display_name;
      emitLocationSelected();
    }
  } catch (error) {
    console.error('Error reverse geocoding:', error);
  }
};

const searchLocation = async () => {
  if (!searchQuery.value || !map.value) return;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.value)}`,
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon, display_name } = data[0];

      setMarkerPosition(parseFloat(lat), parseFloat(lon));

      currentAddress.value = display_name;

      map.value.setView([parseFloat(lat), parseFloat(lon)], 15);

      emitLocationSelected();
    }
  } catch (error) {
    console.error('Error searching location:', error);
  }
};

const useCurrentLocation = () => {
  if (navigator.geolocation && map.value) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        setMarkerPosition(lat, lng);

        map.value?.setView([lat, lng], 15);
      },
      (error) => {
        console.error('Error getting current location:', error);
      },
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

const emitLocationSelected = () => {
  emit('location-selected', {
    latitude: currentLatitude.value,
    longitude: currentLongitude.value,
    address: currentAddress.value,
  });
};
</script>

<template>
  <IonContent>
    <div class="location-search-container">
      <IonSearchbar
        type="text"
        placeholder="Search for a location"
        v-model="searchQuery"
        class="search-input"
      />
      <IonButton @click="searchLocation" size="small" fill="clear"
        >Search</IonButton
      >
    </div>
    <div class="flex w-full items-center justify-end pr-2 pb-3">
      <IonButton @click="useCurrentLocation" size="small">
        <IonIcon :icon="locationSharp" class="mr-2" /> Use Current
        Location</IonButton
      >
    </div>

    <div ref="mapRef" class="map-container"></div>

    <div class="location-details">
      <div v-if="currentLatitude && currentLongitude" class="coordinates">
        <p><strong>Latitude:</strong> {{ currentLatitude }}</p>
        <p><strong>Longitude:</strong> {{ currentLongitude }}</p>
      </div>
      <div v-if="currentAddress" class="selected-address">
        <p><strong>Selected Address:</strong> {{ currentAddress }}</p>
      </div>
    </div>
  </IonContent>
</template>

<style scoped lang="scss">
.location-search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  .search-input {
    flex: 1;
    --padding-start: 0.5rem;
  }
}

.map-container {
  height: 60vh;
  width: 100%;
  z-index: 0;
}

.location-details {
  padding: 1rem;

  .coordinates,
  .selected-address {
    margin-bottom: 1rem;

    p {
      margin: 0.25rem 0;
    }
  }
}
</style>
