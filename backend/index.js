const express = require("express");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");

const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Routes
app.get("/", (req, res) => {
  res.send("✅ Backend server is running");
});

app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(port, () => {
  console.log(`✅ Backend server is running on http://localhost:${port}`);
});
