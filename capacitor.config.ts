import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mineai.app',
  appName: 'mine.ai',
  webDir: 'out',
  server: {
    androidScheme: 'http',
    allowNavigation: ['*']
  }
};

export default config;
