import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.75rem'
};

const center = {
  lat: 5.4295609,
  lng: -4.0712912
};

const GoogleMapComponent: React.FC = () => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        options={{
          styles: [
            {
              featureType: 'all',
              elementType: 'all',
              stylers: [{ hue: '#000000' }, { saturation: -100 }, { lightness: -50 }]
            }
          ]
        }}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;