import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import {
  Assignment,
  PendingActions,
  CheckCircle,
  Build,
  Replay,
} from "@mui/icons-material";
import { officerService } from "../../services/api/officerService";
import { setLoading } from "../../store/redux/slices/uiSlice";
import OfficerWelcome from "../../components/officer/OfficerWelcome";
import OfficerStatCard from "../../components/officer/OfficerStatCard";
import RecentComplaints from "../../components/officer/RecentComplaints";
import OfficerQuickActions from "../../components/officer/OfficerQuickActions";
import OfficerCharts from "../../components/officer/OfficerCharts";

const OfficerDashboard = () => {
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    total_complaints: 0,
    pending: 0,
    accepted: 0,
    in_progress: 0,
    resolved: 0,
    reopened: 0,
  });

  const [recentComplaints, setRecentComplaints] = useState([]);

   useEffect(() => {
    const fetchDashboard = async () => {
      dispatch(setLoading(true));
      try {
        // FIX: Changed getDashboard() to getOfficerDashboard()
        const dashboardData = await officerService.getOfficerDashboard();
        console.log("Officer Dashboard Stats:", dashboardData);
        setStats(dashboardData);

        const complaintsData = await officerService.getDepartmentComplaints();
        console.log("Department Complaints List:", complaintsData);
        setRecentComplaints(complaintsData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err.response?.data || err.message);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchDashboard();
  }, [dispatch]);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Welcome Section */}
        <OfficerWelcome />

        {/* Page Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#0F172A", mb: 1 }}
          >
            Officer Dashboard
          </Typography>
          <Typography color="text.secondary">
            Manage and resolve civic complaints assigned to your department.
          </Typography>
        </Box>

        {/* Stats Cards - 5 cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2}>
            <OfficerStatCard
              title="Total"
              value={stats.total_complaints}
              icon={<Assignment fontSize="large" />}
              color="#1976d2"
              bgColor="#e3f2fd"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2}>
            <OfficerStatCard
              title="Pending"
              value={stats.pending}
              icon={<PendingActions fontSize="large" />}
              color="#ed6c02"
              bgColor="#fff3e0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2}>
            <OfficerStatCard
              title="In Progress"
              value={stats.in_progress}
              icon={<Build fontSize="large" />}
              color="#7e57c2"
              bgColor="#f3e5f5"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2}>
            <OfficerStatCard
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircle fontSize="large" />}
              color="#2e7d32"
              bgColor="#e8f5e9"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2}>
            <OfficerStatCard
              title="Reopened"
              value={stats.reopened}
              icon={<Replay fontSize="large" />}
              color="#d32f2f"
              bgColor="#ffebee"
            />
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <RecentComplaints complaints={recentComplaints} />
          </Grid>

          <Grid item xs={12} md={4}>
            <OfficerQuickActions />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Box sx={{ mt: 3 }}>
          <OfficerCharts stats={stats} />
        </Box>

      </Container>
    </Box>
  );
};

export default OfficerDashboard;