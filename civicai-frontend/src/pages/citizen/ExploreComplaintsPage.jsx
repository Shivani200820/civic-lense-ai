import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Stack,
  Container,
  Avatar,
} from "@mui/material";
import {
  ThumbUp,
  LocationOn,
  Category,
  AccountTree,
  Search,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";
import { complaintService } from "../../services/api/complaintService";
import StatusBadge from "../../components/common/StatusBadge";

const ExploreComplaintsPage = () => {
  const dispatch = useDispatch();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      dispatch(setLoading(true));
      const data = await complaintService.getAllComplaints();
      setComplaints(data);
    } catch (error) {
      console.error("Failed to fetch complaints:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSupport = async (id) => {
    try {
      await complaintService.supportComplaint(id);
      dispatch(
        showSnackbar({
          message: "Complaint supported successfully!",
          severity: "success",
        })
      );
      // Optional: Refresh the list or update the local state to show "Supported"
    } catch (error) {
      if (error.response?.status === 409) {
        dispatch(
          showSnackbar({
            message: "You already supported this complaint.",
            severity: "info",
          })
        );
      }
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* ================= PAGE HEADER ================= */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: "#0F172A", mb: 1 }}>
            Explore Complaints
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B", maxWidth: "600px" }}>
            View civic issues reported by citizens and support important complaints to help resolve them faster.
          </Typography>
        </Box>

        {/* ================= COMPLAINTS GRID ================= */}
        <Grid container spacing={3} alignItems="stretch">
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <Grid item xs={12} sm={6} lg={4} key={complaint.id} sx={{ display: "flex" }}>
                <Card
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    bgcolor: "#ffffff",
                    boxShadow: "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.06)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                    
                    {/* TITLE & STATUS */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{
                          color: "#0F172A",
                          flex: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          lineHeight: 1.4,
                        }}
                      >
                        {complaint.title}
                      </Typography>
                      <StatusBadge statusId={complaint.status_id} />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* DESCRIPTION */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#64748B",
                        lineHeight: 1.7,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 2,
                      }}
                    >
                      {complaint.description}
                    </Typography>

                    {/* META TAGS */}
                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                      <Chip
                        icon={<Category fontSize="small" />}
                        label={complaint.category?.name || `Category ID: ${complaint.category_id}`}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          justifyContent: "flex-start", 
                          borderColor: "#e2e8f0", 
                          color: "#475569",
                          fontWeight: 500,
                          height: 32
                        }}
                      />
                      <Chip
                        icon={<AccountTree fontSize="small" />}
                        label={complaint.department?.name || `Dept ID: ${complaint.department_id}`}
                        variant="outlined"
                        size="small"
                        sx={{ 
                          justifyContent: "flex-start", 
                          borderColor: "#e2e8f0", 
                          color: "#475569",
                          fontWeight: 500,
                          height: 32
                        }}
                      />
                    </Stack>

                    {/* LOCATION */}
                    {complaint.latitude && complaint.longitude && (
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3, color: "#64748B" }}>
                        <LocationOn fontSize="small" sx={{ color: "#1976d2" }} />
                        <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                          {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                        </Typography>
                      </Stack>
                    )}

                    {/* SUPPORT BUTTON */}
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ThumbUp />}
                      onClick={() => handleSupport(complaint.id)}
                      sx={{
                        mt: "auto",
                        height: 44,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#1976d2",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.2)",
                        "&:hover": {
                          bgcolor: "#1565c0",
                          boxShadow: "0 6px 16px rgba(25, 118, 210, 0.3)",
                        },
                      }}
                    >
                      Support Complaint
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            /* ================= EMPTY STATE ================= */
            <Grid item xs={12}>
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
                    <Search sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A", mb: 1 }}>
                    No complaints available
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B", maxWidth: 400, mx: "auto" }}>
                    Currently, there are no public complaints to display. Check back later for new civic issues.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ExploreComplaintsPage;