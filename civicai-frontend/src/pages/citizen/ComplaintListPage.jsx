import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Container,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Visibility,
  CalendarMonth,
  Business,
  AutoAwesome,
  Add,
  Inbox,
} from "@mui/icons-material";
import { complaintService } from "../../services/api/complaintService";
import { setMyComplaints } from "../../store/redux/slices/complaintsSlice";
import { setLoading } from "../../store/redux/slices/uiSlice";

const ComplaintListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myComplaints = [] } = useSelector((state) => state.complaints);

  useEffect(() => {
    const loadComplaints = async () => {
      dispatch(setLoading(true));
      try {
        const data = await complaintService.getMyComplaints();
        dispatch(setMyComplaints(data));
      } catch (error) {
        console.error("Failed to load complaints:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    loadComplaints();
  }, [dispatch]);

  const statusConfig = (status) => {
    switch (status) {
      case 1: return { text: "Pending", color: "warning" };
      case 2: return { text: "Accepted", color: "info" };
      case 3: return { text: "In Progress", color: "primary" };
      case 4:
      case 5: return { text: "Resolved", color: "success" };
      default: return { text: "Unknown", color: "default" };
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("uploads")) {
      return `http://127.0.0.1:8000/${url.replaceAll("\\", "/")}`;
    }
    return url;
  };

  const getConfidence = (value) => {
    if (!value) return "N/A";
    return `${(value * 100).toFixed(0)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* ================= Header ================= */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#0F172A", mb: 1 }}>
              My Complaints
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748B" }}>
              Manage, monitor, and track all your submitted civic complaints.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/citizen/new")}
            sx={{
              height: 48,
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#1976d2",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                bgcolor: "#1565c0",
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            New Complaint
          </Button>
        </Box>

        {/* ================= Complaint Grid ================= */}
        {myComplaints.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              textAlign: "center",
              py: 8,
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#f1f5f9",
                  color: "#94a3b8",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <Inbox sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 1 }}>
                No complaints found
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748B", mb: 3, maxWidth: 400, mx: "auto" }}>
                You haven't submitted any complaints yet. Start by creating your first civic request.
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/citizen/new")}
                sx={{
                  height: 48,
                  px: 4,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#1976d2",
                }}
              >
                Create First Complaint
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {myComplaints.map((complaint) => {
              const status = statusConfig(complaint.status_id);
              return (
                <Grid item xs={12} sm={6} lg={4} key={complaint.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid #e0e0e0",
                      bgcolor: "#ffffff",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        borderColor: "#1976d2",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    {/* Image Section */}
                    {getImageUrl(complaint.image_url) && (
                      <Box
                        component="img"
                        src={getImageUrl(complaint.image_url)}
                        alt="Complaint"
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          bgcolor: "#f1f5f9",
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      {/* Title & Status */}
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1.5 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{
                            color: "#0F172A",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            lineHeight: 1.4,
                          }}
                        >
                          {complaint.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={status.text}
                          color={status.color}
                          sx={{ fontWeight: 600, minWidth: 80, flexShrink: 0 }}
                        />
                      </Stack>

                      <Typography variant="body2" sx={{ color: "#64748B", mb: 2 }}>
                        Complaint No. <strong style={{ color: "#0F172A" }}>#{complaint.complaint_number}</strong>
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      {/* Meta Info */}
                      <Stack spacing={2} sx={{ mt: 2, mb: 3 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <CalendarMonth fontSize="small" sx={{ color: "#94a3b8" }} />
                          <Typography variant="body2" sx={{ color: "#475569" }}>
                            {formatDate(complaint.created_at)}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Business fontSize="small" sx={{ color: "#94a3b8" }} />
                          <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                            {complaint.department?.name || "Unassigned Department"}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <AutoAwesome fontSize="small" sx={{ color: "#1976d2" }} />
                          <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                            AI Confidence: {getConfidence(complaint.ai_confidence)}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Action Button */}
                      <Box sx={{ mt: "auto" }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => navigate(`/citizen/complaints/${complaint.id}`)}
                          sx={{
                            height: 44,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            borderColor: "#cbd5e1",
                            color: "#334155",
                            "&:hover": {
                              borderColor: "#1976d2",
                              color: "#1976d2",
                              bgcolor: "#f8fafc",
                            },
                          }}
                        >
                          Track Complaint
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default ComplaintListPage;