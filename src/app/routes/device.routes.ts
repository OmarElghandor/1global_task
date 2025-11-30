// src/app/routes/user.routes.ts
import { Router } from "express";
import { getDevices, createDevice } from "../controllers/device.controller.js";

export const deviceRouter = Router();

deviceRouter.get("/", getDevices);
deviceRouter.post("/", createDevice);
