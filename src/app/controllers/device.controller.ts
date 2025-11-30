// src/app/controllers/user.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as deviceService from "../services/device.service.js";

export async function getDevices(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await deviceService.getDevices();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function createDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "name and email are required" });
    }

    const device = await deviceService.createDevice({ name, email });
    res.status(201).json(device);
  } catch (err: any) {
    // Example of translating Prisma error in controller
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Email already exists" });
    }
    next(err);
  }
}
