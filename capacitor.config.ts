import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.300c0456112a43faa331885c26fd219f',
  appName: 'pulse-access-hub',
  webDir: 'dist',
  server: {
    url: 'https://300c0456-112a-43fa-a331-885c26fd219f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Browser: {
      backgroundColor: '#0a0a0a'
    }
  }
};

export default config;