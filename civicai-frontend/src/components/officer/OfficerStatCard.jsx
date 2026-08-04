import React from "react";
import { Card, CardContent, Typography, Box, Stack } from "@mui/material";

const OfficerStatCard = ({ title, value, icon, color, bgColor }) => {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
          borderColor: color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontWeight: 600,
                mb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.75rem",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: "#0F172A",
                lineHeight: 1,
                fontSize: "2.5rem",
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: color,
              flexShrink: 0,
              transition: "all 0.3s ease",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OfficerStatCard;