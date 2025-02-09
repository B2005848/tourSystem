const Account = require("../models/accountManagerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate access token
const generateAccessToken = (account) => {
  return jwt.sign(
    { id: account._id, username: account.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// Generate refresh token
const generateRefreshToken = (account) => {
  return jwt.sign(
    { id: account._id, username: account.username },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Create a new account
const createAccount = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the username already exists
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new account
    const account = new Account({ username, passwordHash, salt });
    await account.save();
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check login
const checkLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the account by username
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, account.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(account);
    const refreshToken = generateRefreshToken(account);

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const account = await Account.findById(decoded.id);
    if (!account) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(account);
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = { createAccount, checkLogin, refreshToken };
