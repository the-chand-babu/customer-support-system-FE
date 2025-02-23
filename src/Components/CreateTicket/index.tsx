import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Card,
  CardContent,
  FormHelperText,
} from "@mui/material";
import "./style.css";
import { useNavigate } from "react-router-dom";

const issueOptions: any = {
  "Mobile Phone": ["Broken Screen", "Faulty Camera", "Overheating Issue"],
  TV: ["Damaged Screen", "Discoloration Of Screen", "Adapter Issues"],
  Refrigerator: [
    "Panel Controls Broken",
    "Compressor Not Working",
    "Unable To Turn On",
  ],
  "Washing Machine": ["Water overflowing", "Motor not working"],
};

const SupportRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>({
    productType: "",
    issueType: [],
    issueDescription: "",
    policyFile: null,
  });
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ].includes(file.type) &&
      file.size <= 2 * 1024 * 1024
    ) {
      setFormData({ ...formData, policyFile: file });
      setErrors({ ...errors, policyFile: "" });
    } else {
      setErrors({
        ...errors,
        policyFile:
          "Invalid file type or size. Allowed: PDF, DOC, DOCX, JPG, PNG (Max 2MB)",
      });
    }
  };

  const validateForm = () => {
    let tempErrors: any = {};
    if (!formData.productType)
      tempErrors.productType = "Product Type is required";
    if (formData.issueType.length === 0)
      tempErrors.issueType = "At least one Issue Type is required";
    if (!formData.issueDescription.trim())
      tempErrors.issueDescription = "Issue Description is required";
    if (!formData.policyFile)
      tempErrors.policyFile = "Policy document is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;
      if (!token) throw new Error("Unauthorized: No token found");

      // ✅ Use FormData for file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("productType", formData.productType);
      formDataToSend.append("issueTypes", JSON.stringify(formData.issueType)); // Convert array to string
      formDataToSend.append("issueDescription", formData.issueDescription);
      if (formData.policyFile)
        formDataToSend.append("policyUpload", formData.policyFile);

      const res = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/supportRequest",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type for FormData
          body: formDataToSend,
        }
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data?.message || `Error ${res.status}: ${res.statusText}`
        );

      setFormData({
        productType: "",
        issueType: [],
        issueDescription: "",
        policyFile: null,
      });
      alert("Support request submitted successfully!");
    } catch (error: any) {
      console.error("API Error:", error.message);
      alert(error.message);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div id="support-request-form">
      <Container maxWidth="sm">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate("/my-task")} // ✅ Use Navigate from react-router-dom
        >
          Go to my task
        </Button>
        <Card sx={{ mt: 8, p: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              New Support Request
            </Typography>
            <form onSubmit={handleSubmit}>
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.productType}
              >
                <InputLabel>Product Type</InputLabel>
                <Select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  label="Product Type"
                >
                  {Object.keys(issueOptions).map((product) => (
                    <MenuItem key={product} value={product}>
                      {product}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.productType}</FormHelperText>
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                disabled={!formData.productType}
                error={!!errors.issueType}
              >
                <InputLabel>Issue Type</InputLabel>
                <Select
                  multiple
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  label="Issue Type"
                >
                  {(issueOptions[formData.productType] || []).map(
                    (issue: any) => (
                      <MenuItem key={issue} value={issue}>
                        {issue}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText>{errors.issueType}</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                label="Issue Description"
                variant="outlined"
                margin="normal"
                name="issueDescription"
                value={formData.issueDescription}
                onChange={handleChange}
                multiline
                rows={4}
                error={!!errors.issueDescription}
                helperText={errors.issueDescription}
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
                color={errors.policyFile ? "error" : "primary"}
              >
                Upload Policy Document
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.policyFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploaded File: {formData.policyFile.name}
                </Typography>
              )}
              <FormHelperText sx={{ color: "red" }}>
                {errors.policyFile}
              </FormHelperText>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default SupportRequestForm;
