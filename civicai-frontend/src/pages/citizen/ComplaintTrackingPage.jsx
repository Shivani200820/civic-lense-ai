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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Container,
  Avatar,
} from "@mui/material";
import {
  ArrowBack,
  Star,
  ThumbUp,
  Edit,
  Delete,
  LocationOn,
  AutoAwesome,
  Image as ImageIcon,
  CheckCircle,
} from "@mui/icons-material";
import { complaintService } from "../../services/api/complaintService";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";
import StatusBadge from "../../components/common/StatusBadge";
import ComplaintTimeline from "../../components/citizen/ComplaintTimeline";
import CitizenConfirmationDialog from "../../components/citizen/CitizenConfirmationDialog";
import MapComponent from "../../components/common/MapComponent";

const ComplaintTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [complaint, setComplaint] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [supported, setSupported] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const [complaintData, timelineData] = await Promise.all([
          complaintService.getComplaintById(id),
          complaintService.getTimeline(id),
        ]);
        setComplaint(complaintData);
        setTimeline(timelineData);
      } catch (error) {
        console.error("Failed to fetch complaint:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchData();
  }, [id, dispatch]);

  if (!complaint) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card elevation={0} sx={{ p: 5, width: 400, borderRadius: 3, border: "1px solid #e0e0e0", textAlign: "center" }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
            Loading Complaint Details...
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we fetch the information.
          </Typography>
        </Card>
      </Box>
    );
  }

  const handleSupport = async () => {
    try {
      dispatch(setLoading(true));
      await complaintService.supportComplaint(id);
      setSupported(true);
      dispatch(showSnackbar({ message: "Complaint supported successfully", severity: "success" }));
    } catch (error) {
      if (error.response?.status === 409) {
        setSupported(true);
        dispatch(showSnackbar({ message: "Already supported", severity: "info" }));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      dispatch(setLoading(true));
      await complaintService.deleteComplaint(id);
      dispatch(showSnackbar({ message: "Complaint deleted successfully", severity: "success" }));
      navigate("/citizen/complaints");
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditOpen = () => {
    setEditData({ title: complaint.title, description: complaint.description });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (editData.title.trim().length < 5) {
      dispatch(showSnackbar({ message: "Title must be at least 5 characters", severity: "error" }));
      return;
    }
    if (editData.description.trim().length < 10) {
      dispatch(showSnackbar({ message: "Description must be at least 10 characters", severity: "error" }));
      return;
    }
    try {
      dispatch(setLoading(true));
      await complaintService.updateComplaint(id, {
        title: editData.title.trim(),
        description: editData.description.trim(),
      });
      dispatch(showSnackbar({ message: "Complaint updated successfully", severity: "success" }));
      setEditOpen(false);
      const updated = await complaintService.getComplaintById(id);
      setComplaint(updated);
    } catch (error) {
      console.error("Failed to update:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

   const handleConfirmSubmit = async (payload) => {
    try {
      dispatch(setLoading(true));
      await complaintService.confirmResolution(id, payload);
      dispatch(showSnackbar({ message: "Feedback submitted successfully", severity: "success" }));
      setConfirmDialogOpen(false);
      const updated = await complaintService.getComplaintById(id);
      setComplaint(updated);
    } catch (error) {
      // FIX: नेमका कोणता field fail झाला ते बघण्यासाठी
      console.error("Confirm API Error Details:", error.response?.data);
      
      const errorMsg = error.response?.data?.detail?.[0]?.msg || "Failed to submit feedback";
      dispatch(showSnackbar({ message: errorMsg, severity: "error" }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const needsConfirmation = (complaint.status_id === 4 || complaint.status_id === 5) && !complaint.closed_at;
  const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("uploads") ? `http://127.0.0.1:8000/${url}` : url;
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* ================= HEADER ================= */}
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={() => navigate("/citizen/complaints")}
          sx={{ mb: 2, textTransform: "none", fontWeight: 600, color: "#64748B", "&:hover": { color: "#1976d2", bgcolor: "transparent" } }}
        >
          Back to My Complaints
        </Button>

        <Card elevation={0} sx={{ mb: 4, borderRadius: 3, border: "1px solid #e0e0e0", overflow: "hidden" }}>
          <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: "#ffffff" }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" fontWeight={800} sx={{ color: "#0F172A", mb: 1 }}>
                  {complaint.title}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
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
          <Grid item xs={12} md={8}>
            
            {/* Evidence & Map */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#e3f2fd", color: "#1976d2" }}>
                    <ImageIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Location & Evidence</Typography>
                </Stack>

                {getImageUrl(complaint.image_url) && (
                  <Box
                    component="img"
                    src={getImageUrl(complaint.image_url)}
                    alt="Complaint Evidence"
                    sx={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 2, mb: 3, border: "1px solid #e2e8f0" }}
                  />
                )}
                
                <Box sx={{ borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                  <MapComponent complaints={[complaint]} height="300px" />
                </Box>
              </CardContent>
            </Card>

            {/* Description & AI */}
            <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #e0e0e0" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                    <Edit fontSize="small" />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>Complaint Description</Typography>
                </Stack>
                <Typography sx={{ color: "#475569", lineHeight: 1.8, whiteSpace: "pre-line", mb: 3 }}>
                  {complaint.description}
                </Typography>

                {complaint.ai_description && (
                  <Box sx={{ p: 3, bgcolor: "#f0f9ff", borderRadius: 2, border: "1px solid #bae6fd" }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <AutoAwesome sx={{ color: "#0284c7", fontSize: 20 }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#0284c7" }}>AI Analysis Summary</Typography>
                    </Stack>
                    <Typography sx={{ color: "#0369a1", lineHeight: 1.7, mb: 2 }}>
                      {complaint.ai_description}
                    </Typography>
                    {complaint.ai_confidence && (
                      <Chip 
                        icon={<AutoAwesome fontSize="small" />} 
                        label={`AI Confidence: ${(complaint.ai_confidence * 100).toFixed(0)}%`} 
                        size="small" 
                        sx={{ bgcolor: "#e0f2fe", color: "#0369a1", fontWeight: 600, border: "none" }} 
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Resolution Details */}
            {complaint.resolution_remarks && (
              <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4" }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#dcfce7", color: "#16a34a" }}>
                      <CheckCircle fontSize="small" />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#166534" }}>Resolution Details</Typography>
                  </Stack>
                  <Typography sx={{ color: "#15803d", lineHeight: 1.8, mb: 2 }}>
                    {complaint.resolution_remarks}
                  </Typography>
                  {complaint.resolution_image_url && (
                    <Box
                      component="img"
                      src={getImageUrl(complaint.resolution_image_url) || complaint.resolution_image_url}
                      alt="Resolution Proof"
                      sx={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 2, border: "1px solid #bbf7d0" }}
                    />
                  )}
                </CardContent>
              </Card>
            )}

                      {/* Citizen Feedback & Closure Confirmation */}
            {(complaint.citizen_feedback || complaint.citizen_rating || complaint.closed_at) && (
              <Card elevation={0} sx={{ mb: 3, borderRadius: 3, border: "1px solid #bbf7d0", bgcolor: "#f0fdf4" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#166534", mb: 2 }}>
                    Your Feedback & Closure
                  </Typography>

                  {/* Closed Date - नेहमी दिसेल */}
                  {complaint.closed_at && (
                    <Typography variant="body2" sx={{ color: "#15803d", fontWeight: 600, mb: 2 }}>
                      ✅ You closed this complaint on{" "}
                      {new Date(complaint.closed_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  )}

                  {/* Rating Stars - rating असेल तरच */}
                  {complaint.citizen_rating > 0 && (
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          sx={{
                            color: star <= complaint.citizen_rating ? "#f59e0b" : "#e2e8f0",
                            fontSize: 24,
                          }}
                        />
                      ))}
                      <Typography variant="body2" sx={{ ml: 1, color: "#64748B", fontWeight: 600 }}>
                        ({complaint.citizen_rating}/5)
                      </Typography>
                    </Stack>
                  )}

                  {/* Feedback Text किंवा Fallback Message */}
                  {complaint.citizen_feedback ? (
                    <Typography sx={{ color: "#475569", lineHeight: 1.7, fontStyle: "italic", bgcolor: "#ffffff", p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                      "{complaint.citizen_feedback}"
                    </Typography>
                  ) : (
                    <Typography sx={{ color: "#64748B", fontStyle: "italic", bgcolor: "#ffffff", p: 2, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                      You closed this complaint without providing additional feedback or rating.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* ================= RIGHT COLUMN (Sticky) ================= */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: "sticky" }, top: 90, display: "flex", flexDirection: "column", gap: 3 }}>
              
              {/* Complaint Details */}
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 3 }}>Complaint Details</Typography>
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 0.5 }}>Department</Typography>
                      <Typography fontWeight={600} sx={{ color: "#0F172A" }}>{complaint.department?.name || "Unassigned"}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 0.5 }}>Priority</Typography>
                      <Typography fontWeight={600} sx={{ color: "#0F172A" }}>{complaint.priority?.name || "Normal"}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600, display: "block", mb: 0.5 }}>Current Status</Typography>
                      <Box sx={{ mt: 0.5 }}><StatusBadge statusId={complaint.status_id} /></Box>
                    </Box>
                    {complaint.rejection_reason && (
                      <>
                        <Divider />
                        <Alert severity="error" sx={{ borderRadius: 2 }}>
                          <Typography fontWeight={700} variant="subtitle2">Rejection Reason</Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>{complaint.rejection_reason}</Typography>
                        </Alert>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 3 }}>Status Timeline</Typography>
                  <ComplaintTimeline events={timeline} />
                </CardContent>
              </Card>

              {/* Actions */}
                            {/* Actions */}
              <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 3 }}>Available Actions</Typography>
                  <Stack spacing={2}>
                    {needsConfirmation && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => setConfirmDialogOpen(true)}
                        sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                      >
                        Review & Confirm Resolution
                      </Button>
                    )}

                    {complaint.status_id === 1 && (
                      <>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<ThumbUp />}
                          disabled={supported}
                          onClick={handleSupport}
                          sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600, borderColor: "#1976d2", color: "#1976d2", "&:hover": { bgcolor: "#e3f2fd" } }}
                        >
                          {supported ? "Already Supported" : "Support Complaint"}
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={handleEditOpen}
                          sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                        >
                          Edit Complaint
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<Delete />}
                          onClick={handleDelete}
                          sx={{ py: 1.5, borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                        >
                          Delete Complaint
                        </Button>
                      </>
                    )}

                    {/* FIX: No actions available - status message */}
                    {!needsConfirmation && complaint.status_id !== 1 && (
                      <Alert
                        severity={complaint.closed_at ? "success" : "info"}
                        icon={complaint.closed_at ? <CheckCircle /> : undefined}
                        sx={{
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: complaint.closed_at ? "#bbf7d0" : "#bae6fd",
                          bgcolor: complaint.closed_at ? "#f0fdf4" : "#f0f9ff",
                        }}
                      >
                        <Typography variant="body2" fontWeight={600} sx={{ color: complaint.closed_at ? "#166534" : "#0369a1" }}>
                          {complaint.closed_at
                            ? "This complaint has been closed after your confirmation."
                            : "No actions available at this stage."}
                        </Typography>
                        <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: complaint.closed_at ? "#15803d" : "#0284c7" }}>
                          {complaint.closed_at
                            ? `Closed on: ${new Date(complaint.closed_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} — no further actions are available.`
                            : "The complaint is being processed by the concerned department. Once it is resolved, you will be able to review & confirm here."}
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

            </Box>
          </Grid>
        </Grid>

        {/* ================= EDIT DIALOG ================= */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 3 } }}>
          <DialogTitle sx={{ fontWeight: 700, color: "#0F172A" }}>Edit Complaint</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Complaint Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              multiline
              rows={5}
              margin="normal"
              label="Description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={() => setEditOpen(false)} sx={{ textTransform: "none", fontWeight: 600 }}>Cancel</Button>
            <Button variant="contained" onClick={handleUpdate} sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, px: 3 }}>Save Changes</Button>
          </DialogActions>
        </Dialog>

        {/* Citizen Confirmation Dialog */}
        <CitizenConfirmationDialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          onSubmit={handleConfirmSubmit}
        />
      </Container>
    </Box>
  );
};

export default ComplaintTrackingPage;