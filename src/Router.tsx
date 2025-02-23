import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./Components/Login";
import SupportRequestForm from "./Components/CreateTicket";
import { Dashboard } from "./Components/AdminDashboard";
import AdminSupportRequests from "./Components/UnAssignTask";
import AssignTicketForAdmin from "./Components/Assign-task";
import MyTasks from "./Components/MyTask";

export const Router = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<>This is Chadn</>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/create-support" element={<SupportRequestForm />} />

        {/* Admin Routes with Nested Structure */}
        <Route path="/admin">
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="un-assign-task" element={<AdminSupportRequests />} />
          <Route path="assign-task" element={<AssignTicketForAdmin />} />
        </Route>
        <Route path="my-task" element={<MyTasks />} />
      </Routes>
    </>
  );
};
