import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Stack,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import {
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";

const OfficerCharts = ({ stats }) => {
  // Theme colors matching the app
  const themeColors = {
    pending: "#ed6c02",
    accepted: "#1976d2",
    inProgress: "#7e57c2",
    resolved: "#2e7d32",
  };

  const pieData = [
    { name: "Pending", value: stats.pending || 0, color: themeColors.pending },
    { name: "Accepted", value: stats.accepted || 0, color: themeColors.accepted },
    { name: "In Progress", value: stats.in_progress || 0, color: themeColors.inProgress },
    { name: "Resolved", value: stats.resolved || 0, color: themeColors.resolved },
  ];

  const total = pieData.reduce((sum, item) => sum + item.value, 0);

  const barData = [
    {
      name: "Status Distribution",
      Pending: stats.pending || 0,
      Accepted: stats.accepted || 0,
      "In Progress": stats.in_progress || 0,
      Resolved: stats.resolved || 0,
    },
  ];

  // Custom Tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ color: "#0F172A" }}>
            {data.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Count: <strong>{data.value}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Share: <strong>{percentage}%</strong>
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Custom Tooltip for Bar Chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "white",
            p: 1.5,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="body2" fontWeight={700} sx={{ color: "#0F172A", mb: 0.5 }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Custom Legend for Pie Chart
  const CustomLegend = ({ payload }) => {
    return (
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ mt: 1 }}
      >
        {payload?.map((entry, index) => (
          <Chip
            key={index}
            icon={
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: entry.color,
                }}
              />
            }
            label={`${entry.value} (${total > 0 ? ((entry.payload.value / total) * 100).toFixed(0) : 0}%)`}
            size="small"
            sx={{
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Pie Chart Card */}
      <Grid item xs={12} md={6}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            bgcolor: "#ffffff",
            height: "100%",
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
                <PieChartIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                  Complaint Status Distribution
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Visual breakdown of complaints by status
                </Typography>
              </Box>
            </Stack>

            {/* Total Summary */}
            <Box
              sx={{
                bgcolor: "#f8fafc",
                borderRadius: 2,
                p: 2,
                mb: 3,
                textAlign: "center",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                TOTAL COMPLAINTS
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color: "#0F172A" }}>
                {total}
              </Typography>
            </Box>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart Card */}
      <Grid item xs={12} md={6}>
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            bgcolor: "#ffffff",
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#f3e5f5",
                  color: "#7e57c2",
                }}
              >
                <BarChartIcon fontSize="small" />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
                  Status Overview
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  Comparative view of complaint statuses
                </Typography>
              </Box>
            </Stack>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: 20,
                    fontSize: "0.85rem",
                  }}
                />
                <Bar
                  dataKey="Pending"
                  fill={themeColors.pending}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="Accepted"
                  fill={themeColors.accepted}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="In Progress"
                  fill={themeColors.inProgress}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
                <Bar
                  dataKey="Resolved"
                  fill={themeColors.resolved}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OfficerCharts;