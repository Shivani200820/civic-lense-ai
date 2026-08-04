import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const MapComponent = ({ complaints, height = '400px' }) => {
  // Default center (Pune, India) if no complaints
  const center = complaints.length > 0 ? [complaints[0].latitude, complaints[0].longitude] : [18.5204, 73.8567];

  return (
    <MapContainer center={center} zoom={13} style={{ height, width: '100%', borderRadius: '8px', zIndex: 1 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
      {complaints.map((c) => (
        <Marker key={c.id} position={[c.latitude, c.longitude]}>
          <Popup>
            <strong>{c.title}</strong><br />
            Status: {c.status_id}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;