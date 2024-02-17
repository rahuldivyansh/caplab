import { useState, useEffect } from "react";

const useDevice = () => {
  const [device, setDevice] = useState(null);
  useEffect(() => {
    if (
      window !== undefined &&
      window.navigator !== undefined &&
      window.navigator.userAgent !== undefined
    ) {
      const currentDevice = {
        isMobile: false,
        userAgent: null,
      };
      const { navigator } = window;
      const { userAgentData, userAgent } = navigator;
      currentDevice.userAgent = userAgent;
      if (userAgentData) {
        const { mobile } = userAgentData;
        currentDevice.isMobile = mobile ? true : false;
      }
      console.log(currentDevice);
      setDevice(currentDevice);
    }
  }, []);
  return device;
};

export default useDevice;
