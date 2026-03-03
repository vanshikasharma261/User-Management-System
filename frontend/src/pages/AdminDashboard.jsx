import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditUser from "../Forms/EditUser";
import DeleteUser from "../Forms/DeleteUser";
import CreateUser from "../Forms/CreateUser";
import "./AdminDashboard.css";

function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/`, {
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
      }
      setData(result.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteFlag(true);
  };

  const createUser = async () => {
    setCreateFlag(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <h2>Admin Dashboard</h2>
        <button className="createBtn" onClick={createUser}>
          Create User
        </button>
      </div>

      {createFlag && (
        <CreateUser
          token={token}
          onClose={() => setCreateFlag(false)}
          onCreated={fetchUsers}
        />
      )}

      {selectedUser && !deleteFlag && (
        <EditUser
          user={selectedUser}
          token={token}
          onClose={() => setSelectedUser(null)}
          onUpdated={fetchUsers}
        />
      )}

      {selectedUser && deleteFlag && (
        <DeleteUser
          user={selectedUser}
          token={token}
          onClose={() => {
            setDeleteFlag(false);
            setSelectedUser(null);
          }}
          onUpdate={fetchUsers}
        />
      )}

      <ul className="userList">
        {data.map((user) => (
          <li key={user._id} className="userCard">
            <div className="userInfo">
              {user.firstName} {user.lastName} <br />
              <small>{user.email}</small>
            </div>

            <div className="actionButtons">
              <button className="editBtn" onClick={() => handleUpdate(user)}>
                Edit
              </button>

              <button className="deleteBtn" onClick={() => handleDelete(user)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
