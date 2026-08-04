import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Container,
  Avatar,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  AdminPanelSettings,
  People,
  ReportProblem,
  CheckCircle,
  PendingActions,
  TaskAlt,
  TrendingUp,
  PieChart as PieChartIcon,
  History,
  CalendarToday,
} from "@mui/icons-material";
import { adminService } from "../../services/api/adminService";
import { setLoading } from "../../store/redux/slices/uiSlice";
import { useDispatch } from "react-redux";

const COLORS = ["#1976d2", "#2e7d32", "#f59e0b", "#0288d1", "#d32f2f"];

// Monthly trend data la safe format madhe convert karanyasathi
const normalizeMonthlyTrend = (chartsResponse) => {
  const raw =
    chartsResponse?.data?.monthly_trend ||
    chartsResponse?.monthly_trend ||
    chartsResponse?.data?.monthly ||
    chartsResponse?.monthly ||
    (Array.isArray(chartsResponse?.data) ? chartsResponse.data : null) ||
    (Array.isArray(chartsResponse) ? chartsResponse : null) ||
    [];

  const rows = Array.isArray(raw)
    ? raw
    : raw && typeof raw === "object"
    ? Object.entries(raw).map(([month, value]) => ({ month, value }))
    : [];

  return rows.map((item, index) => ({
    month:
      item?.month ||
      item?.month_name ||
      item?.name ||
      item?.label ||
      `Month ${index + 1}`,
    count: Number(
      item?.count ??
        item?.total ??
        item?.complaints ??
        item?.total_complaints ??
        item?.complaint_count ??
        item?.value ??
        0
    ),
  }));
};

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const [stats, setStats] = useState({
    total_complaints: 0,
    total_citizens: 0,
    total_officers: 0,
    resolution_rate: 0,
    pending: 0,
    closed: 0,
  });

  const [chartData, setChartData] = useState({
    monthly: [],
    statusDist: [],
  });

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      dispatch(setLoading(true));
      try {
        const [dash, charts, acts, officers] = await Promise.all([
          adminService.getDashboard(),
          adminService.getCharts(),
          adminService.getRecentActivities(),
          adminService.getOfficers(),
        ]);

        const dashboardData = dash?.data || dash || {};
        const statsData = dashboardData.statistics || {};

        // SAFE: officers object aalyas crash hoऊ naye
        const officersList = Array.isArray(officers)
          ? officers
          : Array.isArray(officers?.data)
          ? officers.data
          : Array.isArray(officers?.data?.officers)
          ? officers.data.officers
          : [];

        const activeOfficerCount = officersList.filter(
          (officer) => officer?.is_active
        ).length;

        setStats({
          total_complaints: statsData.total_complaints || 0,
          total_citizens: dashboardData.citizen?.submitted?.length || 0,
          total_officers: activeOfficerCount,
          pending: statsData.pending || 0,
          closed: statsData.closed || 0,
          resolution_rate: statsData.total_complaints
            ? Math.round(((statsData.closed || 0) / statsData.total_complaints) * 100)
            : 0,
        });

        setChartData({
          monthly: normalizeMonthlyTrend(charts),
          statusDist: charts?.data?.status_chart || [],
        });

        setActivities(acts?.recent_complaints || []);
      } catch (error) {
        console.error("Admin Dashboard Error:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDashboard();
  }, [dispatch]);

  const kpiCards = [
    {
      title: "Total Complaints",
      value: stats.total_complaints,
      subtitle: "Registered complaints",
      icon: <ReportProblem />,
      color: "#1976d2",
      bgColor: "#e3f2fd",
    },
    {
      title: "Total Citizens",
      value: stats.total_citizens,
      subtitle: "Registered users",
      icon: <People />,
      color: "#0288d1",
      bgColor: "#e1f5fe",
    },
    {
      title: "Active Officers",
      value: stats.total_officers,
      subtitle: "Available officers",
      icon: <AdminPanelSettings />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      title: "Resolution Rate",
      value: `${stats.resolution_rate}%`,
      subtitle: "Successfully closed",
      icon: <CheckCircle />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
    {
      title: "Pending",
      value: stats.pending,
      subtitle: "Waiting for action",
      icon: <PendingActions />,
      color: "#f59e0b",
      bgColor: "#fff3e0",
    },
    {
      title: "Closed",
      value: stats.closed,
      subtitle: "Completed cases",
      icon: <TaskAlt />,
      color: "#2e7d32",
      bgColor: "#e8f5e9",
    },
  ];

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
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#0F172A", mb: 1 }}>
            Admin Control Panel
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748B" }}>
            System-wide analytics and governance management overview.
          </Typography>
        </Box>

        {/* KPI CARDS - 6 cards in 2 rows */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                  bgcolor: "#ffffff",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600, mb: 1 }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h3" fontWeight={800} sx={{ color: "#0F172A", lineHeight: 1 }}>
                        {card.value}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94a3b8", mt: 0.5, display: "block" }}>
                        {card.subtitle}
                      </Typography>
                    </Box>
                    <Avatar sx={{ width: 48, height: 48, bgcolor: card.bgColor, color: card.color }}>
                      {card.icon}
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CHARTS SECTION */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Monthly Trend Chart */}
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#ffffff" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#e3f2fd", color: "#1976d2" }}>
                    <TrendingUp fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                      Monthly Complaint Trends
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      Complaint registration analytics over time
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.monthly || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#64748B", fontSize: 12 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#1976d2"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#1976d2", strokeWidth: 2, stroke: "#ffffff" }}
                        activeDot={{ r: 7, fill: "#1976d2", stroke: "#ffffff", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Status Distribution */}
          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#ffffff" }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: "#f3e5f5", color: "#7e57c2" }}>
                    <PieChartIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                      Status Distribution
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#64748B" }}>
                      Current complaint status
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.statusDist || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={50}
                        paddingAngle={3}
                        strokeWidth={2}
                        stroke="#ffffff"
                      >
                        {(chartData.statusDist || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: "0.8rem", color: "#64748B" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* RECENT ACTIVITY */}
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #e0e0e0", bgcolor: "#ffffff" }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                <History fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                  Recent Activity
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Latest complaints registered on the platform
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <List disablePadding>
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity) => (
                  <ListItem
                    key={activity.id}
                    sx={{
                      py: 2,
                      px: 2,
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: "#f8fafc",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    <Avatar sx={{ width: 40, height: 40, bgcolor: "#e3f2fd", color: "#1976d2", mr: 2 }}>
                      <ReportProblem fontSize="small" />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={600} sx={{ color: "#0F172A" }}>
                          {activity.title}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" sx={{ color: "#1976d2", fontWeight: 600, fontFamily: "monospace" }}>
                            {activity.complaint_number}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#cbd5e1" }}>•</Typography>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarToday sx={{ fontSize: 12, color: "#94a3b8" }} />
                            <Typography variant="caption" sx={{ color: "#64748B" }}>
                              {formatDate(activity.created_at)}
                            </Typography>
                          </Stack>
                        </Stack>
                      }
                    />
                    <Chip
                      label="New"
                      size="small"
                      sx={{
                        bgcolor: "#e3f2fd",
                        color: "#1976d2",
                        fontWeight: 600,
                        height: 28,
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    No recent activities available
                  </Typography>
                </Box>
              )}
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminDashboard;