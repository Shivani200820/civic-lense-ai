import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Stack,
  Divider,
  Chip,
  Container,
} from "@mui/material";
import {
  Add,
  ReportProblem,
  PendingActions,
  CheckCircle,
  SmartToy,
  LocationOn,
  ArrowForward,
  Assessment,
  Timeline,
} from "@mui/icons-material";
import { complaintService } from "../../services/api/complaintService";
import { setMyComplaints } from "../../store/redux/slices/complaintsSlice";
import { setLoading } from "../../store/redux/slices/uiSlice";
import MapComponent from "../../components/common/MapComponent";

const CitizenDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myComplaints = [] } = useSelector((state) => state.complaints);
  const { user } = useSelector((state) => state.auth);

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

  const getStatus = (id) => {
    switch (id) {
      case 1:
        return { label: "Pending", color: "warning" };
      case 2:
        return { label: "Accepted", color: "info" };
      case 3:
        return { label: "In Progress", color: "primary" };
      case 4:
        return { label: "Resolved", color: "success" };
      case 5:
        return { label: "Closed", color: "success" };
      default:
        return { label: "Unknown", color: "default" };
    }
  };

  const stats = [
    {
      title: "Total Complaints",
      value: myComplaints.length,
      icon: <Assessment />,
      color: "#1976d2",
      bg: "#e3f2fd",
    },
    {
      title: "Pending",
      value: myComplaints.filter((item) => item.status_id === 1).length,
      icon: <PendingActions />,
      color: "#ed6c02",
      bg: "#fff3e0",
    },
    {
      title: "In Progress",
      value: myComplaints.filter((item) => item.status_id === 3).length,
      icon: <Timeline />,
      color: "#1565c0",
      bg: "#e3f2fd",
    },
    {
      title: "Resolved",
      value: myComplaints.filter(
        (item) => item.status_id === 4 || item.status_id === 5
      ).length,
      icon: <CheckCircle />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#1a1a1a", mb: 1 }}
          >
            Citizen Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Welcome back,{" "}
            <strong style={{ color: "#1976d2" }}>
              {user?.full_name?.split(" ")[0] || "Citizen"}
            </strong>
            . Monitor your complaint progress and manage civic services.
          </Typography>
        </Box>

        {/* Quick Actions Card */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ color: "#1a1a1a", mb: 2 }}
                >
                  Manage Civic Issues Efficiently
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "#666", lineHeight: 1.7, mb: 3 }}
                >
                  Submit complaints with AI-assisted analysis, track real-time
                  resolutions, and communicate directly with authorities.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate("/citizen/new")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                  >
                    Create New Complaint
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/citizen/complaints")}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      "&:hover": {
                        bgcolor: "#e3f2fd",
                        borderColor: "#1565c0",
                      },
                    }}
                  >
                    View All Complaints
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "#f8f9fa",
                    borderRadius: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <SmartToy sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    AI Powered
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Auto-categorization & Priority
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Statistics Cards - 4 in a row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: "1px solid #e0e0e0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: stat.bg, color: stat.color }}>
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontWeight: 500 }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ color: "#1a1a1a" }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* AI Assistant Banner */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "#f0f7ff",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    color: "#1976d2",
                    width: 56,
                    height: 56,
                  }}
                >
                  <SmartToy />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    AI Complaint Assistant
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    Upload images to auto-identify category, priority, and
                    generate descriptions using AI.
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label="AI Enabled"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card
          elevation={0}
          sx={{ mb: 4, borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#fff3e0",
                  color: "#ed6c02",
                }}
              >
                <LocationOn fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Complaint Locations
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                  View all submitted complaint locations on map
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
              }}
            >
              <MapComponent complaints={myComplaints} height="400px" />
            </Box>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card
          elevation={0}
          sx={{ borderRadius: 2, border: "1px solid #e0e0e0" }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Recent Complaints
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                  Track your latest submitted complaints
                </Typography>
              </Box>
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/citizen/complaints")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                View All
              </Button>
            </Stack>
            <Divider sx={{ mb: 3 }} />

            {myComplaints.length > 0 ? (
              <Grid container spacing={3}>
                {myComplaints.slice(0, 4).map((item) => {
                  const currentStatus = getStatus(item.status_id);
                  return (
                    <Grid item xs={12} md={6} key={item.id}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "1px solid #e0e0e0",
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#1976d2",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 2 }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              sx={{ flex: 1, pr: 2, lineHeight: 1.4 }}
                            >
                              {item.title || "Untitled Complaint"}
                            </Typography>
                            <Chip
                              size="small"
                              label={currentStatus.label}
                              color={currentStatus.color}
                              sx={{ fontWeight: 600, minWidth: 80 }}
                            />
                          </Stack>

                          <Stack direction="row" spacing={3} sx={{ mb: 2.5 }}>
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#999",
                                  fontWeight: 600,
                                  display: "block",
                                }}
                              >
                                Complaint No
                              </Typography>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                              >
                                {item.complaint_number || "N/A"}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#999",
                                  fontWeight: 600,
                                  display: "block",
                                }}
                              >
                                AI Confidence
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={0.5}
                                alignItems="center"
                              >
                                <SmartToy
                                  sx={{ fontSize: 16, color: "#1976d2" }}
                                />
                                <Typography
                                  variant="body2"
                                  fontWeight={600}
                                  sx={{ color: "#1976d2" }}
                                >
                                  {item.ai_confidence
                                    ? `${(item.ai_confidence * 100).toFixed(
                                        0
                                      )}%`
                                    : "0%"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>

                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() =>
                              navigate(`/citizen/complaints/${item.id}`)
                            }
                            sx={{
                              height: 40,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Track Details
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "#f5f5f5",
                    color: "#999",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <ReportProblem sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                  No complaints found
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 3 }}>
                  You haven't submitted any complaints yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate("/citizen/new")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    bgcolor: "#1976d2",
                    "&:hover": { bgcolor: "#1565c0" },
                  }}
                >
                  Create First Complaint
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CitizenDashboard;