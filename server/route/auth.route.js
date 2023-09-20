const express = require("express");
const { register, login } = require("../controller/auth.contoller");
const authMiddlewear = require('../middleware/auth.middleware')

const router = express.Router();

router.post("/register",register);
router.post("/login", authMiddlewear, login);


module.exports = router;
