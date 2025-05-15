import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.sportsapp',
  appName: 'Sports App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;