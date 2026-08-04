import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import {
  Person,
  Badge,
  Business,
  Verified,
} from "@mui/icons-material";

const OfficerInfoCard = () => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#e3f2fd",
              color: "#1976d2",
            }}
          >
            <Person fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Officer Information
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Assigned department officer
            </Typography>
          </Box>
        </Stack>

        {/* Officer Avatar & Name */}
        <Stack spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: "#1976d2",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Department Officer
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              CivicAI Officer Panel
            </Typography>
          </Box>
          <Chip
            icon={<Verified sx={{ fontSize: 16 }} />}
            label="Verified Officer"
            size="small"
            sx={{
              bgcolor: "#e8f5e9",
              color: "#2e7d32",
              fontWeight: 600,
              border: "1px solid #c8e6c9",
            }}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Officer Details */}
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Badge sx={{ color: "#94a3b8" }} />
            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>
                Role
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#0F172A" }}>
                Department Officer
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Business sx={{ color: "#94a3b8", fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>
                Department
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#0F172A" }}>
                Civic Services
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Verified sx={{ color: "#94a3b8", fontSize: 20 }} />
            <Box>
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>
                Status
              </Typography>
              <Typography variant="body2" fontWeight={600} sx={{ color: "#2e7d32" }}>
                Active & Verified
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OfficerInfoCard;