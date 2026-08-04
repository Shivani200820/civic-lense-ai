import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import {
  PhotoLibrary,
  Close,
  ZoomIn,
  Image as ImageIcon,
  CheckCircle,
} from "@mui/icons-material";

const ComplaintImageGallery = ({ complaintImage, resolutionImage }) => {
  const [openImage, setOpenImage] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("uploads")) {
      return `http://127.0.0.1:8000/${url.replaceAll("\\", "/")}`;
    }
    return url;
  };

  const complaintImageUrl = getImageUrl(complaintImage);
  const resolutionImageUrl = getImageUrl(resolutionImage);

  if (!complaintImageUrl && !resolutionImageUrl) return null;

  return (
    <>
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
              <PhotoLibrary fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                Image Gallery
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>
                View complaint and resolution evidence
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={3}>
            {/* Complaint Image */}
            {complaintImageUrl && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                    },
                  }}
                  onClick={() => setOpenImage({ url: complaintImageUrl, label: "Complaint Image" })}
                >
                  <Box
                    component="img"
                    src={complaintImageUrl}
                    alt="Complaint Evidence"
                    sx={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      display: "block",
                      bgcolor: "#f1f5f9",
                    }}
                  />
                  {/* Overlay on hover */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <ZoomIn
                      sx={{
                        color: "white",
                        fontSize: 32,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  </Box>
                  {/* Label */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      icon={<ImageIcon sx={{ fontSize: 16 }} />}
                      label="Complaint"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.95)",
                        color: "#1976d2",
                        fontWeight: 600,
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Resolution Image */}
            {resolutionImageUrl && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #bbf7d0",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#2e7d32",
                      boxShadow: "0 8px 20px rgba(46,125,50,0.15)",
                    },
                  }}
                  onClick={() =>
                    setOpenImage({ url: resolutionImageUrl, label: "Resolution Image" })
                  }
                >
                  <Box
                    component="img"
                    src={resolutionImageUrl}
                    alt="Resolution Evidence"
                    sx={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                      display: "block",
                      bgcolor: "#f0fdf4",
                    }}
                  />
                  {/* Overlay on hover */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: "rgba(0,0,0,0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <ZoomIn
                      sx={{
                        color: "white",
                        fontSize: 32,
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  </Box>
                  {/* Label */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      label="Resolution"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.95)",
                        color: "#2e7d32",
                        fontWeight: 600,
                        backdropFilter: "blur(8px)",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

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
            Click on any image to view in full size
          </Typography>
        </CardContent>
      </Card>

      {/* Lightbox Dialog */}
      <Dialog
        open={Boolean(openImage)}
        onClose={() => setOpenImage(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box sx={{ position: "relative" }}>
          {/* Close Button */}
          <IconButton
            onClick={() => setOpenImage(null)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              bgcolor: "rgba(255,255,255,0.9)",
              color: "#0F172A",
              zIndex: 10,
              "&:hover": { bgcolor: "white" },
            }}
          >
            <Close />
          </IconButton>

          {/* Image Label */}
          <Box
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              zIndex: 10,
            }}
          >
            <Chip
              label={openImage?.label}
              sx={{
                bgcolor: "rgba(255,255,255,0.95)",
                fontWeight: 600,
                backdropFilter: "blur(8px)",
              }}
            />
          </Box>

          <DialogContent sx={{ p: 0 }}>
            {openImage && (
              <Box
                component="img"
                src={openImage.url}
                alt={openImage.label}
                sx={{
                  width: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  bgcolor: "#0F172A",
                  display: "block",
                }}
              />
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default ComplaintImageGallery;