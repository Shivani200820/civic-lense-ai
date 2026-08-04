import React from "react";
import { Card, CardContent, Typography, Box, Stack, Chip } from "@mui/material";
import { Today, AccessTime, Dashboard } from "@mui/icons-material";

const OfficerWelcome = () => {
  const hour = new Date().getHours();

  let greeting = "Good Evening";
  let accentColor = "#7e57c2";
  let accentBg = "#f3e5f5";

  if (hour < 12) {
    greeting = "Good Morning";
    accentColor = "#f59e0b";
    accentBg = "#fffbeb";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
    accentColor = "#1976d2";
    accentBg = "#e3f2fd";
  }

  const currentTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Left Accent Border */}
      <Box
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: accentColor,
        }}
      />

      <CardContent sx={{ p: { xs: 3, md: 4 }, pl: { xs: 3, md: 5 } }}>
        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={3} 
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          
          {/* Left Side: Greeting Text */}
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="h4" 
              fontWeight={800} 
              sx={{ 
                color: "#0F172A", 
                lineHeight: 1.2,
                mb: 1,
              }}
            >
              {greeting}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#64748B",
                maxWidth: "500px",
              }}
            >
              Welcome back, Officer! Manage and resolve civic complaints efficiently today.
            </Typography>
          </Box>

          {/* Right Side: Date & Time Chips */}
          <Stack spacing={1.5} sx={{ minWidth: { md: 240 } }}>
            <Chip
              icon={<Today sx={{ fontSize: 16 }} />}
              label={currentDate}
              sx={{
                bgcolor: "#f8fafc",
                border: "1px solid #e2e8f0",
                fontWeight: 600,
                color: "#475569",
                height: 44,
                fontSize: "0.875rem",
                "& .MuiChip-icon": { color: "#64748B" },
              }}
            />
            <Chip
              icon={<AccessTime sx={{ fontSize: 16 }} />}
              label={currentTime}
              sx={{
                bgcolor: accentBg,
                border: `1px solid ${accentColor}30`,
                fontWeight: 700,
                color: accentColor,
                height: 44,
                fontSize: "0.875rem",
                "& .MuiChip-icon": { color: accentColor },
              }}
            />
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
};

export default OfficerWelcome;