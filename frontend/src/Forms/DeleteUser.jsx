import { useNavigate } from "react-router-dom";
import styles from "./DeleteUser.module.css";
import { useDispatch } from "react-redux";
import { deleteUser } from "../redux/userslice";

function DeleteUser({ user, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let result = await dispatch(deleteUser(user._id));
    console.log(result);
    if (result.meta.requestStatus == "fulfilled") {
      onClose();
    } else {
      if (result.payload.status == 401) {
        navigate("/");
      } else {
        alert("Something went wrong");
        onClose();
      }
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
