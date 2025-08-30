// routes/seaLevelRoutes.js
import express from "express";
import { getSeaLevel } from "../controllers/seaLevelController.js";

const router = express.Router();

// GET /api/sea-level
router.get("/sea-level", getSeaLevel);

module.exports = router;
