const express = require("express");
const cors = require("cors");
const internshipRoutes = require("./routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Internship Records API is running",
    endpoints: {
      health: "GET /health",
      internships: "/api/internships"
    }
  });
});

app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok" });
});

app.use("/api/internships", internshipRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "ROUTE_NOT_FOUND", message: "The requested route does not exist" }
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      error: { code: "INVALID_JSON", message: "Request body contains invalid JSON" }
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: {
      code: status === 400 ? "VALIDATION_ERROR" : "INTERNAL_SERVER_ERROR",
      message: status === 400 ? err.message : "An unexpected server error occurred",
      ...(err.details ? { details: err.details } : {})
    }
  });
});

module.exports = app;