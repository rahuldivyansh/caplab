import { useState, useEffect } from "react";

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (
      window !== undefined &&
      window.navigator !== undefined &&
      window.navigator.geolocation !== undefined
    ) {
      const currentLocation = {
        latitude: null,
        longitude: null,
      };
      const { navigator } = window;
      const { geolocation } = navigator;
      geolocation.getCurrentPosition((position) => {
        currentLocation.latitude = position.coords.latitude;
        currentLocation.longitude = position.coords.longitude;
        if (currentLocation.latitude && currentLocation.longitude)
          setLocation(currentLocation);
      });
    }
  }, []);
  return location;
};

export default useGeolocation;
