<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ErrorMessage, useField, useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { registerUser } from '@/services/authService';
import { loadingService } from '@/services/loadingService';
import {
  IonInput,
  IonCheckbox,
  IonButton,
  IonItem,
  IonIcon,
  IonContent,
  IonPage,
  IonText,
  IonRadio,
  IonLabel,
  IonRadioGroup,
  IonInputPasswordToggle,
} from '@ionic/vue';
import { logoGoogle } from 'ionicons/icons';
import { ref } from 'vue';
import { toastService } from '@/services/toastService';

const router = useRouter();
const formError = ref('');

const registerSchema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        ),
      confirmPassword: z.string(),
      gender: z.string().min(2, 'Gender is required'),
      agreeTerms: z.boolean().refine((val) => val, {
        message: 'You must agree to terms and conditions',
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    fullName: '',
    email: '',
    password: '',
    gender: '',
    confirmPassword: '',
    agreeTerms: false,
  },
});

const { value: fullName } = useField<string>('fullName');
const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');
const { value: confirmPassword } = useField<string>('confirmPassword');
const { value: gender } = useField<string>('gender');
const { value: agreeTerms } = useField<boolean>('agreeTerms');

const onSubmit = handleSubmit((values) => {
  formError.value = '';

  const registrationData = {
    email: values.email,
    password: values.password,
    full_name: values.fullName,
    gender: values.gender,
    agree_terms: values.agreeTerms,
  };

  loadingService.withLoading(
    () =>
      registerUser(registrationData)
        .then(() => {
          router.push('/login');
        })
        .catch((error) => {
          formError.value =
            error.response?.data?.message ||
            'Registration failed, please try again.';
          console.error('Error registering owner:', error);
        }),
    'Registering your account...',
  );
});

const goToLogin = () => {
  router.push('/login');
};

const handleGoogleRegistration = () => {
  console.log('Google login clicked');
  toastService.informationMessage('Google login feature is in development.');
};
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="page-container slide-in">
        <div class="registration-container">
          <div class="logo-container">
            <div class="logo">
              <img src="../../assets/appIcon.webp" alt="logo" />
            </div>
          </div>

          <h1
            class="title"
            :class="{
              'mb-2': formError,
            }"
          >
            Registeration
          </h1>

          <GlobalMessage v-if="formError" type="error" :message="formError" />

          <ion-button
            expand="block"
            class="google-btn"
            @click="handleGoogleRegistration"
            :class="{
              'mt-2': formError,
            }"
          >
            <ion-icon
              :icon="logoGoogle"
              class="btn-icon"
              slot="start"
            ></ion-icon>
            Continue with Google
          </ion-button>

          <div class="divider">
            <span>or</span>
          </div>

          <form class="registration-form" @submit.prevent="onSubmit">
            <ion-item
              class="form-item ion-no-padding"
              :class="{ 'has-error': errors.fullName }"
            >
              <ion-input
                placeholder="Full Name"
                v-model="fullName"
                class="ion-no-padding"
              ></ion-input>
            </ion-item>
            <ion-text color="danger" class="error-text" v-if="errors.fullName">
              <ErrorMessage name="fullName" />
            </ion-text>

            <ion-item
              class="form-item ion-no-padding"
              :class="{ 'has-error': errors.email }"
            >
              <ion-input
                type="email"
                placeholder="Email"
                v-model="email"
                class="ion-no-padding"
              ></ion-input>
            </ion-item>
            <ion-text color="danger" class="error-text" v-if="errors.email">
              <ErrorMessage name="email" />
            </ion-text>

            <ion-item
              class="form-item ion-no-padding"
              :class="{ 'has-error': errors.password }"
            >
              <ion-input
                type="password"
                placeholder="Password"
                v-model="password"
                class="ion-no-padding"
                ><ion-input-password-toggle
                  slot="end"
                ></ion-input-password-toggle
              ></ion-input>
            </ion-item>
            <ion-text color="danger" class="error-text" v-if="errors.password">
              <ErrorMessage name="password" />
            </ion-text>

            <ion-item
              class="form-item ion-no-padding"
              :class="{ 'has-error': errors.confirmPassword }"
            >
              <ion-input
                type="password"
                placeholder="Confirm password"
                v-model="confirmPassword"
                class="ion-no-padding"
                ><ion-input-password-toggle
                  slot="end"
                ></ion-input-password-toggle
              ></ion-input>
            </ion-item>
            <ion-text
              color="danger"
              class="error-text"
              v-if="errors.confirmPassword"
            >
              <ErrorMessage name="confirmPassword" />
            </ion-text>

            <ion-radio-group
              v-model="gender"
              class="flex flex-col space-y-1 my-4"
            >
              <ion-label class="text-md">Select Your Gender</ion-label>
              <div>
                <ion-radio value="male" aria-label="none" class="text-sm"
                  >Male</ion-radio
                >
                <ion-radio value="female" aria-label="none" class="text-sm"
                  >Female</ion-radio
                >
              </div>
            </ion-radio-group>

            <ion-text color="danger" class="error-text" v-if="errors.gender">
              <ErrorMessage name="gender" />
            </ion-text>

            <ion-item class="form-item ion-no-padding">
              <div class="flex flex-col space-y-1">
                <ion-checkbox v-model="agreeTerms"></ion-checkbox>
                <ion-text class="text-sm">
                  <span>I agree to the</span>
                  <a href="#" class="terms-link"> Terms of Service</a>
                  and
                  <a href="#" class="terms-link"> Privacy Policy</a>
                </ion-text>
              </div>
            </ion-item>
            <ion-text
              color="danger"
              class="error-text"
              v-if="errors.agreeTerms"
            >
              <ErrorMessage name="agreeTerms" />
            </ion-text>

            <ion-button expand="block" type="submit" class="submit-btn">
              Create Account
            </ion-button>
          </form>

          <div class="create-account">
            <span>Already have an account?</span>
            <ion-button fill="clear" @click="goToLogin">Sign in</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
