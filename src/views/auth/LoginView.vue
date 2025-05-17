<script setup lang="ts">
import { login } from '@/services/authService';
import { loadingService } from '@/services/loadingService';
import { toastService } from '@/services/toastService';
import {
  IonButton,
  IonContent,
  IonPage,
  IonInput,
  IonItem,
  IonIcon,
  IonText,
} from '@ionic/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { ErrorMessage, useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { logoGoogle } from 'ionicons/icons';
import { ref } from 'vue';

const router = useRouter();
const formError = ref('');

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
);

const { handleSubmit, errors } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const onSubmit = handleSubmit((values) => {
  formError.value = '';

  loadingService.withLoading(
    () =>
      login(values)
        .then(() => {
          router.push('/dashboard');
        })
        .catch((error) => {
          formError.value =
            error.response?.data?.message || 'Login failed, please try again.';
          console.error('Signin failed:', error);
        }),
    'Logging you in...',
  );
});

const goToRegister = () => {
  router.push('/register');
};

const handleGoogleLogin = () => {
  console.log('Google login clicked');
  toastService.informationMessage('Google login feature is in development.');
};
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="page-container slide-in">
        <div class="login-container">
          <div class="logo-container">
            <div class="logo"></div>
          </div>

          <h1
            class="title"
            :class="{
              'mb-2': formError,
            }"
          >
            Sign In
          </h1>

          <GlobalMessage v-if="formError" type="error" :message="formError" />

          <ion-button
            expand="block"
            class="google-btn"
            @click="handleGoogleLogin"
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

          <form class="login-form" @submit.prevent="onSubmit">
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
              ></ion-input>
            </ion-item>
            <ion-text color="danger" class="error-text" v-if="errors.password">
              <ErrorMessage name="password" />
            </ion-text>

            <div class="forgot-password">
              <ion-button fill="clear" size="small"
                >Forgot password?</ion-button
              >
            </div>

            <ion-button expand="block" type="submit" class="submit-btn">
              Sign In
            </ion-button>
          </form>

          <div class="create-account">
            <span>Don't have an account?</span>
            <ion-button fill="clear" @click="goToRegister"
              >Create Account</ion-button
            >
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

.login-container {
  display: flex;
  flex-direction: column;
  max-width: 340px;
  width: 100%;
  background-color: var(--bg-card, #ffffff);
  box-shadow: var(--shadow-md, 0 4px 20px rgba(0, 0, 0, 0.06));
  padding: 32px 24px;
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
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  color: var(--text-primary, var(--ion-color-dark));
}

.google-btn {
  --background: white;
  --color: #333;
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
  border-bottom: 1px solid var(--divider-color, #e0e0e0);
}

.divider span {
  padding: 0 12px;
  color: var(--text-muted, var(--ion-color-medium));
  font-size: 14px;
}

.login-form {
  width: 100%;
}

.form-item {
  --border-radius: var(--radius-md, 12px);
  --background: var(--bg-input, rgba(0, 0, 0, 0.03));
  --padding: 0;
  --inner-padding-end: 0;
  --border-color: transparent;
  --highlight-height: 0;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.form-item.has-error {
  --background: rgba(235, 68, 90, 0.05);
  --border-color: var(--ion-color-danger);
  --border-width: 1px;
  --border-style: solid;
}

.error-text {
  font-size: 12px;
  margin: 4px 0 16px 4px;
  height: 18px;
  display: block;
}

.forgot-password {
  text-align: right;
  margin: 4px 0 24px;
}

.forgot-password ion-button {
  --color: var(--ion-color-primary);
  font-size: 13px;
  --padding-start: 4px;
  --padding-end: 4px;
  margin: 0;
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
