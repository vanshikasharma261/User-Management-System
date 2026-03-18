import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logOut } from "../redux/authslice";

function MainLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <h2>UMS - User Management System</h2>
        <button onClick={handleLogOut}>LogOut</button>
      </nav>

      <div className="page-container">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
