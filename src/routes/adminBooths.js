const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// protect all routes in this router
router.use(adminAuth);

// GET /admin/booths  -> list all booths
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
        console.error("Error fetching admin booths:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /admin/booths  -> create new booth
router.post("/", async (req, res) => {
    try {
        const {
            number,
            category,
            status,
            companyName,
            companyWebsite,
            companyLogoUrl,
            companyShortText,
            contactName,
            contactPhone,
            contactEmail,
            position,
        } = req.body;

        if (number == null || !category) {
            return res
                .status(400)
                .json({ error: "number and category are required" });
        }

        const db = getDB();
        const now = new Date();

        const doc = {
            number: Number(number),
            category,
            status: status || "empty",
            createdAt: now,
            updatedAt: now,
        };

        // optional fields
        if (companyName) doc.companyName = companyName;
        if (companyWebsite) doc.companyWebsite = companyWebsite;
        if (companyLogoUrl) doc.companyLogoUrl = companyLogoUrl;
        if (companyShortText) doc.companyShortText = companyShortText;
        if (contactName) doc.contactName = contactName;
        if (contactPhone) doc.contactPhone = contactPhone;
        if (contactEmail) doc.contactEmail = contactEmail;
        if (position && typeof position === "object") {
            doc.position = {
                x: position.x,
                y: position.y,
                width: position.width,
                height: position.height,
            };
        }

        const result = await db.collection("booths").insertOne(doc);

        res.status(201).json({ _id: result.insertedId, ...doc });
    } catch (err) {
        console.error("Error creating booth:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// PATCH /admin/booths/:id  -> update booth
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return res.status(400).json({ error: "Invalid booth id" });
        }

        const {
            number,
            category,
            status,
            companyName,
            companyWebsite,
            companyLogoUrl,
            companyShortText,
            contactName,
            contactPhone,
            contactEmail,
            position,
        } = req.body;

        const update = { $set: { updatedAt: new Date() } };

        if (number != null) update.$set.number = Number(number);
        if (category) update.$set.category = category;
        if (status) update.$set.status = status;

        if (companyName !== undefined) update.$set.companyName = companyName;
        if (companyWebsite !== undefined)
            update.$set.companyWebsite = companyWebsite;
        if (companyLogoUrl !== undefined)
            update.$set.companyLogoUrl = companyLogoUrl;
        if (companyShortText !== undefined)
            update.$set.companyShortText = companyShortText;

        if (contactName !== undefined) update.$set.contactName = contactName;
        if (contactPhone !== undefined) update.$set.contactPhone = contactPhone;
        if (contactEmail !== undefined) update.$set.contactEmail = contactEmail;

        if (position !== undefined) {
            if (position === null) {
                update.$unset = { ...(update.$unset || {}), position: "" };
            } else {
                update.$set.position = {
                    x: position.x,
                    y: position.y,
                    width: position.width,
                    height: position.height,
                };
            }
        }

        const db = getDB();

        // Prefer matching by booth number if provided, otherwise by _id
        const filter =
            number != null ? { number: Number(number) } : { _id: objectId };

        // 1) Update the doc
        const updateResult = await db.collection("booths").updateOne(filter, update);

        if (updateResult.matchedCount === 0) {
            // nothing matched -> truly not found
            return res.status(404).json({ error: "Booth not found" });
        }

        // 2) Read the updated doc and return it
        const updatedBooth = await db.collection("booths").findOne(filter);

        return res.json(updatedBooth);
    } catch (err) {
        console.error("Error updating booth:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});


// DELETE /admin/booths/:id  -> delete booth
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch {
            return res.status(400).json({ error: "Invalid booth id" });
        }

        const db = getDB();
        const result = await db
            .collection("booths")
            .deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Booth not found" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("Error deleting booth:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
