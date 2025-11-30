// src/app/routes/user.routes.ts
import { Router } from "express";
import * as deviceContoller from "../controllers/device.controller.js";

export const deviceRouter = Router();

deviceRouter.get("/devices", deviceContoller.getDevices);
deviceRouter.post("/device", deviceContoller.createDevice);

deviceRouter.put("/device/:id", deviceContoller.updateDevice);
deviceRouter.get("/device/:id", deviceContoller.getDeviceById);
deviceRouter.get("/device/brand/:brand", deviceContoller.getDevicesByBrand);
deviceRouter.get("/device/state/:state", deviceContoller.getDevicesByState);
deviceRouter.delete("/device/:id", deviceContoller.deleteDevice);
