const express = require("express");
const { getDB } = require("../db");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// protect all routes in this router
router.use(adminAuth);

// GET /admin/booking-requests
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const { boothNumber } = req.query;
    const filter = {};

    if (boothNumber) {
      filter.boothNumber = Number(boothNumber);
    }

    const requests = await db
      .collection("booking_requests")
      .find(filter)
      .sort({ createdAt: -1 }) // newest first
      .toArray();

    res.json(requests);
  } catch (err) {
    console.error("Error fetching booking requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
