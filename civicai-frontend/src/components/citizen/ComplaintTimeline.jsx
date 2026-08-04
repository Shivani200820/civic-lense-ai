import React from "react";
import {
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Pending,
  Build,
  Send,
  Lock,
  Timeline,
  Person,
} from "@mui/icons-material";
import { getStatusConfig } from "../../utils/statusMapper";

const ComplaintTimeline = ({ events = [] }) => {
  // Fallback config in case getStatusConfig doesn't return expected format
  const getSafeConfig = (statusId) => {
    const config = getStatusConfig(statusId) || {};
    return {
      label: config.label || "Unknown",
      // Fallback to hex colors to ensure inline sx works perfectly
      color: config.color || "#64748b", 
      bgColor: config.bgColor || "#f1f5f9",
      icon: config.icon || <Pending fontSize="small" />,
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!events || events.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "#f1f5f9",
            color: "#94a3b8",
            mx: "auto",
            mb: 2,
          }}
        >
          <Timeline sx={{ fontSize: 28 }} />
        </Avatar>
        <Typography variant="body1" fontWeight={600} sx={{ color: "#0F172A" }}>
          No timeline available
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
          Status updates will appear here as the complaint progresses.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", pl: 1 }}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        const config = getSafeConfig(event.new_status_id);

        return (
          <Box
            key={event.id || index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              position: "relative",
              pb: isLast ? 0 : 4,
            }}
          >
            {/* LEFT SIDE: Icon Dot & Vertical Line */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 40,
                flexShrink: 0,
                position: "relative",
              }}
            >
              {/* Dot */}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: config.bgColor,
                  color: config.color,
                  border: "3px solid #ffffff", // White border to separate from line
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  zIndex: 2,
                }}
              >
                {event.new_status_id === 5 ? <CheckCircle fontSize="small" /> : config.icon}
              </Avatar>

              {/* Vertical Line (Only if not the last item) */}
              {!isLast && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 36, // Starts exactly below the 36px height avatar
                    bottom: 0, // Stretches to the bottom of the container
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 2,
                    bgcolor: "#e2e8f0",
                    zIndex: 1,
                  }}
                />
              )}
            </Box>

            {/* RIGHT SIDE: Content Card */}
            <Box sx={{ flex: 1, ml: 2, width: "calc(100% - 56px)" }}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#ffffff",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: config.color,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                  },
                }}
              >
                {/* Header: Status Label & Date */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={2}
                  sx={{ mb: 1.5 }}
                >
                  <Chip
                    label={config.label}
                    size="small"
                    sx={{
                      bgcolor: config.bgColor,
                      color: config.color,
                      fontWeight: 700,
                      fontSize: "0.8rem",
                      border: `1px solid ${config.color}30`, // 30 is hex opacity
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#94a3b8",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    {formatDate(event.created_at)}
                  </Typography>
                </Stack>

                {/* Remarks */}
                {event.remarks && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#475569",
                      lineHeight: 1.7,
                      mb: 1.5,
                      whiteSpace: "pre-line", // Preserves line breaks in remarks
                    }}
                  >
                    {event.remarks}
                  </Typography>
                )}

                {/* Footer: Changed By */}
                {event.changed_by && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      pt: 1.5,
                      borderTop: "1px solid #f1f5f9",
                      mt: 1,
                    }}
                  >
                    <Person sx={{ fontSize: 16, color: "#94a3b8" }} />
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748B", fontWeight: 500 }}
                    >
                      Updated by: <strong style={{ color: "#0F172A" }}>User ID {event.changed_by}</strong>
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ComplaintTimeline;