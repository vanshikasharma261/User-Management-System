import { Outlet, useNavigate } from "react-router-dom";

function MainLayout() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.setItem("token", "");
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
