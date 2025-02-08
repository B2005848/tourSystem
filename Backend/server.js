require("dotenv").config();

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("./src/db.config");
const userRoutes = require("./src/routes/usersRoutes");
const { errorHandler } = require("./src/middlewares/errorMiddleware");

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
