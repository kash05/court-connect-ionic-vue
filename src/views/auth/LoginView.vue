<script setup lang="ts">
import { login } from '@/services/authService';
import { loadingService } from '@/services/loadingService';
import { toastService } from '@/services/toastService';
import {
  IonInput,
  IonButton,
  IonItem,
  IonContent,
  IonIcon,
  IonPage,
  IonCheckbox,
  IonText,
} from '@ionic/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { logoGoogle, lockClosedOutline, mailOutline } from 'ionicons/icons';
import { ErrorMessage, useField, useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { z } from 'zod';

const router = useRouter();

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: loginSchema,
});

const { value: email } = useField<string>('email');
const { value: password } = useField<string>('password');

const onSubmit = handleSubmit((values) => {
  const loginData = {
    email: values.email,
    password: values.password,
  };

  loadingService.withLoading(
    () =>
      login(loginData)
        .then(() => {
          router.push('/dashboard');
        })
        .catch((error) => {
          toastService.dangerMessage('Login failed, please try again.');
          console.error('Signin failed:', error);
        }),
    'Signing in...',
  );
});

const goToRegister = () => {
  router.push('/register');
};
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="login-container">
        <div class="login-card">
          <div class="brand">
            <div class="logo"></div>
          </div>

          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">Sign in to continue</p>

          <form class="login-form" @submit.prevent="onSubmit">
            <div class="input-group">
              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                  <ion-input
                    type="email"
                    aria-label="none"
                    placeholder="Enter your email"
                    v-model="email"
                  ></ion-input>
                </ion-item>
                <ion-text color="danger" class="text-sm pl-16 block pb-2">
                  <ErrorMessage name="email" />
                </ion-text>
              </div>

              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                  <ion-input
                    type="password"
                    aria-label="none"
                    placeholder="Enter your password"
                    v-model="password"
                  ></ion-input>
                </ion-item>
                <ion-text color="danger" class="text-sm block pl-16">
                  <ErrorMessage name="password" />
                </ion-text>
              </div>
            </div>

            <div class="options-row">
              <ion-checkbox labelPlacement="end">Remember me</ion-checkbox>
              <ion-button fill="clear" size="small" class="forgot-btn">Forgot password?</ion-button>
            </div>

            <ion-button expand="block" class="login-button" type="submit">
              <span class="btn-text">Log in</span>
            </ion-button>

            <ion-button expand="block" fill="clear" class="signup-link" @click="goToRegister">
              <span>Not yet a member? <strong>Sign up!</strong></span>
            </ion-button>

            <div class="divider">
              <span>or continue with</span>
            </div>

            <div class="social-buttons">
              <ion-button class="social-btn google-btn">
                <ion-icon :icon="logoGoogle" slot="icon-only"></ion-icon>
              </ion-button>
            </div>
          </form>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped lang="scss">
@use '@/theme/mixins.scss' as *;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 16px;
}

.login-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 400px;
  transform: translateY(0);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  animation: fadeIn 0.6s ease-out;
}

.brand {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.login-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--dark-color);
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  margin: 0;
  font-size: 16px;
  color: var(--medium-color);
  text-align: center;
  margin-bottom: 32px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 24px;
}

ion-item {
  margin-bottom: 10px;
}

.password-toggle:hover {
  opacity: 1;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
}

ion-checkbox {
  --size: 16px;
  --checkbox-background-checked: var(--primary-color);
  margin-right: 8px;
}

.forgot-btn {
  --color: var(--primary-color);
  --padding-start: 0;
  --padding-end: 0;
  font-weight: 500;
  font-size: 14px;
  margin: 0;
  height: 20px;
}

.login-button {
  margin: 0;
  --background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --background-activated: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --background-hover: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --border-radius: 12px;
  --box-shadow: 0 4px 16px rgba(56, 128, 255, 0.3);
  --padding-top: 16px;
  --padding-bottom: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  --box-shadow: 0 6px 20px rgba(56, 128, 255, 0.4);
}

.login-button:hover::before {
  opacity: 1;
}

.btn-text {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.signup-link {
  --color: var(--medium-color);
  font-size: 14px;
  margin: 0;
  margin-bottom: 32px;
}

.signup-link strong {
  color: var(--primary-color);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.divider span {
  padding: 0 16px;
  color: var(--medium-color);
  font-size: 14px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.social-btn {
  --background: #ffffff;
  --background-activated: #f5f5f5;
  --background-hover: #f8f8f8;
  --border-radius: 12px;
  --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  --color: var(--dark-color);
  width: 56px;
  height: 56px;
  margin: 0;
  transition: transform 0.2s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.google-btn ion-icon {
  color: #db4437;
}

.apple-btn ion-icon {
  color: #000000;
}

@include mobile-selector {
  .login-card {
    padding: 24px;
    border-radius: 20px;
  }

  .login-title {
    font-size: 24px;
  }

  .login-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .logo {
    width: 56px;
    height: 56px;
  }
}

@include tablet-selector {
  .login-card {
    padding: 40px;
  }

  .login-title {
    font-size: 32px;
  }

  .login-subtitle {
    font-size: 16px;
  }
}
</style>
