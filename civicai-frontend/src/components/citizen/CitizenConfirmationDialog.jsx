import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Rating,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Avatar,
  Alert,
} from "@mui/material";
import {
  CheckCircle,
  RestartAlt,
  Send,
  Star,
  RateReview,
} from "@mui/icons-material";

const CitizenConfirmationDialog = ({ open, onClose, onSubmit }) => {
  const [decision, setDecision] = useState("close");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

     const handleSubmit = () => {
    // OpenAPI CitizenConfirmationRequest नुसार strict payload
    const payload = {
      decision: decision.trim(), // "close" or "reopen"
      rating: null,
      feedback: null,
    };

    // Rating फक्त 1 ते 5 च्या दरम्यानच पाठवायचा आहे
    if (decision === "close" && rating >= 1 && rating <= 5) {
      payload.rating = rating;
    }

    // Feedback 500 characters पेक्षा कमी असायला हवा
    if (feedback.trim().length > 0 && feedback.trim().length <= 500) {
      payload.feedback = feedback.trim();
    }

    console.log("Sending Confirm Payload:", payload); // Console मध्ये बघा
    onSubmit(payload);
    handleClose();
  };

  const handleClose = () => {
    setDecision("close");
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#f0fdf4",
          borderBottom: "1px solid #bbf7d0",
          p: 3,
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#dcfce7",
              color: "#16a34a",
            }}
          >
            <RateReview fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#166534", lineHeight: 1.2 }}
            >
              Resolution Review
            </Typography>
            <Typography variant="body2" sx={{ color: "#15803d" }}>
              Please review the officer's work and share your feedback.
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
            The officer has marked this complaint as resolved. Your feedback helps us maintain service quality.
          </Typography>
        </Alert>

        {/* Decision Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#0F172A", mb: 1.5 }}>
            What is your decision?
          </Typography>
          <ToggleButtonGroup
            value={decision}
            exclusive
            onChange={(e, val) => val && setDecision(val)}
            fullWidth
            sx={{
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              "& .MuiToggleButton-root": {
                flex: 1,
                border: "2px solid #e2e8f0",
                borderRadius: 2,
                py: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#64748B",
                transition: "all 0.2s ease",
                "&.Mui-selected": {
                  bgcolor: "transparent",
                },
                "&:hover": {
                  bgcolor: "#f8fafc",
                },
              },
            }}
          >
            <ToggleButton
              value="close"
              sx={{
                ...(decision === "close" && {
                  borderColor: "#16a34a",
                  bgcolor: "#f0fdf4",
                  color: "#16a34a",
                  "&:hover": { bgcolor: "#dcfce7" },
                }),
              }}
            >
              <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
              Satisfied (Close)
            </ToggleButton>
            <ToggleButton
              value="reopen"
              sx={{
                ...(decision === "reopen" && {
                  borderColor: "#dc2626",
                  bgcolor: "#fef2f2",
                  color: "#dc2626",
                  "&:hover": { bgcolor: "#fee2e2" },
                }),
              }}
            >
              <RestartAlt sx={{ mr: 1, fontSize: 20 }} />
              Not Fixed (Reopen)
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Rating Section (Only for Close) */}
        {decision === "close" && (
          <Box
            sx={{
              mb: 3,
              p: 2.5,
              bgcolor: "#fffbeb",
              borderRadius: 2,
              border: "1px solid #fde68a",
              textAlign: "center",
            }}
          >
            <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#92400e", mb: 1 }}>
              Rate the resolution
            </Typography>
            <Rating
              value={rating}
              onChange={(e, val) => setRating(val)}
              size="large"
              icon={<Star fontSize="inherit" sx={{ color: "#f59e0b" }} />}
              emptyIcon={<Star fontSize="inherit" sx={{ color: "#fcd34d" }} />}
            />
            <Typography variant="caption" sx={{ color: "#a16207", display: "block", mt: 0.5 }}>
              {rating > 0 ? `${rating} out of 5 stars` : "Tap to rate"}
            </Typography>
          </Box>
        )}

        {/* Feedback Section */}
        <TextField
          fullWidth
          multiline
          rows={4}
          label={decision === "reopen" ? "Reason for Reopening (Required)" : "Your Feedback (Optional)"}
          placeholder={
            decision === "reopen"
              ? "Please explain why the issue is not yet resolved..."
              : "Share your experience or any additional comments..."
          }
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          error={decision === "reopen" && feedback.trim().length === 0}
          helperText={
            decision === "reopen" && feedback.trim().length === 0
              ? "Please provide a reason to reopen this complaint."
              : ""
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": { borderColor: "#e2e8f0" },
              "&:hover fieldset": {
                borderColor: decision === "reopen" && !feedback ? "#dc2626" : "#1976d2",
              },
              "&.Mui-focused fieldset": {
                borderColor: decision === "reopen" && !feedback ? "#dc2626" : "#1976d2",
              },
            },
            "& .MuiFormHelperText-root": {
              color: "#dc2626",
              ml: 0,
              fontWeight: 500,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            color: "#64748B",
            "&:hover": { bgcolor: "#f1f5f9" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={decision === "close" ? <CheckCircle /> : <RestartAlt />}
          disabled={decision === "reopen" && feedback.trim().length === 0}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            bgcolor: decision === "close" ? "#16a34a" : "#dc2626",
            boxShadow:
              decision === "close"
                ? "0 4px 12px rgba(22, 163, 74, 0.2)"
                : "0 4px 12px rgba(220, 38, 38, 0.2)",
            "&:hover": {
              bgcolor: decision === "close" ? "#15803d" : "#b91c1c",
            },
            "&.Mui-disabled": {
              bgcolor: "#94a3b8",
              boxShadow: "none",
            },
          }}
        >
          Submit {decision === "close" ? "Confirmation" : "Reopen Request"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CitizenConfirmationDialog;