// src/app/services/user.service.ts
import { prisma } from "../../db/prisma.js";
import type { DeviceState } from "@prisma/client";

interface CreateDeviceInput {
  name: string;
  brand: string;
  state?: DeviceState;
}

interface UpdateDeviceInput {
  name?: string;
  brand?: string;
  state?: DeviceState;
}

export async function getDevices() {
  return prisma.device.findMany();
}

export async function createDevice(data: CreateDeviceInput) {
  console.log("Creating device with data:", data);
  try {
    const result = await prisma.device.create({ data });
    console.log("Device created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
}


// • Create a new device.
export async function updateDevice(id: number, data: UpdateDeviceInput) {
  return prisma.device.update({ where: { id }, data });
}
export async function getDevicesByBrand(brand: string) {
  return prisma.device.findMany({ where: { brand } });
}

export async function getDevicesByState(state: DeviceState | string) {
  return prisma.device.findMany({ where: { state: state as DeviceState } });
}

export async function deleteDevice(id: number) {
  return prisma.device.delete({ where: { id } });
}



// getDeviceById
export async function getDeviceById(id: number) {
  return prisma.device.findUnique({ where: { id } });
}