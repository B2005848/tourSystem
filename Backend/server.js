require("dotenv").config();

const express = require("express");
const mongoose = require("./src/db.config");
const userRoutes = require("./src/routes/usersRoutes");
const shipsRoutes = require("./src/routes/shipsRoutes");
const depotShipsRoutes = require("./src/routes/depotShipsRoutes");
const { errorHandler } = require("./src/middlewares/errorMiddleware");

const app = express();

app.use(express.json());

// Thuyền viên api
app.use("/api/users", userRoutes);

// Tàu thuyền api
app.use("/api/ships", shipsRoutes);

// Depot ships api
app.use("/api/depotships", depotShipsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
