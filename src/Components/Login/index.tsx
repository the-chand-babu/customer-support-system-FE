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
} from "@mui/material";

const LoginForm = () => {
  const [error, setError] = useState({
    username: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    userType: "Customer",
  });

  const idRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (idRef.current) clearTimeout(idRef.current);
    idRef.current = setTimeout(() => {
      setError((prevError) => ({ ...prevError, [name]: false }));
    }, 300);
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;
    if (formData.username === "") {
      setError((prevError) => ({ ...prevError, username: true }));
      valid = false;
    } else {
      setError((prevError) => ({ ...prevError, username: false }));
    }
    if (formData.password === "") {
      setError((prevError) => ({ ...prevError, password: true }));
      valid = false;
    } else {
      setError((prevError) => ({ ...prevError, password: false }));
    }
    if (valid) {
      // Proceed with form submission or API call
      console.log("Form submitted", formData);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        borderRadius: "10px",
        marginTop: "auto",
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Card sx={{ mt: 8, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              name="username"
              value={formData.username}
              onChange={handleChange}
              //   required
              error={error.username}
              helperText={error.username ? "Username is required" : ""}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              name="password"
              value={formData.password}
              onChange={handleChange}
              //   required
              error={error.password}
              helperText={error.password ? "Password is required" : ""}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginForm;
