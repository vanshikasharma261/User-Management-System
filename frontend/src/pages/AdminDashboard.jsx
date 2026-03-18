import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditUser from "../Forms/EditUser";
import DeleteUser from "../Forms/DeleteUser";
import CreateUser from "../Forms/CreateUser";
import "./AdminDashboard.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../redux/userslice";

function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const error = useSelector((state) => state.user.error);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

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
    async function fetchData() {
      let result = await dispatch(fetchUsers());
      if (result.payload.status == 401) {
        navigate("/");
      }
      console.log("Data in fetch user is: ", result);
    }
    fetchData();
  }, []);

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <h2>Admin Dashboard</h2>
        <button className="createBtn" onClick={createUser}>
          Create User
        </button>
      </div>

      {createFlag && <CreateUser onClose={() => setCreateFlag(false)} />}

      {selectedUser && !deleteFlag && (
        <EditUser
          user={selectedUser}
          token={token}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {selectedUser && deleteFlag && (
        <DeleteUser
          user={selectedUser}
          onClose={() => {
            setDeleteFlag(false);
            setSelectedUser(null);
          }}
        />
      )}

      <ul className="userList">
        {users.map((user) => (
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
