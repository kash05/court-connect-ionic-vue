<script setup lang="ts">
import { useRouter } from "vue-router";
import { ErrorMessage, useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { registerUser } from "@/services/authService";
import { loadingService } from "@/services/loadingService";
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
  IonRadioGroup,
  IonLabel,
} from "@ionic/vue";
import {
  logoGoogle,
  lockClosedOutline,
  mailOutline,
  personOutline,
  personCircleOutline,
} from "ionicons/icons";
import { toastService } from "@/services/toastService";

const router = useRouter();

const registerSchema = toTypedSchema(
  z
    .object({
      fullName: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
      gender: z.string().min(2, "Gender is required"),
      agreeTerms: z.boolean().refine((val) => val, {
        message: "You must agree to terms and conditions",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })
);

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    fullName: "",
    email: "",
    password: "",
    gender: "",
    confirmPassword: "",
    agreeTerms: false,
  },
});

const { value: fullName } = useField<string>("fullName");
const { value: email } = useField<string>("email");
const { value: password } = useField<string>("password");
const { value: confirmPassword } = useField<string>("confirmPassword");
const { value: gender } = useField<string>("gender");
const { value: agreeTerms } = useField<boolean>("agreeTerms");

const onSubmit = handleSubmit((values) => {
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
          router.push("/login");
        })
        .catch((error) => {
          toastService.dangerMessage("Registration failed, please try again.");
          console.error("Error registering owner:", error);
        }),
    "Registering your account..."
  );
});

const goToLogin = () => {
  router.push("/login");
};
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="register-container">
        <div class="register-card">
          <div class="brand">
            <div class="logo"></div>
          </div>

          <h1 class="register-title">Create Account</h1>
          <p class="register-subtitle">Join us to get started</p>

          <form class="register-form" @submit.prevent="onSubmit">
            <div class="input-group">
              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="personOutline" slot="start"></ion-icon>
                  <ion-input
                    type="text"
                    aria-label="Full Name"
                    placeholder="Enter your full name"
                    v-model="fullName"
                  ></ion-input>
                </ion-item>
                <ion-text color="danger" class="text-sm pl-16 block pb-2">
                  <ErrorMessage name="fullName" />
                </ion-text>
              </div>

              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="mailOutline" slot="start"></ion-icon>
                  <ion-input
                    type="email"
                    aria-label="Email"
                    placeholder="Enter your email"
                    v-model="email"
                    autocomplete="email"
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
                    aria-label="Password"
                    placeholder="Create password"
                    v-model="password"
                    autocomplete="new-password"
                  ></ion-input>
                </ion-item>
                <ion-text color="danger" class="text-sm pl-16 block pb-2">
                  <ErrorMessage name="password" />
                </ion-text>
              </div>

              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="lockClosedOutline" slot="start"></ion-icon>
                  <ion-input
                    type="password"
                    aria-label="Confirm Password"
                    placeholder="Confirm password"
                    v-model="confirmPassword"
                    autocomplete="new-password"
                  ></ion-input>
                </ion-item>
                <ion-text color="danger" class="text-sm pl-16 block pb-2">
                  <ErrorMessage name="confirmPassword" />
                </ion-text>
              </div>

              <div class="form-field">
                <ion-item>
                  <ion-icon :icon="personCircleOutline" slot="start"></ion-icon>
                  <ion-label>Gender</ion-label>
                </ion-item>

                <div class="radio-container pl-16">
                  <ion-radio-group v-model="gender">
                    <ion-item lines="none">
                      <ion-radio value="male">Male</ion-radio>
                    </ion-item>

                    <ion-item lines="none">
                      <ion-radio value="female">Female</ion-radio>
                    </ion-item>
                  </ion-radio-group>
                </div>

                <ion-text color="danger" class="text-sm pl-16 block pb-2">
                  <ErrorMessage name="gender" />
                </ion-text>
              </div>
            </div>

            <div class="terms-row">
              <ion-checkbox v-model="agreeTerms" labelPlacement="end">
                <span class="terms-text">
                  I agree to the
                  <a href="#" class="terms-link">Terms of Service</a> and
                  <a href="#" class="terms-link">Privacy Policy</a>
                </span>
              </ion-checkbox>
              <ion-text color="danger" class="text-sm block pl-16">
                <ErrorMessage name="agreeTerms" />
              </ion-text>
            </div>

            <ion-button
              expand="block"
              class="register-button"
              type="submit"
              :disabled="isSubmitting"
            >
              <span class="btn-text">Create Account</span>
            </ion-button>

            <ion-button
              expand="block"
              fill="clear"
              class="login-link"
              @click="goToLogin"
            >
              <span>Already have an account? <strong>Sign in</strong></span>
            </ion-button>

            <div class="divider">
              <span>or register with</span>
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
@use "@/theme/mixins.scss" as *;

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  padding: 16px;
}

.register-card {
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
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.register-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--dark-color);
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.register-subtitle {
  margin: 0;
  font-size: 16px;
  color: var(--medium-color);
  text-align: center;
  margin-bottom: 32px;
}

.register-form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 24px;
}

.form-field {
  margin-bottom: 16px;
}

ion-item ion-icon {
  color: var(--medium-color);
  margin-right: 8px;
}

.terms-row {
  margin-bottom: 24px;
}

.terms-text {
  font-size: 12px;
  color: var(--medium-color);
}

.terms-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.register-button {
  margin: 0;
  --background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  --background-activated: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
  --background-hover: linear-gradient(
    135deg,
    var(--primary-color),
    var(--secondary-color)
  );
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

  &:hover {
    transform: translateY(-2px);
    --box-shadow: 0 6px 20px rgba(56, 128, 255, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    transform: none;
  }
}

.btn-text {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
}

.login-link {
  --color: var(--medium-color);
  font-size: 14px;
  margin: 0;
  margin-bottom: 32px;

  strong {
    color: var(--primary-color);
  }
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  span {
    padding: 0 16px;
    color: var(--medium-color);
    font-size: 14px;
  }
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

  &:hover {
    transform: translateY(-2px);
  }
}

.google-btn ion-icon {
  color: #db4437;
}

@include mobile-selector {
  .register-card {
    padding: 24px;
    border-radius: 20px;
  }

  .register-title {
    font-size: 24px;
  }

  .register-subtitle {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .logo {
    width: 56px;
    height: 56px;
  }
}

@include tablet-selector {
  .register-card {
    padding: 40px;
  }

  .register-title {
    font-size: 32px;
  }

  .register-subtitle {
    font-size: 16px;
  }
}
</style>
