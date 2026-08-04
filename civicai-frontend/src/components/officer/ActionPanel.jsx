import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Stack,
  Chip,
  Alert,
  Avatar,
} from "@mui/material";
import {
  Check,
  Close,
  Build,
  Send,
  Replay,
  TaskAlt,
  Info,
} from "@mui/icons-material";
import RejectDialog from "./RejectDialog";
import ResolveDialog from "./ResolveDialog";

const ActionPanel = ({ complaint, onActionSuccess }) => {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const { status_id, id } = complaint;

  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 1:
        return {
          label: "Pending Review",
          color: "#f59e0b",
          bg: "#fffbeb",
          description: "This complaint is awaiting your review.",
        };
      case 2:
        return {
          label: "Accepted",
          color: "#1976d2",
          bg: "#e3f2fd",
          description: "Complaint accepted. Ready to start work.",
        };
      case 3:
        return {
          label: "In Progress",
          color: "#7e57c2",
          bg: "#f3e5f5",
          description: "Work is currently in progress.",
        };
      case 4:
        return {
          label: "Resolved",
          color: "#2e7d32",
          bg: "#e8f5e9",
          description: "Complaint has been successfully resolved.",
        };
      case 5:
        return {
          label: "Closed",
          color: "#64748b",
          bg: "#f1f5f9",
          description: "This complaint is now closed.",
        };
      case 6:
        return {
          label: "Reopened",
          color: "#d32f2f",
          bg: "#ffebee",
          description: "Complaint reopened. Action required.",
        };
      case 7:
        return {
          label: "Rejected",
          color: "#64748b",
          bg: "#f1f5f9",
          description: "This complaint was rejected.",
        };
      default:
        return {
          label: "Unknown",
          color: "#64748b",
          bg: "#f1f5f9",
          description: "Unknown status.",
        };
    }
  };

  const statusInfo = getStatusInfo(status_id);

  return (
    <>
      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          bgcolor: "#ffffff",
          p: 3,
          mb: 3,
        }}
      >
        {/* Header */}
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: statusInfo.bg,
              color: statusInfo.color,
            }}
          >
            <TaskAlt fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Officer Actions
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              {statusInfo.description}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Current Status Indicator */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 1 }}
          >
            CURRENT STATUS
          </Typography>
          <Chip
            label={statusInfo.label}
            sx={{
              bgcolor: statusInfo.bg,
              color: statusInfo.color,
              fontWeight: 700,
              fontSize: "0.875rem",
              border: `1px solid ${statusInfo.color}30`,
            }}
          />
        </Box>

        {/* Action Buttons Based on Status */}
        {status_id === 1 && (
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 1 }}>
              Review this complaint and take appropriate action:
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Check />}
                onClick={() => onActionSuccess("accept")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                }}
              >
                Accept Complaint
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Close />}
                onClick={() => setRejectOpen(true)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": { bgcolor: "#ffebee", borderColor: "#b71c1c" },
                }}
              >
                Reject Complaint
              </Button>
            </Stack>
          </Stack>
        )}

        {status_id === 2 && (
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 1 }}>
              Begin working on this complaint:
            </Typography>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Build />}
              onClick={() => onActionSuccess("start-work")}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#1565c0" },
              }}
            >
              Start Work
            </Button>
          </Stack>
        )}

        {status_id === 3 && (
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: "#64748B", mb: 1 }}>
              Mark this complaint as resolved once work is complete:
            </Typography>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Send />}
              onClick={() => setResolveOpen(true)}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#2e7d32",
                "&:hover": { bgcolor: "#1b5e20" },
              }}
            >
              Mark as Resolved
            </Button>
          </Stack>
        )}

        {status_id === 6 && (
          <Stack spacing={2}>
            <Alert severity="warning" sx={{ mb: 1, borderRadius: 2 }}>
              This complaint was reopened. Please review and take action.
            </Alert>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Replay />}
                onClick={() => onActionSuccess("restart-work")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": { bgcolor: "#e3f2fd", borderColor: "#1565c0" },
                }}
              >
                Restart Work
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Send />}
                onClick={() => setResolveOpen(true)}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#2e7d32",
                  "&:hover": { bgcolor: "#1b5e20" },
                }}
              >
                Resolve Complaint
              </Button>
            </Stack>
          </Stack>
        )}

        {[4, 5, 7].includes(status_id) && (
          <Box sx={{ textAlign: "center", py: 2 }}>
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
              <Info />
            </Avatar>
            <Typography variant="body1" fontWeight={600} sx={{ color: "#0F172A", mb: 0.5 }}>
              No Further Actions Required
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              This complaint has reached its final status.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Dialogs */}
      <RejectDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        complaintId={id}
        onSuccess={() => {
          setRejectOpen(false);
          onActionSuccess("reject");
        }}
      />
      <ResolveDialog
        open={resolveOpen}
        onClose={() => setResolveOpen(false)}
        complaintId={id}
        onSuccess={() => {
          setResolveOpen(false);

          // फक्त डेटा refresh कर
          onActionSuccess("refresh");
        }}
      />
    </>
  );
};

export default ActionPanel;