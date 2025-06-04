const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "build")));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// CSRF token endpoint
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Fallback route for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`✅ Frontend server is running on http://localhost:${port}`);
});
