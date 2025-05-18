import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.courtconnect',
  appName: 'CourtConnect',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
