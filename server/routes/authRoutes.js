const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authorization = require("../middleware/authorization");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(401).json({ msg: "This email is already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name || "New user", email, hashedPassword]
    );


    const token = jwt.sign(
      { id: newUser.rows[0].id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ user: newUser.rows[0], token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error: Registration failed." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    
    const token = jwt.sign(
      { id: user.rows[0].id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({ user: user.rows[0], token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error: Login failed." });
  }
});

// VERIFY TOKEN AND GET USER INFO
router.get("/verify", authorization, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, username AS name, email FROM users WHERE id = $1",
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;