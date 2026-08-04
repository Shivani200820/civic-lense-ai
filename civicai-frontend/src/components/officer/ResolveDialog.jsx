import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  LinearProgress,
  Stack,
  Avatar,
  Alert,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  CloudUpload,
  Send,
  Delete,
  Info,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { resolveSchema } from "../../utils/validationSchemas";
import { officerService } from "../../services/api/officerService";
import { complaintService } from "../../services/api/complaintService";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";

const ResolveDialog = ({ open, onClose, complaintId, onSuccess }) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resolveSchema),
    defaultValues: { resolution_remarks: "" },
  });

  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");

  // Upload Image
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);
      const res = await complaintService.uploadImage(file);
      setImageUrl(res.image_url || res.url || res.image);
    } catch (err) {
      console.error("Upload failed:", err);
      dispatch(
        showSnackbar({
          message: "Image upload failed. Please try again.",
          severity: "error",
        })
      );
      setPreview(""); // Clear preview on error
    } finally {
      setUploading(false);
    }
  };

  // Resolve Complaint
 const onSubmit = async (data) => {
  dispatch(setLoading(true));

  try {
    const payload = {
      resolution_remarks: data.resolution_remarks,
      resolution_image_url: imageUrl || null,
    };

    await officerService.resolveComplaint(
      complaintId,
      payload
    );

    dispatch(
      showSnackbar({
        message: "Complaint resolved successfully",
        severity: "success",
      })
    );

    reset();
    setPreview("");
    setImageUrl("");

    onClose();

    if (onSuccess) {
      onSuccess();
    }

  } catch (err) {

    dispatch(
      showSnackbar({
        message:
          err.response?.data?.detail ||
          "Unable to resolve complaint.",
        severity: "error",
      })
    );

  } finally {
    dispatch(setLoading(false));
  }
};

  const handleClose = () => {
    reset();
    setPreview("");
    setImageUrl("");
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
      {/* Header with Green Accent */}
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
            <CheckCircle fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ color: "#166534", lineHeight: 1.2 }}
            >
              Resolve Complaint
            </Typography>
            <Typography variant="body2" sx={{ color: "#15803d" }}>
              Provide details and proof of work to close this issue.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
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
              Resolving this complaint will automatically update its status, notify the citizen, and move it to "Resolved".
            </Typography>
          </Alert>

          {/* Remarks Field */}
          <TextField
            fullWidth
            multiline
            rows={5}
            label="Resolution Remarks"
            placeholder="Describe the actions taken to resolve this issue..."
            {...register("resolution_remarks")}
            error={!!errors.resolution_remarks}
            helperText={errors.resolution_remarks?.message}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": { borderColor: "#e2e8f0" },
                "&:hover fieldset": {
                  borderColor: errors.resolution_remarks ? "#dc2626" : "#1976d2",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.resolution_remarks ? "#dc2626" : "#1976d2",
                },
              },
              "& .MuiFormHelperText-root": {
                color: errors.resolution_remarks ? "#dc2626" : "#64748B",
                ml: 0,
              },
            }}
          />

          {/* Upload Section */}
          <Typography variant="subtitle2" fontWeight={600} sx={{ color: "#0F172A", mb: 1.5 }}>
            Upload Resolution Proof (Optional)
          </Typography>

          <input
            hidden
            id="resolve-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />

          <Box
            sx={{
              border: `2px dashed ${errors.resolution_remarks ? "#fecaca" : "#bbf7d0"}`,
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              bgcolor: "#f8fafc",
              transition: "all 0.2s ease",
              position: "relative",
            }}
          >
            {uploading ? (
              <Stack spacing={2} alignItems="center">
                <LinearProgress 
                  sx={{ 
                    width: "100%", 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: "#dcfce7",
                    "& .MuiLinearProgress-bar": { bgcolor: "#16a34a" }
                  }} 
                />
                <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600 }}>
                  Uploading image...
                </Typography>
              </Stack>
            ) : preview ? (
              <Box sx={{ position: "relative" }}>
                <Box
                  component="img"
                  src={preview}
                  alt="Resolution Preview"
                  sx={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => {
                    setPreview("");
                    setImageUrl("");
                  }}
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Remove Image
                </Button>
              </Box>
            ) : (
              <Stack spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#dcfce7",
                    color: "#16a34a",
                  }}
                >
                  <CloudUpload fontSize="large" />
                </Avatar>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Drag and drop an image here, or click to browse
                </Typography>
                <Button
                  component="label"
                  htmlFor="resolve-upload"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: "#16a34a",
                    color: "#16a34a",
                    "&:hover": {
                      bgcolor: "#dcfce7",
                      borderColor: "#15803d",
                    },
                  }}
                >
                  Select Image
                </Button>
              </Stack>
            )}
          </Box>
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
            type="submit"
            variant="contained"
            startIcon={<Send />}
            disabled={uploading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              bgcolor: "#16a34a",
              boxShadow: "0 4px 12px rgba(22, 163, 74, 0.2)",
              "&:hover": {
                bgcolor: "#15803d",
                boxShadow: "0 6px 16px rgba(22, 163, 74, 0.3)",
              },
              "&.Mui-disabled": {
                bgcolor: "#94a3b8",
                boxShadow: "none",
              },
            }}
          >
            {uploading ? "Uploading..." : "Submit Resolution"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ResolveDialog;