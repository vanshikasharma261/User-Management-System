import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.message);
        if (result.message == "validation failed") {
          setErrors(result.data);
        }
        return;
      }

      // Save token
      localStorage.setItem("token", result.token);

      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const role = decoded.role;

      console.log(decoded.role);

      // Redirect based on role
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.log(error);
      alert("Login failed");
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
