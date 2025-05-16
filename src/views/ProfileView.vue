<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { useAuthStore } from '@/stores/useAuthStore';
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const authStore = useAuthStore();

const profileData = ref({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  phone: '(123) 456-7890',
  birthdate: '1990-01-01',
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
    country: 'USA',
  },
});

const isPlayer = computed(() => authStore.isPlayer);
const isOwner = computed(() => authStore.isOwner);

const profileSchema = toTypedSchema(
  z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Please enter a valid phone number'),
    birthdate: z.string().optional(),
    bio: z.string().max(250, 'Bio must be less than 250 characters'),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      country: z.string().optional(),
    }),
  }),
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    name: profileData.value.name,
    email: profileData.value.email,
    phone: profileData.value.phone,
    bio: profileData.value.bio,
    birthdate: profileData.value.birthdate,
    address: {
      street: profileData.value.address.street,
      city: profileData.value.address.city,
      state: profileData.value.address.state,
      zip: profileData.value.address.zip,
      country: profileData.value.address.country,
    },
  },
});

const onSubmit = handleSubmit(async (values) => {
  profileData.value = {
    ...profileData.value,
    name: values.name,
    email: values.email,
    phone: values.phone,
    bio: values.bio,
  };
});

const playerStats = ref({
  position: 'Midfielder',
  height: '180 cm',
  weight: '75 kg',
  preferredFoot: 'Right',
  appearances: 28,
  goals: 12,
  assists: 8,
});

const isEditMode = ref(false);
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};
</script>

<template>
  <IonPage>
    <IonContent>
      <div class="page-container">
        <div class="profile-header">
          <div class="profile-cover">
            <img
              src="https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg"
              alt="Cover"
              class="h-48 w-full object-cover object-center"
            />
          </div>

          <div class="relative -mt-16 px-4">
            <div class="flex items-end justify-between">
              <div class="flex items-center">
                <div
                  class="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-md"
                >
                  <img
                    :src="
                      authStore.user?.profileImage ||
                      'https://via.placeholder.com/128'
                    "
                    alt="Profile"
                    class="h-full w-full object-cover"
                  />
                </div>

                <div class="ml-4">
                  <h1 class="text-2xl font-bold text-gray-900">
                    {{ profileData.name }}
                  </h1>
                  <p class="text-gray-600">
                    {{
                      isPlayer() ? 'Player' : isOwner() ? 'Team Owner' : 'User'
                    }}
                  </p>
                </div>
              </div>

              <button
                @click="toggleEditMode"
                class="btn bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                {{ isEditMode ? 'Cancel' : 'Edit Profile' }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <!-- Profile Information -->
          <div class="md:col-span-2">
            <div class="card">
              <h2 class="mb-6 text-xl font-bold">Profile Information</h2>

              <div v-if="isEditMode">
                <form @submit.prevent="onSubmit" class="space-y-4">
                  <label for="name" class="form-label">Full Name</label>
                  <input
                    name="name"
                    label="Full Name"
                    :placeholder="profileData.name"
                  />

                  <label for="email" class="form-label">Email Address</label>
                  <input
                    name="email"
                    label="Email Address"
                    type="email"
                    :placeholder="profileData.email"
                    autocomplete="email"
                  />

                  <label for="phone" class="form-label">Phone Number</label>
                  <input
                    name="phone"
                    label="Phone Number"
                    type="tel"
                    :placeholder="profileData.phone"
                  />

                  <div class="form-control">
                    <label for="bio" class="form-label">Bio</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows="4"
                      class="form-input"
                      placeholder="Write something about yourself"
                      v-model="profileData.bio"
                    ></textarea>
                  </div>

                  <div class="flex justify-end space-x-2">
                    <button
                      type="button"
                      class="btn bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      @click="toggleEditMode"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isSubmitting"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>

              <div v-else class="space-y-6">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Full Name</h3>
                    <p class="mt-1 text-gray-900">{{ profileData.name }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Email</h3>
                    <p class="mt-1 text-gray-900">{{ profileData.email }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Phone</h3>
                    <p class="mt-1 text-gray-900">{{ profileData.phone }}</p>
                  </div>

                  <div>
                    <h3 class="text-sm font-medium text-gray-500">
                      Birth Date
                    </h3>
                    <p class="mt-1 text-gray-900">
                      {{ new Date(profileData.birthdate).toLocaleDateString() }}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Bio</h3>
                  <p class="mt-1 text-gray-900">{{ profileData.bio }}</p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Address</h3>
                  <div class="mt-1 text-gray-900">
                    <p>{{ profileData.address.street }}</p>
                    <p>
                      {{ profileData.address.city }},
                      {{ profileData.address.state }}
                      {{ profileData.address.zip }}
                    </p>
                    <p>{{ profileData.address.country }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Player Statistics (only for players) -->
            <div v-if="isPlayer()" class="card mt-6">
              <h2 class="mb-6 text-xl font-bold">Player Statistics</h2>

              <div class="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Position</h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.position }}
                  </p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Height</h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.height }}
                  </p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Weight</h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.weight }}
                  </p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">
                    Preferred Foot
                  </h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.preferredFoot }}
                  </p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Appearances</h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.appearances }}
                  </p>
                </div>

                <div>
                  <h3 class="text-sm font-medium text-gray-500">Goals</h3>
                  <p class="mt-1 text-lg font-semibold text-gray-900">
                    {{ playerStats.goals }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Content -->
          <div>
            <!-- Account Actions -->
            <div class="card">
              <h3 class="mb-4 text-lg font-semibold">Account</h3>

              <div class="space-y-3">
                <button
                  class="btn w-full justify-start bg-white text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Change Password
                </button>

                <button
                  class="btn w-full justify-start bg-white text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Account Settings
                </button>

                <button
                  class="btn w-full justify-start bg-white text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-2 h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <!-- Teams Section -->
            <div class="card mt-6">
              <h3 class="mb-4 text-lg font-semibold">Your Teams</h3>

              <div class="space-y-3">
                <div class="flex items-center rounded-lg bg-gray-50 p-3">
                  <div
                    class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Team Logo"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Champions FC</p>
                    <p class="text-xs text-gray-500">Active Member</p>
                  </div>
                </div>

                <div class="flex items-center rounded-lg bg-gray-50 p-3">
                  <div
                    class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full"
                  >
                    <img
                      src="https://via.placeholder.com/40"
                      alt="Team Logo"
                      class="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">City United</p>
                    <p class="text-xs text-gray-500">Coach</p>
                  </div>
                </div>
              </div>

              <button
                class="btn mt-4 w-full bg-white text-primary-600 hover:bg-primary-50"
              >
                View All Teams
              </button>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.profile-header {
  @apply rounded-lg bg-white shadow-md;
}

.page-container {
  padding: 20px;
}

.profile-cover img {
  @apply rounded-t-lg;
}
</style>
