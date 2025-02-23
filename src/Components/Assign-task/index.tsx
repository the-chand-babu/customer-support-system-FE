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
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const dummyRequests = [
  {
    id: 1,
    username: "Customer123",
    productType: "Mobile Phone",
    issueType: "Broken Screen",
    submissionDate: "2025-02-22",
    assignedTo: "employee2",
    status: "Open",
  },
  {
    id: 2,
    username: "Customer456",
    productType: "Refrigerator",
    issueType: "Compressor Not Working",
    submissionDate: "2025-02-21",
    assignedTo: "employee2",
    status: "Open",
  },
  {
    id: 3,
    username: "Customer789",
    productType: "TV",
    issueType: "Discoloration Of Screen",
    submissionDate: "2025-02-20",
    assignedTo: "employee2",
    status: "Open",
  },
];

const AssignedSupportRequests = () => {
  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [allocatedTasks, setAllocatedTasks] = useState<any[]>([]);
  const navigate = useNavigate();
  const handleOpen = (request: any) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getAssignTask = async () => {
    try {
      const response = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/allocatedTask",
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userDetails?.isAdmin && userDetails?.userType !== "employee") {
      navigate("/login");
    } else {
      getAssignTask();
    }
  }, []);
  return (
    <Container maxWidth="xl">
      <Button
        onClick={() => navigate("/admin/un-assign-task")}
        variant="contained"
        sx={{ mt: 2 }}
      >
        Go to Unassigned Task
      </Button>
      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
        Assigned Support Requests
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employee's Username</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Issue Type</TableCell>
              <TableCell>Date of Submission</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>More Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocatedTasks?.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.allocatedEmployee.userName}</TableCell>
                <TableCell>{request.productType}</TableCell>
                <TableCell>{request.issueTypes?.[0]}</TableCell>
                <TableCell>
                  {moment(request.createdAt).format("DD-MM-YYYY")}
                </TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpen(request)}
                  >
                    View
                  </Button>
                </TableCell>
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
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssignedSupportRequests;
