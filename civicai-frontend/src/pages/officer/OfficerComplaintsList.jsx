import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Container,
  Avatar,
  Button,
  Stack,
} from "@mui/material";

import { Inbox } from "@mui/icons-material";

import { officerService } from "../../services/api/officerService";
import { setMyComplaints } from "../../store/redux/slices/complaintsSlice";
import { setLoading } from "../../store/redux/slices/uiSlice";

import OfficerFilters from "../../components/officer/OfficerFilters";
import ComplaintCard from "../../components/officer/ComplaintCard";

const OfficerComplaintsList = () => {
  const dispatch = useDispatch();

  const { myComplaints = [] } = useSelector((state) => state.complaints);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    dispatch(setLoading(true));

    try {
      const data = await officerService.getDepartmentComplaints();
      dispatch(setMyComplaints(data));
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const filteredComplaints = myComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      complaint.complaint_number
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "" ||
      String(complaint.status_id) === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        
        {/* Page Heading */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#0F172A", mb: 1 }}
          >
            Department Complaints
          </Typography>

          <Typography color="text.secondary">
            Manage all complaints assigned to your department.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e0e0e0",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            
            <OfficerFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
            />

            {/* Results Count */}
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mb: 2,
                mt: 2,
                fontWeight: 500,
              }}
            >
              Showing {filteredComplaints.length} of{" "}
              {myComplaints.length} complaints
            </Typography>

            {filteredComplaints.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
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
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ color: "#0F172A", mb: 1 }}
                >
                  No complaints found
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748B",
                    maxWidth: 400,
                    mx: "auto",
                    mb: 3,
                  }}
                >
                  {search || status
                    ? "No complaints match your current filters. Try adjusting your search criteria."
                    : "Currently, there are no complaints assigned to your department."}
                </Typography>
                {(search || status) && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearch("");
                      setStatus("");
                    }}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                {filteredComplaints.map((complaint) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={4}
                    key={complaint.id}
                    sx={{ display: "flex" }}
                  >
                    <ComplaintCard complaint={complaint} />
                  </Grid>
                ))}
              </Grid>
            )}

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default OfficerComplaintsList;