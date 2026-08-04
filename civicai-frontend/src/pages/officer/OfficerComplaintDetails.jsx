import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Alert,
  Chip,
  Stack,
  Container,
  Avatar,
} from "@mui/material";
import {
  ArrowBack,
  CalendarToday,
  Person,
  Flag,
  LocationOn,
  Image as ImageIcon,
  Description,
  SmartToy,
  CheckCircle,
  Cancel,
  Star,
} from "@mui/icons-material";
import { complaintService } from "../../services/api/complaintService";
import { officerService } from "../../services/api/officerService";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";
import StatusBadge from "../../components/common/StatusBadge";
import MapComponent from "../../components/common/MapComponent";
import ActionPanel from "../../components/officer/ActionPanel";
import ComplaintTimeline from "../../components/officer/ComplaintTimeline";
import ComplaintImageGallery from "../../components/officer/ComplaintImageGallery";
import OfficerInfoCard from "../../components/officer/OfficerInfoCard";

const OfficerComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [complaint, setComplaint] = useState(null);

  const fetchComplaint = async () => {
    dispatch(setLoading(true));
    try {
      const data = await complaintService.getComplaintById(id);
      setComplaint(data);
    } catch (err) {
      console.error("Failed to fetch complaint:", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

 const handleAction = async (action, payload = {}) => {
  try {
    dispatch(setLoading(true));
      if (action === "refresh") {
    const updated = await complaintService.getComplaintById(id);
    setComplaint(updated);
    return;
}

    if (action === "accept") {
      await officerService.acceptComplaint(id);
      dispatch(
        showSnackbar({
          message: "Complaint accepted successfully",
          severity: "success",
        })
      );
    }

    if (action === "start-work") {
      if (complaint?.status_id !== 2) {
        dispatch(
          showSnackbar({
            message: "First accept the complaint, then start work.",
            severity: "warning",
          })
        );
        return;
      }
    

      await officerService.startWork(id);
      dispatch(
        showSnackbar({
          message: "Work started successfully",
          severity: "success",
        })
      );
    }
    

    if (action === "restart-work") {
      await officerService.restartWork(id);
      dispatch(
        showSnackbar({
          message: "Work restarted successfully",
          severity: "success",
        })
      );
    }

    // Refresh complaint details after action
    const updated = await complaintService.getComplaintById(id);
    setComplaint(updated);

  } catch (error) {
    console.error("Officer Action Error:", error.response?.data);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail?.[0]?.msg ||
      "Action failed";

    dispatch(
      showSnackbar({
        message: errorMessage,
        severity: "error",
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};

  const getPriority = (id) => {
    switch (id) {
      case 1: return { label: "Low", color: "success" };
      case 2: return { label: "Medium", color: "warning" };
      case 3: return { label: "High", color: "error" };
      default: return { label: "Unknown", color: "default" };
    }
  };

  if (!complaint) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card elevation={0} sx={{ p: 5, width: 400, borderRadius: 3, border: "1px solid #e0e0e0", textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Loading Complaint...</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>Please wait while we fetch the details.</Typography>
        </Card>
      </Box>
    );
  }

  const priority = getPriority(complaint.priority_id);
 const getImageUrl = (url) => {
  if (!url) return null;

  return url.startsWith("uploads")
    ? `https://civic-lense-ai.onrender.com/${url}`
    : url;
};

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* ================= HEADER ================= */}
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate("/officer/complaints")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 600, color: "#64748B", "&:hover": { color: "#1976d2", bgcolor: "transparent" } }}
        >
          Back to Complaints
        </Button>

        <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: "#ffffff" }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight={800} sx={{ color: "#0F172A", mb: 1 }}>
                  {complaint.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <Typography variant="body1" sx={{ color: "#64748B" }}>
                    Complaint No: <strong style={{ color: "#0F172A" }}>#{complaint.complaint_number}</strong>
                  </Typography>
                  <Chip 
                    label={`Filed: ${new Date(complaint.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`} 
                    size="small" 
                    variant="outlined" 
                    sx={{ borderColor: "#e2e8f0", color: "#64748B", fontWeight: 500 }} 
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                <StatusBadge statusId={complaint.status_id} />
              </Grid>
            </Grid>
          </Box>
        </Card>

        <Grid container spacing={4}>
          {/* ================= LEFT COLUMN ================= */}
          <Grid item xs={12} lg={8}>
            
            {/* Evidence */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#e3f2fd", color: "#1976d2" }}>
                    <ImageIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Complaint Evidence</Typography>
                </Stack>
                {complaint.image_url ? (
                  <Box
                    component="img"
                    src={getImageUrl(complaint.image_url)}
                    alt="Complaint Evidence"
                    sx={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 2, border: "1px solid #e2e8f0" }}
                  />
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>No complaint image uploaded.</Alert>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                    <Description fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Complaint Description</Typography>
                </Stack>
                <Typography sx={{ color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line" }}>
                  {complaint.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Location */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#fff3e0", color: "#ed6c02" }}>
                    <LocationOn fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Complaint Location</Typography>
                </Stack>
                <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <MapComponent complaints={[complaint]} height="350px" />
                </Box>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #bae6fd", bgcolor: "#f0f9ff" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#ffffff", color: "#0284c7" }}>
                    <SmartToy fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0284c7" }}>AI Analysis</Typography>
                </Stack>
                <Typography sx={{ color: "#0369a1", lineHeight: 1.7, mb: 2 }}>
                  {complaint.ai_description || "AI description is not available for this complaint."}
                </Typography>
                <Chip 
                  icon={<SmartToy fontSize="small" />} 
                  label={`Confidence: ${(complaint.ai_confidence || 0).toFixed(0)}%`} 
                  size="small" 
                  sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600, border: "none" }} 
                />
              </CardContent>
            </Card>
          </Grid>

          {/* ================= RIGHT COLUMN (Sticky) ================= */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: { lg: "sticky" }, top: 90, display: "flex", flexDirection: "column", gap: 3 }}>
              
              {/* Complaint Details */}
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 3 }}>Complaint Details</Typography>
                  <Stack spacing={2.5}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <CalendarToday sx={{ color: "#94a3b8", fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>Filed On</Typography>
                        <Typography fontWeight={600} sx={{ color: "#0F172A" }}>{new Date(complaint.created_at).toLocaleString("en-IN")}</Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Person sx={{ color: "#94a3b8", fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>Citizen ID</Typography>
                        <Typography fontWeight={600} sx={{ color: "#0F172A" }}>{complaint.citizen_id}</Typography>
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Flag sx={{ color: "#94a3b8", fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>Priority</Typography>
                        <Chip label={priority.label} color={priority.color} size="small" sx={{ mt: 0.5, fontWeight: 600 }} />
                      </Box>
                    </Stack>
                    <Divider />
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <LocationOn sx={{ color: "#94a3b8", fontSize: 20, mt: 0.2 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block" }}>Coordinates</Typography>
                        <Typography fontWeight={600} sx={{ color: "#0F172A", fontFamily: "monospace", fontSize: "0.9rem" }}>
                          {complaint.latitude}, {complaint.longitude}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>

              {/* Officer Info & Actions */}
              <OfficerInfoCard />
              <ActionPanel complaint={complaint} onActionSuccess={handleAction} />

              {/* Timeline */}
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 3 }}>Complaint Timeline</Typography>
                  <ComplaintTimeline statusId={complaint.status_id} />
                </CardContent>
              </Card>

              {/* Resolution */}
              {complaint.resolution_remarks && (
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "#dcfce7", color: "#16a34a" }}>
                        <CheckCircle fontSize="small" />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} sx={{ color: "#166534" }}>Resolution</Typography>
                    </Stack>
                    <Typography sx={{ color: "#15803d", lineHeight: 1.7, mb: 2 }}>{complaint.resolution_remarks}</Typography>
                    {complaint.resolution_duration_hours != null && (
                      <Typography variant="body2" sx={{ color: "#166534", fontWeight: 600 }}>
                        ⏱️ Resolution Time: {complaint.resolution_duration_hours} Hours
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Rejection */}
              {complaint.rejection_reason && (
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #fecaca", bgcolor: "#fef2f2" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "#fee2e2", color: "#dc2626" }}>
                        <Cancel fontSize="small" />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} sx={{ color: "#991b1b" }}>Rejection Reason</Typography>
                    </Stack>
                    <Typography sx={{ color: "#b91c1c", lineHeight: 1.7 }}>{complaint.rejection_reason}</Typography>
                  </CardContent>
                </Card>
              )}

                          {/* Citizen Feedback & Closure Status */}
              {(complaint.citizen_feedback || complaint.citizen_rating || complaint.closed_at) && (
                <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "#dcfce7", color: "#16a34a" }}>
                        <CheckCircle fontSize="small" />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} sx={{ color: "#166534" }}>Citizen Closure & Feedback</Typography>
                    </Stack>

                    {/* Closed Date Display */}
                    {complaint.closed_at && (
                      <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600, mb: 2 }}>
                        ✅ Complaint Closed on: {new Date(complaint.closed_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </Typography>
                    )}

                    {/* Star Rating */}
                    {complaint.citizen_rating > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} sx={{ color: star <= complaint.citizen_rating ? "#f59e0b" : "#e2e8f0", fontSize: 20 }} />
                        ))}
                        <Typography variant="body2" sx={{ ml: 1, color: "#64748B", fontWeight: 600 }}>
                          ({complaint.citizen_rating}/5)
                        </Typography>
                      </Stack>
                    )}

                    {/* Feedback Text or Empty State Message */}
                    {complaint.citizen_feedback ? (
                      <Typography sx={{ color: "#475569", lineHeight: 1.7, fontStyle: "italic", bgcolor: "#ffffff", p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        "{complaint.citizen_feedback}"
                      </Typography>
                    ) : (
                      complaint.closed_at && !complaint.citizen_rating && (
                        <Typography sx={{ color: "#475569", fontStyle: "italic", bgcolor: "#ffffff", p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                          Citizen closed the complaint without providing additional feedback or rating.
                        </Typography>
                      )
                    )}
                  </CardContent>
                </Card>
              )}

            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default OfficerComplaintDetails;