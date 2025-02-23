import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export const Dashboard = () => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!userDetails?.isAdmin && userDetails?.userType !== "employee") {
      navigate("/login");
    } else {
    }
  }, []);

  return (
    <div id="admin-dashboard">
      <div onClick={() => navigate("/admin/un-assign-task")}>
        Unallocated task
      </div>
      <div onClick={() => navigate("/admin/assign-task")}>Allocated Task</div>
    </div>
  );
};
