const express = require("express");
const { getDB } = require("../db");

const router = express.Router();

// GET /booths  -> list all booths sorted by number
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const booths = await db
      .collection("booths")
      .find({})
      .sort({ number: 1 })
      .toArray();

    res.json(booths);
  } catch (err) {
    console.error("Error fetching booths:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
