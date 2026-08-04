import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack,
  Box,
} from "@mui/material";
import {
  LocationOn,
  CalendarToday,
  Visibility,
} from "@mui/icons-material";
import StatusBadge from "../common/StatusBadge";

const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();

  const priorityColor = {
    1: "success",
    2: "warning",
    3: "error",
  };

  const priorityText = {
    1: "Low",
    2: "Medium",
    3: "High",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("uploads")) {
      return `http://127.0.0.1:8000/${url.replaceAll("\\", "/")}`;
    }
    return url;
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "#1976d2",
          boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
          transform: "translateY(-4px)",
        },
      }}
    >
      {/* Image - Fixed Height */}
      {getImageUrl(complaint.image_url) && (
        <Box
          component="img"
          src={getImageUrl(complaint.image_url)}
          alt={complaint.title || "Complaint"}
          sx={{
            width: "100%",
            height: 180,
            objectFit: "cover",
            bgcolor: "#f1f5f9",
          }}
        />
      )}

      <CardContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        {/* Complaint Number */}
        <Typography
          variant="caption"
          sx={{
            color: "#1976d2",
            fontWeight: 600,
            fontFamily: "monospace",
            mb: 0.5,
          }}
        >
          {complaint.complaint_number || `CMP-${complaint.id}`}
        </Typography>

        {/* Title - Fixed 2 lines */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "#0F172A",
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.3,
            minHeight: 52,
            maxHeight: 52,
          }}
        >
          {complaint.title || "Untitled Complaint"}
        </Typography>

        {/* Priority & Status Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={priorityText[complaint.priority_id] || "Unknown"}
            size="small"
            color={priorityColor[complaint.priority_id] || "default"}
            sx={{ fontWeight: 600 }}
          />
          <StatusBadge statusId={complaint.status_id} />
        </Stack>

        {/* Date & Location */}
        <Stack spacing={1.5} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarToday fontSize="small" sx={{ color: "#94a3b8" }} />
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {formatDate(complaint.created_at)}
            </Typography>
          </Stack>

          {complaint.latitude && complaint.longitude && (
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOn fontSize="small" sx={{ color: "#94a3b8" }} />
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                GPS Location Available
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* View Details Button - Always at bottom */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<Visibility />}
          onClick={() => navigate(`/officer/complaints/${complaint.id}`)}
          sx={{
            mt: "auto",
            height: 44,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#1e3a5f",
            "&:hover": {
              bgcolor: "#1565c0",
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;