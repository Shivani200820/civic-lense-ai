import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  Avatar,
  Alert,
} from "@mui/material";
import {
  WarningAmber,
  ThumbUp,
  Add,
  Info,
} from "@mui/icons-material";

const DuplicateCheckDialog = ({ open, existingComplaintId, onSupport, onCreateNew, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: "1px solid #e0e0e0",
          overflow: "hidden",
        },
      }}
    >
      {/* Header with Warning Accent */}
      <Box
        sx={{
          bgcolor: "#fffbeb",
          borderBottom: "1px solid #fde68a",
          p: 3,
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#fef3c7",
              color: "#d97706",
            }}
          >
            <WarningAmber fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#92400e", lineHeight: 1.2 }}
            >
              Similar Complaint Found
            </Typography>
            <Typography variant="body2" sx={{ color: "#a16207" }}>
              Our system detected a potential duplicate in your area.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3, pt: 2 }}>
        {/* Info Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 2,
            border: "1px solid #bae6fd",
            bgcolor: "#f0f9ff",
            "& .MuiAlert-icon": { color: "#0284c7" },
          }}
        >
          <Typography variant="body2" sx={{ color: "#0369a1" }}>
            Supporting an existing complaint helps authorities prioritize it faster, reducing duplicate efforts.
          </Typography>
        </Alert>

        {/* Existing Complaint ID Display */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 1.5 }}>
            Existing Complaint Reference:
          </Typography>
          <Chip
            label={`#${existingComplaintId}`}
            icon={<Info sx={{ fontSize: 16 }} />}
            sx={{
              bgcolor: "#e3f2fd",
              color: "#1976d2",
              fontWeight: 700,
              fontSize: "1rem",
              border: "1px solid #bbdefb",
              height: 40,
              px: 1,
              "& .MuiChip-icon": {
                color: "#1976d2",
              },
            }}
          />
        </Box>

        {/* Decision Prompt */}
        <Typography
          variant="body1"
          sx={{
            color: "#0F172A",
            textAlign: "center",
            fontWeight: 500,
            mb: 1,
          }}
        >
          Would you like to support this existing complaint or create a new one?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1.5, justifyContent: "center" }}>
        <Button
          onClick={onCreateNew}
          startIcon={<Add />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            color: "#64748B",
            border: "1px solid #e2e8f0",
            "&:hover": {
              bgcolor: "#f8fafc",
              borderColor: "#cbd5e1",
            },
          }}
        >
          Create New Anyway
        </Button>
        <Button
          onClick={() => onSupport(existingComplaintId)}
          variant="contained"
          startIcon={<ThumbUp />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
            bgcolor: "#1976d2",
            boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
            "&:hover": {
              bgcolor: "#1565c0",
              boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
            },
          }}
        >
          Support Existing
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DuplicateCheckDialog;