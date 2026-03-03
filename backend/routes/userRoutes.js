const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const { createUser, getUser, getUsers, deleteUser, updateUser } = require("../controllers/userController");

router.get(
    "/admin-test",
    authMiddleware,
    roleMiddleware("Admin"),
    (req, res) => {
        res.json({
            message: "Welcome Admin! This route is protected.",
            user: req.user
        });
    }
);


router.post("/", authMiddleware,
    roleMiddleware("Admin"), createUser);

router.get("/", authMiddleware,
    roleMiddleware("Admin"), getUsers);

router.get("/:id", authMiddleware, getUser);

router.delete("/:id", authMiddleware,
    roleMiddleware("Admin"), deleteUser);

router.put("/:id", authMiddleware,
    roleMiddleware("Admin"), updateUser);

module.exports = router;
