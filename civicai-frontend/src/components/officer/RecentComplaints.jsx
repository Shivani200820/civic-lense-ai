import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Box,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Visibility,
  ListAlt,
  Inbox,
} from "@mui/icons-material";
import StatusBadge from "../common/StatusBadge";

const RecentComplaints = ({ complaints = [] }) => {
  const navigate = useNavigate();

  const getPriorityChip = (priority) => {
    switch (priority) {
      case 3:
        return (
          <Chip
            label="High"
            size="small"
            sx={{
              bgcolor: "#fee2e2",
              color: "#dc2626",
              fontWeight: 600,
              border: "1px solid #fecaca",
            }}
          />
        );
      case 2:
        return (
          <Chip
            label="Medium"
            size="small"
            sx={{
              bgcolor: "#fef3c7",
              color: "#d97706",
              fontWeight: 600,
              border: "1px solid #fde68a",
            }}
          />
        );
      default:
        return (
          <Chip
            label="Low"
            size="small"
            sx={{
              bgcolor: "#dcfce7",
              color: "#16a34a",
              fontWeight: 600,
              border: "1px solid #bbf7d0",
            }}
          />
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
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
            <ListAlt fontSize="small" />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#0F172A" }}>
              Recent Complaints
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Latest complaints assigned to your department
            </Typography>
          </Box>
          {complaints.length > 0 && (
            <Chip
              label={`${complaints.slice(0, 5).length} shown`}
              size="small"
              sx={{
                bgcolor: "#f1f5f9",
                color: "#64748B",
                fontWeight: 600,
              }}
            />
          )}
        </Stack>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    bgcolor: "#f8fafc",
                    color: "#64748B",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    borderBottom: "1px solid #e2e8f0",
                    py: 1.5,
                  },
                }}
              >
                <TableCell>Complaint No</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {complaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Stack alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          bgcolor: "#f1f5f9",
                          color: "#94a3b8",
                        }}
                      >
                        <Inbox sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="body1" fontWeight={600} sx={{ color: "#0F172A" }}>
                        No complaints found
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        There are no complaints assigned to your department yet.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                complaints.slice(0, 5).map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "&:hover": {
                        bgcolor: "#f8fafc",
                      },
                      "& td": {
                        borderBottom: "1px solid #f1f5f9",
                        py: 2,
                      },
                      "&:last-child td": {
                        borderBottom: "none",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: "#1976d2",
                        }}
                      >
                        {row.complaint_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: "#0F172A",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{getPriorityChip(row.priority_id)}</TableCell>
                    <TableCell>
                      <StatusBadge statusId={row.status_id} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        {formatDate(row.created_at)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => navigate(`/officer/complaints/${row.id}`)}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          borderRadius: 2,
                          borderColor: "#e2e8f0",
                          color: "#475569",
                          "&:hover": {
                            borderColor: "#1976d2",
                            color: "#1976d2",
                            bgcolor: "#f8fafc",
                          },
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default RecentComplaints;