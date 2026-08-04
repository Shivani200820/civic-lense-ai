import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  Divider,
  Box,
  Avatar,
} from "@mui/material";
import {
  PendingActions,
  Build,
  CheckCircle,
  ListAlt,
  Bolt,
} from "@mui/icons-material";

const OfficerQuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e0e0e0",
        bgcolor: "#ffffff",
        height: "100%",
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
            <Bolt fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Quick Actions
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Navigate to specific complaint queues
            </Typography>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Stack spacing={2}>
          
          {/* Pending - Orange Theme */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PendingActions />}
            onClick={() => navigate("/officer/complaints?status=1")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#fed7aa",
              color: "#ed6c02",
              bgcolor: "#fff7ed",
              "&:hover": {
                bgcolor: "#ffedd5",
                borderColor: "#ed6c02",
              },
            }}
          >
            Pending Complaints
          </Button>

          {/* In Progress - Purple Theme */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Build />}
            onClick={() => navigate("/officer/complaints?status=3")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#e9d5ff",
              color: "#7e57c2",
              bgcolor: "#faf5ff",
              "&:hover": {
                bgcolor: "#f3e8ff",
                borderColor: "#7e57c2",
              },
            }}
          >
            In Progress
          </Button>

          {/* Resolved - Green Theme */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CheckCircle />}
            onClick={() => navigate("/officer/complaints?status=4")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#bbf7d0",
              color: "#2e7d32",
              bgcolor: "#f0fdf4",
              "&:hover": {
                bgcolor: "#dcfce7",
                borderColor: "#2e7d32",
              },
            }}
          >
            Resolved Complaints
          </Button>

          <Divider sx={{ my: 1 }} />

          {/* View All - Primary Blue Filled */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<ListAlt />}
            onClick={() => navigate("/officer/complaints")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#1976d2",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
              "&:hover": {
                bgcolor: "#1565c0",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
              },
            }}
          >
            View All Complaints
          </Button>

        </Stack>
      </CardContent>
    </Card>
  );
};

export default OfficerQuickActions;