import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  AutoAwesome,
} from '@mui/icons-material';

import { complaintService } from '../../services/api/complaintService';

const ImageUploadWithAI = ({
  onAIResult,
  imagePreview,
  setImagePreview,
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null);

  // ... (Imports and initial setup same as your code) ...

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAiData(null);

    try {
      const res = await complaintService.uploadImage(file);

      // Safe parsing for wrapped/unwrapped API responses
      const uploadData = res.data || res;
      const analysis = uploadData.analysis;
      const imageUrl = uploadData.image_url;

      setAiData(analysis);
      onAIResult(imageUrl, analysis);
    } catch (error) {
      console.error("Gemini Analysis Failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

// ... (Rest of the JSX and UI exactly same as your code) ...

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        mb: 3,
        textAlign: "center",
        borderStyle: "dashed",
      }}
    >
      <input
        id="image-upload"
        hidden
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {!imagePreview ? (
        <Box py={4}>
          <CloudUpload
            sx={{
              fontSize: 55,
              color: "text.secondary",
              mb: 1,
            }}
          />

          <Typography color="text.secondary">
            Upload Image for AI Analysis
          </Typography>

          <Button
            component="label"
            htmlFor="image-upload"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Capture / Upload
          </Button>
        </Box>
      ) : (
        <Box>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              borderRadius: 10,
              marginBottom: 15,
            }}
          />

          {isAnalyzing ? (
            <Box sx={{ width: "100%" }}>
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mb: 1,
                  fontWeight: "bold",
                }}
                color="primary"
              >
                <AutoAwesome sx={{ mr: 1 }} />

                Gemini AI is analyzing your image...
              </Typography>

              <LinearProgress />
            </Box>
          ) : (
            aiData && (
              <Alert
                severity="success"
                icon={<AutoAwesome />}
                sx={{ textAlign: "left" }}
              >
                <Typography fontWeight="bold">
                  Gemini AI Analysis Complete
                </Typography>

                <Typography variant="body2">
                  Confidence :
                  {" "}
                  {(aiData.confidence * 100).toFixed(0)}
                  %
                </Typography>

                <Typography variant="caption">
                  Complaint form has been automatically filled.
                </Typography>
              </Alert>
            )
          )}

          <Button
            sx={{ mt: 2 }}
            size="small"
            onClick={() => {
              setImagePreview(null);
              setAiData(null);
            }}
          >
            Change Image
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default ImageUploadWithAI;