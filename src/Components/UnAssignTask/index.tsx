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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const dummyRequests = [
  {
    id: 1,
    username: "Customer123",
    productType: "Mobile Phone",
    issueType: "Broken Screen",
    submissionDate: "2025-02-22",
  },
  {
    id: 2,
    username: "Customer456",
    productType: "Refrigerator",
    issueType: "Compressor Not Working",
    submissionDate: "2025-02-21",
  },
  {
    id: 3,
    username: "Customer789",
    productType: "TV",
    issueType: "Discoloration Of Screen",
    submissionDate: "2025-02-20",
  },
];

const AdminSupportRequests = () => {
  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const handleOpen = (request: any) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAssignedEmployee("");
  };

  const handleAssign = async () => {
    try {
      const data = await fetch(
        `https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/assignedTask/${selectedRequest._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userDetails.token}`,
          },
          body: JSON.stringify({ employeeId: assignedEmployee }),
        }
      );
    } catch (error) {
      console.log(error);
    }
    getUnassignedRequests();
    handleClose();
  };

  const getUnassignedRequests = async () => {
    try {
      const res = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/supportRequest/unallocatedTask",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );

      const { data } = await res.json();
      setRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllEmployees = async () => {
    try {
      const res = await fetch(
        "https://customer-support-system-be-12.onrender.com/api/v1/users/employees",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userDetails.token}`,
          },
        }
      );

      const { data } = await res.json();
      setEmployees(data);
      console.log("this is working fine", res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userDetails?.isAdmin && userDetails?.userType !== "employee") {
      navigate("/login");
    } else {
      getAllEmployees();
      getUnassignedRequests();
    }
  }, []);

  return (
    <Container maxWidth="xl">
      <Button
        onClick={() => navigate("/admin/assign-task")}
        variant="contained"
        sx={{ mt: 2 }}
      >
        Go to Assigned Task
      </Button>
      <Typography variant="h5" align="center" gutterBottom sx={{ mt: 4 }}>
        Unallocated Support Requests
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer Username</TableCell>
              <TableCell>Product Type</TableCell>
              <TableCell>Issue Type</TableCell>
              <TableCell>Date of Submission</TableCell>
              <TableCell>More Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.user.userName}</TableCell>
                  <TableCell>{request.productType}</TableCell>
                  <TableCell>{request.issueTypes[0]}</TableCell>
                  <TableCell>
                    {moment(request.createdAt).format("DD-MM-YYYY")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleOpen(request)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No requests available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Request Details & Assignment */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Support Request Details</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography>
                <strong>Customer Username:</strong>{" "}
                {selectedRequest.user.userName}
              </Typography>
              <Typography>
                <strong>Product Type:</strong> {selectedRequest.productType}
              </Typography>
              <Typography>
                <strong>Issue Type:</strong> {selectedRequest.issueType?.[0]}
              </Typography>
              <Typography>
                <strong>Date of Submission:</strong>{" "}
                {selectedRequest.submissionDate}
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Assign to Employee</InputLabel>
                <Select
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      {employee.userName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            color="primary"
            disabled={!assignedEmployee}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSupportRequests;
