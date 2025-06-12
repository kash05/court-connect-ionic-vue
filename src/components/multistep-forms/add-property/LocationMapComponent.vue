<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import {
    IonButton,
    IonContent,
    IonIcon,
    IonSearchbar,
    IonText,
    IonList,
    IonItem,
    IonHeader,
    IonToolbar,
} from '@ionic/vue';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { locationSharp, search } from 'ionicons/icons';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
import { onClickOutside } from '@vueuse/core';

const props = defineProps<{
    initialLatitude?: number;
    initialLongitude?: number;
    initialAddress?: string;
}>();

const emit = defineEmits<{
    'location-selected': [
        { latitude: number; longitude: number; address: string },
    ];
    close: [];
}>();

const mapRef = ref<HTMLElement | null>(null);
const map = ref<L.Map>();
const marker = ref<L.Marker | null>(null);
const searchQuery = ref('');
const currentAddress = ref(props.initialAddress || '');
const currentLatitude = ref(props.initialLatitude || 40.7128);
const currentLongitude = ref(props.initialLongitude || -74.006);
const searchResults = ref<any[]>([]);
const showSearchResults = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const originalLatitude = ref<number | null>(null);
const originalLongitude = ref<number | null>(null);
const originalAddress = ref<string | null>(null);

const fixLeafletIcon = () => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
    });
};

onMounted(() => {
    fixLeafletIcon();

    originalLatitude.value = props.initialLatitude ?? 40.7128;
    originalLongitude.value = props.initialLongitude ?? -74.006;
    originalAddress.value = props.initialAddress ?? '';

    setTimeout(() => {
        initMap();
    }, 300);
});

onClickOutside(dropdownRef, () => {
    showSearchResults.value = false;
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        map.value,
    );

    marker.value = L.marker([defaultLat, defaultLng], {
        draggable: true,
    }).addTo(map.value);

    marker.value.on('dragend', updateMarkerPosition);

    map.value.on('click', (e: L.LeafletMouseEvent) => {
        setMarkerPosition(e.latlng.lat, e.latlng.lng);
    });

    if (
        props.initialAddress &&
        props.initialLatitude &&
        props.initialLongitude
    ) {
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

const searchLocationSuggestions = async (query: string) => {
    if (!query) return;

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        );
        const data = await response.json();

        if (data && data.length > 0) {
            searchResults.value = data;
            showSearchResults.value = true;
        } else {
            searchResults.value = [];
        }
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        searchResults.value = [];
    }
};

const selectSuggestion = (result: any) => {
    if (!map.value) return;

    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    setMarkerPosition(lat, lng);
    currentAddress.value = result.display_name;
    map.value.setView([lat, lng], 15);
    emitLocationSelected();

    searchResults.value = [];
    showSearchResults.value = false;
    searchQuery.value = result.display_name;
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

            searchResults.value = [];
            showSearchResults.value = false;
        }
    } catch (error) {
        console.error('Error searching location:', error);
    }
};

const useCurrentLocation = async () => {
    try {
        // Request permissions first
        const permissionStatus = await Geolocation.checkPermissions();

        if (permissionStatus.location !== 'granted') {
            const requestResult = await Geolocation.requestPermissions();

            if (requestResult.location !== 'granted') {
                await Dialog.alert({
                    title: 'Permission Required',
                    message:
                        'Location permission is required to use this feature.',
                });
                return;
            }
        }

        // Get current position using Capacitor plugin
        const position = await Geolocation.getCurrentPosition({
            enableHighAccuracy: true,
        });

        const { latitude: lat, longitude: lng } = position.coords;

        setMarkerPosition(lat, lng);
        if (map.value) {
            map.value.setView([lat, lng], 15);
        }
    } catch (error) {
        console.error('Error getting current location:', error);
        await Dialog.alert({
            title: 'Location Required',
            message:
                'Please allow location access to set your current location.',
        });
    }
};

const emitLocationSelected = () => {
    emit('location-selected', {
        latitude: currentLatitude.value,
        longitude: currentLongitude.value,
        address: currentAddress.value,
    });
};

