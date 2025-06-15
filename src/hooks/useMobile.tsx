import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useMobile = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());

    if (Capacitor.isNativePlatform()) {
      let keyboardShowListener: any;
      let keyboardHideListener: any;

      const setupListeners = async () => {
        keyboardShowListener = await Keyboard.addListener('keyboardWillShow', () => {
          setIsKeyboardOpen(true);
        });

        keyboardHideListener = await Keyboard.addListener('keyboardWillHide', () => {
          setIsKeyboardOpen(false);
        });
      };

      setupListeners();

      return () => {
        if (keyboardShowListener) keyboardShowListener.remove();
        if (keyboardHideListener) keyboardHideListener.remove();
      };
    }
  }, []);

  const hapticFeedback = (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style });
    }
  };

  return {
    isKeyboardOpen,
    isNative,
    hapticFeedback,
  };
};