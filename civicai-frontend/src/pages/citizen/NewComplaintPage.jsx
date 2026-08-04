import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Container,
  Card,
  CardContent,
  Avatar,
  Stack,
} from "@mui/material";
import {
  MyLocation,
  Send,
  LocationOn,
  SmartToy,
  Description,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { complaintSchema } from "../../utils/validationSchemas";
import { complaintService } from "../../services/api/complaintService";
import { setLoading, showSnackbar } from "../../store/redux/slices/uiSlice";
import ImageUploadWithAI from "../../components/citizen/ImageUploadWithAI";

const steps = ["Location", "AI Analysis", "Complaint Details"];

const NewComplaintPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      latitude: null,
      longitude: null,
      title: "",
      description: "",
      final_category_id: "",
      final_department_id: "",
      final_priority_id: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [masterData, setMasterData] = useState({
    categories: [],
    departments: [],
    priorities: [],
  });
  const [duplicateDialog, setDuplicateDialog] = useState({
    open: false,
    complaintId: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, depts, pris] = await Promise.all([
          complaintService.getCategories(),
          complaintService.getDepartments(),
          complaintService.getPriorities(),
        ]);
        setMasterData({
          categories: cats,
          departments: depts,
          priorities: pris,
        });
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);

  const handleGetGPS = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitude", position.coords.latitude);
        setValue("longitude", position.coords.longitude);
        dispatch(
          showSnackbar({
            message: "Location captured successfully",
            severity: "success",
          })
        );
      },
      () => {
        dispatch(
          showSnackbar({
            message: "Unable to get location",
            severity: "error",
          })
        );
      }
    );
  };

  const handleAIResult = (url, analysis) => {
    setImageUrl(url);
    setValue("title", analysis.title || "");
    setValue("description", analysis.description || "");

    const category = masterData.categories.find(
      (c) => c.name.toLowerCase() === analysis.category.toLowerCase()
    );
    if (category) setValue("final_category_id", category.id);

    const department = masterData.departments.find(
      (d) => d.name.toLowerCase() === analysis.department.toLowerCase()
    );
    if (department) setValue("final_department_id", department.id);

    const priority = masterData.priorities.find(
      (p) => p.name.toLowerCase() === analysis.priority.toLowerCase()
    );
    if (priority) setValue("final_priority_id", priority.id);
  };

  const onSubmit = async (data) => {
    // FIX: IDs ला Number() मध्ये convert केले आहे जेणेकरून 422 Error येणार नाही
    const payload = {
      title: data.title,
      description: data.description,
      latitude: Number(data.latitude),
      longitude: Number(data.longitude),
      image_url: imageUrl || null, // null pathavle tar backend la handle karta yete
      ai_category: masterData.categories.find((c) => c.id === Number(data.final_category_id))?.name || null,
      ai_department: masterData.departments.find((d) => d.id === Number(data.final_department_id))?.name || null,
      ai_priority: masterData.priorities.find((p) => p.id === Number(data.final_priority_id))?.name || null,
      ai_title: data.title,
      ai_description: data.description,
      ai_confidence: 0.95,
      final_category_id: Number(data.final_category_id),
      final_department_id: Number(data.final_department_id),
      final_priority_id: Number(data.final_priority_id),
      final_description: data.description,
    };

    try {
      dispatch(setLoading(true));
      await complaintService.createComplaint(payload);
      dispatch(showSnackbar({ message: "Complaint registered successfully", severity: "success" }));
      navigate("/citizen/complaints");
    } catch (error) {
      // FIX: Console madhe exact error message readable format madhe disel
      const errorDetails = error.response?.data || error.message;
      console.error("Create Complaint Error Details:", JSON.stringify(errorDetails, null, 2));
      
      if (error.response?.status === 409) {
        dispatch(showSnackbar({ message: "Duplicate Complaint! A similar issue already exists nearby.", severity: "warning" }));
      } else {
        // FastAPI cha validation error message extract karun UI var dakhvuya
        let errorMsg = "Failed to submit complaint.";
        if (error.response?.data?.detail) {
           if (Array.isArray(error.response.data.detail)) {
              // Pydantic validation error array
              errorMsg = error.response.data.detail.map(e => e.msg).join(", ");
           } else {
              errorMsg = error.response.data.detail;
           }
        } else if (error.response?.data?.message) {
           errorMsg = error.response.data.message;
        }
        
        dispatch(showSnackbar({ message: errorMsg, severity: "error" }));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

// ... (Rest of the JSX and UI exactly same as your code) ...

  const lat = watch("latitude");
  const lng = watch("longitude");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ color: "#1a1a1a", mb: 1 }}
          >
            Report New Issue
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            AI-powered civic complaint registration system
          </Typography>
        </Box>

        {/* Stepper Card */}
        <Card
          elevation={0}
          sx={{
            mb: 4,
            borderRadius: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={2} alternativeLabel>
              {steps.map((step) => (
                <Step key={step}>
                  <StepLabel
                    sx={{
                      "& .MuiStepLabel-label": {
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      },
                    }}
                  >
                    {step}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Location Section */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#e3f2fd",
                    color: "#1976d2",
                  }}
                >
                  <LocationOn fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Location Verification
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Capture your current location for accurate complaint tracking
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Current Coordinates
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: lat ? "#1976d2" : "#999",
                        fontWeight: lat ? 600 : 400,
                        fontFamily: "monospace",
                      }}
                    >
                      {lat
                        ? `${lat.toFixed(5)}, ${lng.toFixed(5)}`
                        : "Location not captured yet"}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MyLocation />}
                    onClick={handleGetGPS}
                    sx={{
                      height: 48,
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
                    Capture Location
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* AI Analysis Section */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#f3e5f5",
                    color: "#7b1fa2",
                  }}
                >
                  <SmartToy fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    AI Complaint Analyzer
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Upload an image for AI-powered analysis and auto-fill details
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: 3,
                  p: 3,
                  bgcolor: "#fafbfc",
                }}
              >
                <ImageUploadWithAI
                  onAIResult={handleAIResult}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </Box>

              {imageUrl && (
                <Alert
                  severity="success"
                  sx={{ mt: 3, borderRadius: 2 }}
                  icon={<CheckCircle />}
                >
                  <Typography variant="body2" fontWeight={600}>
                    AI analysis completed successfully. Please review the generated details below.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Complaint Details Section - FIXED LAYOUT */}
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "#e8f5e9",
                    color: "#2e7d32",
                  }}
                >
                  <Description fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>
                    Complaint Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Fill in the complaint details (auto-filled by AI if available)
                  </Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Title - Full Width */}
                <Grid item xs={12}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Complaint Title"
                        placeholder="Enter a brief title for your complaint"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Description - Full Width */}
                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={5}
                        label="Complaint Description"
                        placeholder="Describe the issue in detail..."
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                {/* Category, Department, Priority - 3 in a row */}
                <Grid item xs={12} md={4}>
                  <Controller
                    name="final_category_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        select
                        fullWidth
                        label="Category"
                        error={!!errors.final_category_id}
                        helperText={errors.final_category_id?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {masterData.categories.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="final_department_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        select
                        fullWidth
                        label="Department"
                        error={!!errors.final_department_id}
                        helperText={errors.final_department_id?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {masterData.departments.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="final_priority_id"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ""}
                        select
                        fullWidth
                        label="Priority"
                        error={!!errors.final_priority_id}
                        helperText={errors.final_priority_id?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      >
                        {masterData.priorities.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!imageUrl || !lat}
              startIcon={<Send />}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#1976d2",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  bgcolor: "#1565c0",
                  boxShadow: "0 6px 16px rgba(25, 118, 210, 0.4)",
                },
                "&:disabled": {
                  bgcolor: "#ccc",
                  boxShadow: "none",
                },
              }}
            >
              Submit Complaint
            </Button>
          </Box>
        </form>

       
        
      </Container>
    </Box>
  );
};

export default NewComplaintPage;