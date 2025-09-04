import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

export const openInAppBrowser = async (url: string) => {
  try {
    if (Capacitor.isNativePlatform()) {
      // Use Capacitor's InAppBrowser for mobile
      await Browser.open({
        url,
        windowName: '_blank',
        toolbarColor: '#0a0a0a',
        presentationStyle: 'popover',
      });
    } else {
      // For web, use a modal/iframe approach
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  } catch (error) {
    console.error('Error opening in-app browser:', error);
    // Fallback to regular window.open
    window.open(url, '_blank', 'noopener,noreferrer');
  }
};

export const closeInAppBrowser = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      await Browser.close();
    }
  } catch (error) {
    console.error('Error closing in-app browser:', error);
  }
};