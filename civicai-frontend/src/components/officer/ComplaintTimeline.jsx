import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  Pending,
  CheckCircle,
  Build,
  Send,
  Lock,
  Timeline,
} from "@mui/icons-material";

const ComplaintTimeline = ({ statusId }) => {
  const steps = [
    {
      label: "Pending",
      description: "Complaint submitted and awaiting review",
      icon: <Pending />,
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Accepted",
      description: "Officer has accepted the complaint",
      icon: <CheckCircle />,
      color: "#1976d2",
      bg: "#e3f2fd",
    },
    {
      label: "In Progress",
      description: "Work is being done to resolve the issue",
      icon: <Build />,
      color: "#7e57c2",
      bg: "#f3e5f5",
    },
    {
      label: "Resolved",
      description: "Issue has been successfully resolved",
      icon: <Send />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
    {
      label: "Closed",
      description: "Complaint closed after citizen confirmation",
      icon: <Lock />,
      color: "#64748b",
      bg: "#f1f5f9",
    },
  ];

  // Map status_id to step index (status_id 1 = step 0, etc.)
  const activeStep = statusId ? statusId - 1 : 0;

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
            <Timeline fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Complaint Progress
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Track the status of this complaint
            </Typography>
          </Box>
        </Stack>

        {/* Current Status Chip */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 1 }}
          >
            CURRENT STATUS
          </Typography>
          <Chip
            label={steps[activeStep]?.label || "Unknown"}
            sx={{
              bgcolor: steps[activeStep]?.bg || "#f1f5f9",
              color: steps[activeStep]?.color || "#64748b",
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          />
        </Box>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          sx={{
            "& .MuiStepConnector-root": {
              minHeight: 40,
            },
            "& .MuiStepConnector-line": {
              borderLeftWidth: 2,
              borderLeftStyle: "solid",
            },
          }}
        >
          {steps.map((step, index) => {
            const isCompleted = index < activeStep;
            const isCurrent = index === activeStep;
            const isPending = index > activeStep;

            return (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: isCompleted
                          ? step.color
                          : isCurrent
                          ? step.color
                          : "#e2e8f0",
                        color: isCompleted || isCurrent ? "white" : "#94a3b8",
                        boxShadow: isCurrent ? `0 4px 12px ${step.color}40` : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isCompleted ? <CheckCircle sx={{ fontSize: 20 }} /> : step.icon}
                    </Avatar>
                  )}
                  sx={{
                    "& .MuiStepLabel-label": {
                      fontWeight: isCurrent ? 700 : 500,
                      color: isPending ? "#94a3b8" : "#0F172A",
                      fontSize: "0.95rem",
                    },
                  }}
                >
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isPending ? "#cbd5e1" : "#64748B",
                      ml: 1,
                      pl: 2,
                      borderLeft: `2px solid ${isCompleted || isCurrent ? step.color : "#e2e8f0"}`,
                      py: 0.5,
                    }}
                  >
                    {step.description}
                  </Typography>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>

        {/* Helper text */}
        <Typography
          variant="caption"
          sx={{
            color: "#94a3b8",
            mt: 2,
            display: "block",
            textAlign: "center",
          }}
        >
          {activeStep === steps.length - 1
            ? "This complaint has been completed"
            : "Complaint is currently being processed"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ComplaintTimeline;