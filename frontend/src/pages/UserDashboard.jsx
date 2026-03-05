import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./UserDashboard.css";

function UserDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const id = jwtDecode(token).id;
  const navigate = useNavigate();

  const [user, setUser] = useState([]);

  const getuser = async () => {
    const response = await fetch(`${API_URL}/api/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      if (response.status == 401) {
        navigate("/");
      }
      alert(result.message);
      return;
    }
    setUser(result.data);
  };
  useEffect(() => {
    getuser();
  }, []);

  return (
    <div className="userDashboard">
      <h2 className="dashboardTitle">User Dashboard</h2>

      <div className="userInfoCard">
        <h3>{[user.firstName, user.lastName].join(" ")}</h3>
        <p>{user.email}</p>
        <p>Status: {user.status}</p>
      </div>
    </div>
  );
}

export default UserDashboard;
