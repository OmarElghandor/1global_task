// src/app/controllers/user.controller.ts
import type { Request, Response, NextFunction } from "express";
import * as deviceService from "../services/device.service.js";


/**
 * Device Controller
 * 
 * This controller handles the business logic for the device resource.
 * It interacts with the device service to perform CRUD operations on the device resource.
 * It also handles the validation of the request body and the response body.
 * It also handles the error handling and the logging of the request and response.
 * It also handles the authentication and authorization of the request.
 * It also handles the pagination of the request.
 * It also handles the sorting of the request.
 */


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
    const { name, brand, state } = req.body;

    if (!name || !brand) {
      return res.status(400).json({ error: "name and brand are required" });
    }

    const device = await deviceService.createDevice({ name, brand, state });
    res.status(201).json(device);
  } catch (err: any) {
    // Example of translating Prisma error in controller
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Device already exists" });
    }
    next(err);
  }
}



// • Create a new device.

export async function updateDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, brand, state } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Device id is required" });
    }


    // Reject any attempt to update createdAt
    if ('createdAt' in req.body) {
      return res.status(400).json({ error: "createdAt cannot be updated" });
    }

    const deviceId = parseInt(id, 10);
    if (isNaN(deviceId)) {
      return res.status(400).json({ error: "Device id must be a number" });
    }

    if (!name && !brand && !state) {
      return res.status(400).json({ error: "At least one field (name, brand, state) must be provided" });
    }

    const updateData: { name?: string; brand?: string; state?: string } = {};
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (state) updateData.state = state;

    // Type assertion: state comes as string from request but service expects DeviceState enum
    const device = await deviceService.updateDevice(deviceId, updateData as { name?: string; brand?: string; state?: import("@prisma/client").DeviceState });
    res.json(device);
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Device not found" });
    }
    next(err);
  }
}


// • Fully and/or par:ally update an exis:ng device.

export async function getDeviceById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Device id is required" });
    }
    
    const deviceId = parseInt(id, 10);
    if (isNaN(deviceId)) {
      return res.status(400).json({ error: "Device id must be a number" });
    }
    
    const device = await deviceService.getDeviceById(deviceId);
    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }
    res.json(device);
  } catch (err) {
    next(err);
  }
}





// • Fetch a single device.

export async function getDevicesByBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const { brand } = req.params;
    if (!brand) {
      return res.status(400).json({ error: "Brand is required" });
    }
    const devices = await deviceService.getDevicesByBrand(brand);
    res.json(devices);
  } catch (err) {
    next(err);
  }
}


export async function getDevicesByState(req: Request, res: Response, next: NextFunction) {
  try {
    const { state } = req.params;
    if (!state) {
      return res.status(400).json({ error: "State is required" });
    }
    const devices = await deviceService.getDevicesByState(state);
    res.json(devices);
  } catch (err) {
    next(err);
  }
}

export async function deleteDevice(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Device id is required" });
    }

    const deviceId = parseInt(id, 10);
    if (isNaN(deviceId)) {
      return res.status(400).json({ error: "Device id must be a number" });
    }

    await deviceService.deleteDevice(deviceId);
    res.json({ message: "Device deleted successfully" });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Device not found" });
    }
    next(err);
  }
}


