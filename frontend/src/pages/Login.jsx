import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authslice";

function Login() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errrors, setErrors] = useState([]);

  const validate = () => {
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length == 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const result = await dispatch(loginUser({ email, password }));
    // console.log("Result from loginUSer is: ", result);
    if (result.meta.requestStatus === "fulfilled") {
      const role = result.payload.role;
      if (role == "Admin") {
        navigate("/admin");
      }
      if (role == "User") {
        navigate("/user");
      }
    } else {
      if (result.payload?.message == "validation failed") {
        setErrors(result.payload.data);
      }
      return;
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} noValidate>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errrors.email && <p className="error">{errrors.email}</p>}

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errrors.password && <p className="error">{errrors.password}</p>}

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
