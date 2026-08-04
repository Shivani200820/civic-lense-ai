import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Close,
  WarningAmber,
  Send,
} from "@mui/icons-material";
import { rejectSchema } from "../../utils/validationSchemas";
import { officerService } from "../../services/api/officerService";
import { useDispatch } from "react-redux";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";

const RejectDialog = ({ open, onClose, complaintId, onSuccess }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rejectSchema),
    defaultValues: { reason: "" },
  });

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    try {
      await officerService.rejectComplaint(complaintId, data.reason);
      dispatch(
        showSnackbar({
          message: "Complaint rejected successfully",
          severity: "success",
        })
      );
      reset();
      onSuccess();
    } catch (e) {
      dispatch(
        showSnackbar({
          message: e.response?.data?.message || "Failed to reject complaint",
          severity: "error",
        })
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClose = () => {
    reset();
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
      {/* Header with Red Accent */}
      <Box
        sx={{
          bgcolor: "#fef2f2",
          borderBottom: "1px solid #fecaca",
          p: 3,
          pb: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#fee2e2",
              color: "#dc2626",
            }}
          >
            <WarningAmber fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#991b1b", lineHeight: 1.2 }}
            >
              Reject Complaint
            </Typography>
            <Typography variant="body2" sx={{ color: "#b91c1c" }}>
              Please provide a valid reason for rejection
            </Typography>
          </Box>
        </Stack>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ p: 3, pt: 2 }}>
          {/* Warning Alert */}
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 2,
              border: "1px solid #fde68a",
              bgcolor: "#fffbeb",
              "& .MuiAlert-icon": { color: "#d97706" },
            }}
          >
            <Typography variant="body2" sx={{ color: "#92400e" }}>
              This action cannot be undone. The citizen will be notified about the rejection.
            </Typography>
          </Alert>

          {/* Reason Field */}
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Reason for Rejection"
            placeholder="Please explain why this complaint is being rejected (minimum 10 characters)..."
            {...register("reason")}
            error={!!errors.reason}
            helperText={errors.reason?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "#e2e8f0",
                },
                "&:hover fieldset": {
                  borderColor: errors.reason ? "#dc2626" : "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.reason ? "#dc2626" : "#1976d2",
                },
                "&.Mui-error fieldset": {
                  borderColor: "#dc2626",
                },
              },
              "& .MuiFormHelperText-root": {
                color: errors.reason ? "#dc2626" : "#64748B",
                ml: 0,
              },
            }}
          />

          {/* Character hint */}
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              mt: 1,
              display: "block",
            }}
          >
            Minimum 10 characters required
          </Typography>
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
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Send />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              bgcolor: "#dc2626",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.2)",
              "&:hover": {
                bgcolor: "#b91c1c",
                boxShadow: "0 6px 16px rgba(220, 38, 38, 0.3)",
              },
            }}
          >
            Submit Rejection
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RejectDialog;