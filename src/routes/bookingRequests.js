const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

// POST /booking-requests
// Body: { boothNumber, boothName }
router.post("/", async (req, res) => {
  try {
    const { boothNumber, boothName } = req.body;

    if (!boothNumber || !boothName) {
      return res
        .status(400)
        .json({ error: "boothNumber and boothName are required" });
    }

    const db = getDB();

    // Optional: ensure booth exists
    const booth = await db
      .collection("booths")
      .findOne({ number: Number(boothNumber) });

    if (!booth) {
      return res.status(404).json({ error: "Booth not found" });
    }

    // Log the request (minimal info for now)
    await db.collection("booking_requests").insertOne({
      boothNumber: Number(boothNumber),
      boothName,
      createdAt: new Date(),
    });

    const baseUrl = process.env.GOOGLE_FORM_BASE_URL;

    // Build redirect URL with simple query params
    const redirectUrl =
      baseUrl +
      `?boothNumber=${encodeURIComponent(
        boothNumber
      )}&boothName=${encodeURIComponent(boothName)}`;

    return res.json({
      success: true,
      redirectUrl,
    });
  } catch (err) {
    console.error("Error creating booking request:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
