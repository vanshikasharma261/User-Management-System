import { useNavigate } from "react-router-dom";
import styles from "./DeleteUser.module.css";
import { useDispatch } from "react-redux";
import { fetchUsers } from "../redux/userslice";

function DeleteUser({ user, token, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        if (response.status == 401) {
          navigate("/");
        }
        alert("Something went wrong!");
        return;
      }

      const result = await response.json();
      console.log(result);

      dispatch(fetchUsers());
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <form onSubmit={handleSubmit}>
          <h3>Delete User</h3>
          <p>Are you sure you want to delete this user?</p>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.yesBtn}>
              Yes
            </button>

            <button type="button" onClick={onClose} className={styles.noBtn}>
              No
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DeleteUser;