ion-content::part(background) {
  background-image: url('@/assets/auth/bg.webp');
  background-size: cover;
  background-position: center;
}
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.registration-container {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  background-color: var(--bg-card);
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.06));
  padding: 20px 24px;
  margin: 16px;
}

.logo-container {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 64px;
  height: 64px;
  background-color: var(--ion-color-primary);
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  color: var(--text-primary, var(--ion-color-dark));
}

.google-btn {
  --background: var(--ion-color-primary);
  color: var(--ion-color-light);
  --border-radius: var(--radius-md, 12px);
  --border-color: var(--border-color, #e0e0e0);
  --border-style: solid;
  --border-width: 1px;
  --box-shadow: none;
  height: 48px;
  font-weight: 500;
}

.btn-icon {
  margin-right: 8px;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 24px 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--divider-color);
}

.divider span {
  padding: 0 12px;
  color: var(--text-muted, var(--ion-color-medium));
  font-size: 14px;
}

.registration-form {
  width: 100%;
}

.form-item {
  --border-radius: var(--radius-md, 12px);
  --background: var(--ion-color-light);
  --padding: 0;
  --inner-padding-end: 0;
  --border-color: transparent;
  --highlight-height: 0;
  margin-bottom: 4px;
  transition: all 0.2s ease;

  ion-input {
    background-color: var(--ion-color-light);
    color: var(--ion-color-dark);
    --padding-start: 12px !important;
    --padding-end: 12px !important;
  }
  ion-input-password-toggle {
    background-color: transparent;
  }
}

.form-item.has-error {
  --border-color: var(--ion-color-danger);
  --border-width: 1px;
  --border-style: solid;
}

ion-radio {
  --border-radius: 4px;
  --inner-border-radius: 4px;
  --color-checked: var(--ion-color-primary);
  margin-right: 10px;
}

ion-radio::part(container) {
  width: 20px;
  height: 20px;
  border: 2px solid var(--ion-color-medium-tint);
  border-radius: 4px;
}

.radio-checked::part(container) {
  border-color: var(--ion-color-primary);
}

.error-text {
  font-size: 12px;
  margin: 4px 0 16px 4px;
  height: 18px;
  display: block;
}

ion-checkbox {
  --border-radius: 4px;
  --inner-border-radius: 4px;
  --color-checked: var(--ion-color-primary);
}

ion-checkbox::part(container) {
  width: 20px;
  height: 20px;
  border: 2px solid var(--ion-color-medium-tint);
  border-radius: 4px;
}

.checkbox-checked::part(container) {
  border-color: var(--ion-color-primary);
}

.terms-link {
  color: var(--ion-color-primary);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.submit-btn {
  --border-radius: var(--radius-md, 12px);
  height: 48px;
  margin-bottom: 24px;
  --background: var(--ion-color-primary);
  --box-shadow: 0 4px 12px rgba(var(--primary-color-rgb, 56, 128, 255), 0.15);
}

.create-account {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.create-account span {
  color: var(--text-muted, var(--ion-color-medium));
  font-size: 14px;
}

.create-account ion-button {
  --color: var(--ion-color-primary);
  --padding-start: 4px;
  --padding-end: 4px;
  height: auto;
  font-weight: 500;
  margin: 0;
}

@media (max-height: 600px) {
  .page-container {
    align-items: flex-start;
    padding: 48px 0;
  }
}
</style>