const restoreOriginalLocation = () => {
    if (
        !originalLatitude.value ||
        !originalLongitude.value ||
        !originalAddress.value
    )
        return;

    currentLatitude.value = originalLatitude.value;
    currentLongitude.value = originalLongitude.value;
    currentAddress.value = originalAddress.value;
    searchQuery.value = originalAddress.value || '';

    emitLocationSelected();

    if (marker.value) {
        marker.value.setLatLng([
            originalLatitude.value,
            originalLongitude.value,
        ]);
    }

    if (map.value) {
        map.value.setView(
            [originalLatitude.value, originalLongitude.value],
            13,
        );
    }
};

const handleCancel = () => {
    restoreOriginalLocation();
    emit('close');
};

const handleSave = () => {
    emitLocationSelected();
    emit('close');
};
</script>

<template>
    <IonContent>
        <IonHeader class="ion-no-border ion-no-padding">
            <IonToolbar>
                <div class="flex w-full justify-between">
                    <IonButton size="small" fill="clear" @click="handleCancel"
                        >Cancel</IonButton
                    >
                    <IonButton size="small" fill="clear" @click="handleSave"
                        >Save</IonButton
                    >
                </div>
            </IonToolbar>
        </IonHeader>
        <div class="location-search-container">
            <div class="search-container">
                <IonSearchbar
                    type="text"
                    placeholder="Search for a location"
                    v-model="searchQuery"
                    class="search-input"
                    :debounce="300"
                    @ionInput="
                        (e) => {
                            if (e.detail.value && e.detail.value.length > 2)
                                searchLocationSuggestions(e.detail.value);
                        }
                    "
                />
                <div
                    ref="dropdownRef"
                    class="search-dropdown"
                    v-if="showSearchResults"
                >
                    <IonList v-if="searchResults.length > 0">
                        <IonItem
                            v-for="(result, index) in searchResults"
                            :key="index"
                            button
                            @click="selectSuggestion(result)"
                        >
                            <IonIcon :icon="search" slot="start" />
                            {{ result.display_name }}
                        </IonItem>
                    </IonList>
                    <div v-else class="no-results">No results found</div>
                </div>
            </div>
            <IonButton
                @click="searchLocation"
                size="small"
                fill="clear"
                class="ion-no-padding mr-3"
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
                <IonText
                    ><strong>Latitude:</strong> {{ currentLatitude }}</IonText
                >
                <IonText
                    ><strong>Longitude:</strong> {{ currentLongitude }}</IonText
                >
            </div>
            <div v-if="currentAddress" class="selected-address">
                <IonText
                    ><strong>Selected Address:</strong>
                    {{ currentAddress }}</IonText
                >
            </div>
        </div>
    </IonContent>
</template>

<style scoped lang="scss">
ion-header {
    ion-toolbar {
        padding-top: 5px;
        --background: var(--ion-color-light);

        ion-button {
            font-size: 17px;
            color: var(--ion-color-primary);
        }

        ion-title {
            margin-top: 2px;
            font-size: 16px;
            font-weight: 800;
            color: var(--ion-color-dark);
        }
    }
}

.location-search-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    position: relative;

    .search-container {
        flex: 1;
        position: relative;
    }

    .search-input {
        --background: var(--ion-color-light-shade);
        width: 100%;
    }

    .search-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 999;
        background: white;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-height: 200px;
        overflow-y: auto;

        ion-item {
            --padding-start: 8px;
            --min-height: 40px;
            font-size: 14px;

            ion-icon {
                font-size: 16px;
                margin-right: 8px;
            }
        }

        .no-results {
            font-size: 14px;
            color: var(--ion-color-medium);
            padding: 10px;
        }
    }
}

.map-container {
    height: 58vh;
    width: 100%;
    z-index: 0;
}

.location-details {
    padding: 1rem;

    .coordinates,
    .selected-address {
        margin-bottom: 1rem;

        ion-text {
            display: block;
            margin: 0.25rem 0;
            font-size: 14px;
            color: var(--ion-color-dark);
            strong {
                font-weight: 600;
                font-size: 16px;
                color: var(--ion-color-medium);
            }
        }
    }
}
</style>
