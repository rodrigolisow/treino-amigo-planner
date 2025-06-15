import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e8359eeadb034704ad9bcd4c27dfe214',
  appName: 'treino-amigo-planner',
  webDir: 'dist',
  server: {
    url: "https://e8359eea-db03-4704-ad9b-cd4c27dfe214.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#3b82f6',
    },
    Haptics: {
      enable: true,
    },
  },
};

export default config;