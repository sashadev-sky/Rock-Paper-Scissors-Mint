import { useState, useEffect } from "react";

export interface Device {
  isDesktop: boolean;
  isIOS: boolean;
  isMobile: boolean;
  isTablet: boolean;
}

const useDeviceDetect = () => {
  const [device, setDevice] = useState<Device>({
    isDesktop: false,
    isIOS: false,
    isMobile: false,
    isTablet: false,
  });

  useEffect(() => {
    const ua = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    // WPDesktop is windows phone in desktop mode
    const isMicrosoftPhone = /IEMobile|Windows Phone|WPDesktop/i.test(ua);
    const isMicrosoftTablet =/windows(?!.*phone)(.*touch)/i.test(ua);
    const isIOS = /iPad|iP(hone|od)/i.test(ua);
    const isMobile =
      isMicrosoftPhone ||
      /iP(hone|od)|Android|(hpw|web)OS|BlackBerry|Kindle|Silk-Accelerated|Opera M(obi|ini)|Mobile/i.test(
        ua
      );
    const isTablet =
      isMicrosoftTablet ||
      /(iPad|Tablet|PlayBook|Silk)|(android(?!.*mobi))/i.test(ua);
    setDevice({
      isDesktop: !isMobile &&!isTablet,
      isIOS,
      isMobile,
      isTablet,
    });
  }, []);

  return { device };
}

export default useDeviceDetect;