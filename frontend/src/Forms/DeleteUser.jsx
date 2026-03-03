import { useNavigate } from "react-router-dom";
import styles from "./DeleteUser.module.css";

function DeleteUser({ user, token, onClose, onUpdate }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (!response.ok) {
        if (response.status == 401) {
          navigate("/");
        }
        alert("Something went wrong!");
        return;
      }

      await response.json();

      onUpdate();
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
