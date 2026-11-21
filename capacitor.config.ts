import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.almamo.hardware',
  appName: 'خردوات المامو',
  webDir: 'dist',
  server: {
    // Use https://localhost inside Android WebView so:
    // 1) Firebase Auth default "localhost" authorized domain works automatically without SHA/domain mismatch
    // 2) Web Camera API (getUserMedia), IndexedDB, and Persistent Storage run in a full Secure Context
    androidScheme: 'https',
    hostname: 'localhost',
    allowNavigation: [
      'first-hook-1w2pc.firebaseapp.com',
      '*.firebaseapp.com',
      '*.googleapis.com',
      '*.google.com',
      'accounts.google.com',
      '*.googleusercontent.com',
      '*.onrender.com',
    ],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    backgroundColor: '#020617',
  },
};

export default config;
