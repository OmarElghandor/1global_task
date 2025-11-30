// src/app/routes/index.ts
import { Router } from "express";
import { deviceRouter } from "./device.routes.js";

export const router = Router();

// group routes by resource
router.use("/devices", deviceRouter);
