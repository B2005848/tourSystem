require("dotenv").config();

const express = require("express");
const mongoose = require("./src/db.config");
const cors = require("cors");
const userRoutes = require("./src/routes/usersRoutes");
const shipsRoutes = require("./src/routes/shipsRoutes");
const depotShipsRoutes = require("./src/routes/depotShipsRoutes");
const accountManagerRoutes = require("./src/routes/accountManagerRoutes");
const scheduleRoutes = require("./src/routes/scheduleRoutes");
const { errorHandler } = require("./src/middlewares/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Thuyền viên api
app.use("/api/users", userRoutes);

// Tàu thuyền api
app.use("/api/ships", shipsRoutes);

// Depot ships api
app.use("/api/depotships", depotShipsRoutes);

// Account manager api
app.use("/api/accounts", accountManagerRoutes);

// Schedule api
app.use("/api/schedules", scheduleRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
