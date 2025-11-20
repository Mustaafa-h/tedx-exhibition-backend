require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const boothsRouter = require("./routes/booths");
const bookingRequestsRouter = require("./routes/bookingRequests");
const adminAuth = require("./middleware/adminAuth");
const adminBoothsRouter = require("./routes/adminBooths");
const adminUploadRouter = require("./routes/adminUpload");
const adminBookingRequestsRouter = require("./routes/adminBookingRequests");
const cors = require("cors");



const { connectToDB } = require("./db");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "*", // for now allow all; we can tighten later
  })
);


// Serve uploaded logos
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"))
);


// Simple health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Admin test route
app.get("/admin/test", adminAuth, (req, res) => {
  res.json({ ok: true, message: "Admin access granted" });
});

app.use("/admin/booths", adminBoothsRouter);

// Admin booking requests (protected)
app.use("/admin/booking-requests", adminBookingRequestsRouter);



// (Later we will plug routes here, e.g. app.use("/booths", boothsRouter))

app.use("/booths", boothsRouter);
app.use("/booking-requests", bookingRequestsRouter);

// Admin upload logo
app.use("/admin/upload-logo", adminUploadRouter);




// Start server after DB connection
async function start() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
