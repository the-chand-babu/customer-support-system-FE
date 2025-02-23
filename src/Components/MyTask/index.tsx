import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const MyTasks = () => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [allocatedTasks, setAllocatedTasks] = useState<any[]>([]);

  const handleOpen = (request: any) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusChange = (e: any) => {
    setStatus(e.target.value);
  };

  const MyTask = async () => {
    try {
      const response = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/assignedToMe",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      const { data } = await response.json();
      setAllocatedTasks(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = async () => {
    setOpen(false);

    try {
      await fetch(
        `https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/changeStatus/${selectedRequest._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      MyTask();
    } catch (error) {
      console.log(error);
    }
  };

  const getCustomerTask = async () => {
    try {
      const response = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/my-task",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );
      const { data } = await response.json();
      setAllocatedTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userDetails.userType === "Customer") {
      getCustomerTask();
    } else {
      MyTask();
    }
  }, []);

  return (
    <Container maxWidth="xl">
      {
        /* If the user is a customer, show the Create Ticket button */
        userDetails.userType === "Customer" ? (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate("/create-support")} // ✅ Use Navigate from react-router-dom
          >
            Go to my Create Ticket
          </Button>
        ) : null
      }
      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
        My Tasks
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Username</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Issue Type</TableCell>
              <TableCell>Date of Submission</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>More Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocatedTasks?.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request?.user?.userName ?? "customer"}</TableCell>
                <TableCell>{request.productType}</TableCell>
                <TableCell>{request.issueTypes[0]}</TableCell>
                <TableCell>
                  {moment(request.createdAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{request.status}</TableCell>
                {userDetails.userType === "Customer" ? null : (
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpen(request)}
                    >
                      View
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Request Details */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Support Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Typography>
                <strong>Customer Username:</strong> {selectedRequest.username}
              </Typography>
              <Typography>
                <strong>Product Type:</strong> {selectedRequest.productType}
              </Typography>
              <Typography>
                <strong>Issue Type:</strong> {selectedRequest.issueType}
              </Typography>
              <Typography>
                <strong>Date of Submission:</strong>{" "}
                {selectedRequest.submissionDate}
              </Typography>
              <Typography>
                <strong>Assigned Employee:</strong> {selectedRequest.assignedTo}
              </Typography>
              <Typography>
                <strong>Status:</strong> {selectedRequest.status}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Change Status</InputLabel>
                <Select value={status} onChange={handleStatusChange}>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTasks;
