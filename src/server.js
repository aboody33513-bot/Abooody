const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const { initDbAndMigrations } = require("./models/db");
const routesIndex = require("./routes/index");
const routesClients = require("./routes/clients");
const routesBatches = require("./routes/batches");
const routesFinances = require("./routes/finances");
const routesReports = require("./routes/reports");
const routesImport = require("./routes/import");
const routesBackup = require("./routes/backup");

const app = express();

// init DB
initDbAndMigrations().then(() => {
  console.log("Database ready");
}).catch(err => {
  console.error("DB init failed", err);
  process.exit(1);
});

// middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// views & static
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/bootstrap", express.static(path.join(__dirname, "..", "node_modules", "bootstrap", "dist")));
app.use("/chartjs", express.static(path.join(__dirname, "..", "node_modules", "chart.js", "dist")));

// routes (no authentication)
app.use("/", routesIndex);
app.use("/clients", routesClients);
app.use("/batches", routesBatches);
app.use("/finances", routesFinances);
app.use("/reports", routesReports);
app.use("/import", routesImport);
app.use("/backup", routesBackup);

// 404
app.use((req,res) => {
  res.status(404).render("404", { title: "غير موجود" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("حدث خطأ داخلي");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
