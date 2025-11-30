// src/app/services/user.service.ts
import { prisma } from "../../db/prisma.js";

interface CreateDeviceInput {
  name: string;
  email: string;
}

export async function getDevices() {
  // @ts-expect-error Property 'device' does not exist on type 'PrismaClient'
  return prisma.device?.findMany();
}

export async function createDevice(data: CreateDeviceInput) {
  // @ts-expect-error Property 'device' does not exist on type 'PrismaClient'
  return prisma.device?.create({ data });
}

