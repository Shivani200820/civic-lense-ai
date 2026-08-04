import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  Box,
  Typography,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import { LocationOn, CalendarToday } from "@mui/icons-material";

// Fix for default marker icons in Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper: Status Config (Matching your app's theme)
const getStatusConfig = (statusId) => {
  switch (statusId) {
    case 1: return { label: "Pending", color: "warning" };
    case 2: return { label: "Accepted", color: "info" };
    case 3: return { label: "In Progress", color: "primary" };
    case 4:
    case 5: return { label: "Resolved", color: "success" };
    default: return { label: "Unknown", color: "default" };
  }
};

// Helper: Format Date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Component to auto-fit map bounds when multiple markers exist
const FitBounds = ({ complaints }) => {
  const map = useMap();

  useEffect(() => {
    if (complaints && complaints.length > 1) {
      const bounds = L.latLngBounds(
        complaints.map((c) => [c.latitude, c.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [complaints, map]);

  return null;
};

const MapComponent = ({ complaints = [], height = "400px" }) => {
  // Filter out complaints with invalid coordinates
  const validComplaints = complaints.filter(
    (c) => c.latitude && c.longitude && !isNaN(c.latitude) && !isNaN(c.longitude)
  );

  // Default center (Pune, India) if no valid complaints
  const center =
    validComplaints.length > 0
      ? [validComplaints[0].latitude, validComplaints[0].longitude]
      : [18.5204, 73.8567];

  return (
    <Box
      sx={{
        width: "100%",
        height: height,
        borderRadius: 3, // Matches app's borderRadius: 3 (12px)
        overflow: "hidden",
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
        position: "relative",
        zIndex: 1, // Ensures map controls don't overlap other UI
      }}
    >
      <MapContainer
        center={center}
        zoom={validComplaints.length > 1 ? 12 : 14}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        {/* Auto-fit bounds if multiple complaints */}
        <FitBounds complaints={validComplaints} />

        {/* Clean, modern Tile Layer (OpenStreetMap) */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {validComplaints.map((c) => {
          const status = getStatusConfig(c.status_id);
          return (
            <Marker key={c.id} position={[c.latitude, c.longitude]}>
              <Popup
                closeButton={true}
                maxWidth={320}
                className="custom-popup"
              >
                {/* Premium Popup Content using MUI Components */}
                <Box sx={{ p: 0.5 }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    sx={{ color: "#0F172A", mb: 1, lineHeight: 1.3 }}
                  >
                    {c.title}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip
                      label={status.label}
                      size="small"
                      color={status.color}
                      sx={{ fontWeight: 600, fontSize: "0.7rem", height: 24 }}
                    />
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <CalendarToday sx={{ fontSize: 14, color: "#94a3b8" }} />
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        {formatDate(c.created_at)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                      }}
                    >
                      <LocationOn sx={{ fontSize: 14 }} />
                    </Avatar>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748B",
                        fontFamily: "monospace",
                        fontWeight: 500,
                      }}
                    >
                      {c.latitude.toFixed(4)}, {c.longitude.toFixed(4)}
                    </Typography>
                  </Stack>
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Empty State Overlay (Optional: if you want to show a message when no complaints exist) */}
      {validComplaints.length === 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            px: 2,
            py: 1,
            borderRadius: 2,
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            zIndex: 1000,
          }}
        >
          <Typography variant="body2" fontWeight={600} sx={{ color: "#64748B" }}>
            No complaints with valid locations in this view.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapComponent;