import { useState } from "react";
import styles from "./EditUser.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUsers, updateUser } from "../redux/userslice";

function EditUser({ user, token, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [firstName, setFirstName] = useState(user.firstName);
  const [email, setEmail] = useState(user.email);
  const st = user.status == "Active" ? true : false;
  const [status, setStatus] = useState(st);
  const [errors, setErrors] = useState({});
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    let newErrors = {};
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length == 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    let data = {
      firstName,
      email,
      status,
      id: user._id,
    };
    let result = await dispatch(updateUser(data));
    if (result.meta.requestStatus == "fulfilled") {
      onClose();
    } else {
      if (result.payload.message == "validation failed") {
        setErrors(result.payload.data);
      } else if (result.payload.status == 401) {
        navigate("/");
      } else if (result.payload.status == 404) {
        alert("User Not Found");
      } else {
        alert("Something went wrong");
        onClose();
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h3>Edit User</h3>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>First Name:</label>
            <input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors({ ...errors, firstName: "" });
              }}
            />
            {errors.firstName && (
              <p className={styles.error}>{errors.firstName}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={`${styles.formGroup} ${styles.statusGroup}`}>
            <label>Status:</label>

            <div className={styles.statusToggle}>
              <input
                type="checkbox"
                checked={status}
                onChange={(e) => setStatus(e.target.checked)}
              />
              <span>{status ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.updateBtn}>
              Update
            </button>

            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
