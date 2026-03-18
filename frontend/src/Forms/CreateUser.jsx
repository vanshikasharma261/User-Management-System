import { useState } from "react";
import styles from "./CreateUser.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../redux/userslice";

function CreateUser({ onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    role: "User",
    age: "",
    status: true,
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = "Valid age required";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "phone number is required";
    }
    if (!formData.gender.trim()) {
      newErrors.gender = "gender is required";
    }
    if (!formData.street.trim()) {
      newErrors.street = "street is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "city is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "state is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "country is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "zip code is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    let result = await dispatch(createUser(formData));
    if (result.meta.requestStatus == "fulfilled") {
      onClose();
    } else {
      if (result.payload.message == "Validation errors") {
        setErrors(result.payload.data);
      } else if (result.payload.status == 401) {
        navigate("/");
      } else {
        alert("Something Went Wrong on Server Side");
        onClose();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Create User</h3>

        <form onSubmit={handleSubmit} noValidate>
          <input
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          {errors.firstName && (
            <p className={styles.error}>{errors.firstName}</p>
          )}
          <input
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className={styles.error}>{errors.confirmPassword}</p>
          )}

          <input
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <input type="date" name="dateOfBirth" onChange={handleChange} />
          {errors.dateOfBirth && (
            <p className={styles.error}>{errors.dateOfBirth}</p>
          )}

          {/* Gender */}
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                onChange={handleChange}
              />
              Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                onChange={handleChange}
              />
              Female
            </label>
            {errors.gender && <p className={styles.error}>{errors.gender}</p>}
          </div>

          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
          />
          {errors.age && <p className={styles.error}>{errors.age}</p>}
          <div className={styles.checkboxGroup}>
            <label>Active</label>
            <input
              type="checkbox"
              name="status"
              checked={formData.status}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <input name="street" placeholder="Street" onChange={handleChange} />
          {errors.street && <p className={styles.error}>{errors.street}</p>}
          <input name="city" placeholder="City" onChange={handleChange} />
          {errors.city && <p className={styles.error}>{errors.city}</p>}
          <input name="state" placeholder="State" onChange={handleChange} />
          {errors.state && <p className={styles.error}>{errors.state}</p>}
          <input name="country" placeholder="Country" onChange={handleChange} />
          {errors.country && <p className={styles.error}>{errors.country}</p>}
          <input
            name="zipCode"
            placeholder="Zip Code"
            onChange={handleChange}
          />
          {errors.zipCode && <p className={styles.error}>{errors.zipCode}</p>}

          <div className={styles.buttonGroup}>
            <button type="submit" id={styles.submit}>
              Create
            </button>
            <button type="button" id={styles.cancel} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
