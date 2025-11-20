const express = require("express");
const multer = require("multer");
const path = require("path");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // uploads folder at project root
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${baseName}-${unique}${ext}`);
  },
});

const upload = multer({ storage });

// POST /admin/upload-logo  (field name: "logo")
router.post("/", adminAuth, upload.single("logo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;

  return res.json({
    success: true,
    url: fileUrl,
  });
});

module.exports = router;
