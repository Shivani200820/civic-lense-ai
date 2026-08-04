import React from "react";
import {
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Stack,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList,
  Clear,
} from "@mui/icons-material";

const OfficerFilters = ({ search, setSearch, status, setStatus }) => {
  const hasActiveFilters = search || status;

  const handleClearFilters = () => {
    setSearch("");
    setStatus("");
  };

  return (
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
            <FilterList fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Filter Complaints
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Search and filter complaints by status
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                borderColor: "#e2e8f0",
                color: "#64748B",
                "&:hover": {
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  bgcolor: "#ffebee",
                },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Stack>

        {/* Filter Fields */}
        <Grid container spacing={2.5}>
          {/* Search Field */}
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by title or complaint number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f8fafc",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "#ffffff",
                  },
                },
              }}
            />
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Filter by Status"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "#e2e8f0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#94a3b8",
                    }}
                  />
                  <Typography>All Status</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="1">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#f59e0b",
                    }}
                  />
                  <Typography>Pending</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="2">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#1976d2",
                    }}
                  />
                  <Typography>Accepted</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="3">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#7e57c2",
                    }}
                  />
                  <Typography>In Progress</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="4">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#2e7d32",
                    }}
                  />
                  <Typography>Resolved</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="6">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#d32f2f",
                    }}
                  />
                  <Typography>Reopened</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="7">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "#64748b",
                    }}
                  />
                  <Typography>Rejected</Typography>
                </Stack>
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Active Filters Indicator */}
        {hasActiveFilters && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}
          >
            {search && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "#e3f2fd",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#1976d2", fontWeight: 600 }}
                >
                  Search: "{search}"
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setSearch("")}
                  sx={{ p: 0.25, color: "#1976d2" }}
                >
                  <Clear sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            )}
            {status && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "#f3e5f5",
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#7e57c2", fontWeight: 600 }}
                >
                  Status:{" "}
                  {
                    {
                      1: "Pending",
                      2: "Accepted",
                      3: "In Progress",
                      4: "Resolved",
                      6: "Reopened",
                      7: "Rejected",
                    }[status]
                  }
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setStatus("")}
                  sx={{ p: 0.25, color: "#7e57c2" }}
                >
                  <Clear sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default OfficerFilters;