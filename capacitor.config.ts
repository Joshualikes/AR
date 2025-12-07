import { CapacitorConfig } from '@capacitor/cli';

const liveReloadUrl = process.env.CAP_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: 'app.greengrowar.com',
  appName: 'GreenGrow AR',
  webDir: 'dist',
  server: liveReloadUrl
    ? {
        url: liveReloadUrl,
        cleartext: true,
      }
    : {
        androidScheme: 'https',
      },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3FA84A',
      showSpinner: false,
    },
  },
};

export default config;
