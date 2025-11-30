// Simple test cases for device REST APIs
import { createApp } from "../app/app.js";
import { prisma } from "../db/prisma.js";
import type { DeviceState } from "@prisma/client";

const app = createApp();

// Helper to make HTTP requests
async function request(method: string, path: string, body?: any) {
  const url = `http://localhost:3000${path}`;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  
  return {
    status: response.status,
    data,
  };
}

// Clean up database before each test
async function cleanup() {
  await prisma.device.deleteMany();
}

// Test: Get all devices (empty)
async function testGetDevicesEmpty() {
  await cleanup();
  
  const result = await request("GET", "/api/devices");
  
  if (result.status === 200 && Array.isArray(result.data) && result.data.length === 0) {
    console.log("✅ GET /api/devices - returns empty array");
  } else {
    console.log("❌ GET /api/devices - failed");
    console.log("   Expected: status 200, empty array");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Create a device
async function testCreateDevice() {
  await cleanup();
  
  const deviceData = {
    name: "iPhone 15",
    brand: "Apple",
    state: "available"
  };
  
  const result = await request("POST", "/api/device", deviceData);
  
  if (result.status === 201 && result.data.name === deviceData.name) {
    console.log("✅ POST /api/device - creates device successfully");
  } else {
    console.log("❌ POST /api/device - failed");
    console.log("   Expected: status 201, device with name", deviceData.name);
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Create device without required fields
async function testCreateDeviceMissingFields() {
  await cleanup();
  
  const result = await request("POST", "/api/device", { name: "Test" });
  
  if (result.status === 400 && result.data.error) {
    console.log("✅ POST /api/device - rejects missing brand");
  } else {
    console.log("❌ POST /api/device - should reject missing fields");
    console.log("   Expected: status 400 with error");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Get device by ID
async function testGetDeviceById() {
  await cleanup();
  
  // Create a device first
  const device = await prisma.device.create({
    data: {
      name: "Samsung Galaxy",
      brand: "Samsung",
      state: "available"
    }
  });
  
  const result = await request("GET", `/api/device/${device.id}`);
  
  if (result.status === 200 && result.data.id === device.id) {
    console.log("✅ GET /api/device/:id - returns device");
  } else {
    console.log("❌ GET /api/device/:id - failed");
    console.log("   Expected: status 200, device with id", device.id);
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Get device by invalid ID
async function testGetDeviceByIdNotFound() {
  await cleanup();
  
  const result = await request("GET", "/api/device/99999");
  
  if (result.status === 404 && result.data.error) {
    console.log("✅ GET /api/device/:id - returns 404 for non-existent device");
  } else {
    console.log("❌ GET /api/device/:id - should return 404");
    console.log("   Expected: status 404 with error");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Update device
async function testUpdateDevice() {
  await cleanup();
  
  // Create a device first
  const device = await prisma.device.create({
    data: {
      name: "Old Name",
      brand: "Old Brand",
      state: "available"
    }
  });
  
  const updateData = {
    name: "New Name",
    brand: "New Brand"
  };
  
  const result = await request("PUT", `/api/device/${device.id}`, updateData);
  
  if (result.status === 200 && result.data.name === "New Name") {
    console.log("✅ PUT /api/device/:id - updates device");
  } else {
    console.log("❌ PUT /api/device/:id - failed");
    console.log("   Expected: status 200, updated device");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Update device with invalid ID
async function testUpdateDeviceNotFound() {
  await cleanup();
  
  const result = await request("PUT", "/api/device/99999", { name: "Test" });
  
  if (result.status === 404 && result.data.error) {
    console.log("✅ PUT /api/device/:id - returns 404 for non-existent device");
  } else {
    console.log("❌ PUT /api/device/:id - should return 404");
    console.log("   Expected: status 404 with error");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Get devices by brand
async function testGetDevicesByBrand() {
  await cleanup();
  
  // Create devices with different brands
  await prisma.device.create({
    data: { name: "iPhone 15", brand: "Apple", state: "available" }
  });
  await prisma.device.create({
    data: { name: "iPhone 14", brand: "Apple", state: "in_use" }
  });
  await prisma.device.create({
    data: { name: "Galaxy S23", brand: "Samsung", state: "available" }
  });
  
  const result = await request("GET", "/api/device/brand/Apple");
  
  if (result.status === 200 && Array.isArray(result.data) && result.data.length === 2) {
    const allApple = result.data.every((d: any) => d.brand === "Apple");
    if (allApple) {
      console.log("✅ GET /api/device/brand/:brand - returns devices by brand");
    } else {
      console.log("❌ GET /api/device/brand/:brand - wrong brand in results");
    }
  } else {
    console.log("❌ GET /api/device/brand/:brand - failed");
    console.log("   Expected: status 200, array with 2 Apple devices");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Get devices by state
async function testGetDevicesByState() {
  await cleanup();
  
  // Create devices with different states
  await prisma.device.create({
    data: { name: "Device 1", brand: "Brand1", state: "available" }
  });
  await prisma.device.create({
    data: { name: "Device 2", brand: "Brand2", state: "available" }
  });
  await prisma.device.create({
    data: { name: "Device 3", brand: "Brand3", state: "in_use" }
  });
  
  const result = await request("GET", "/api/device/state/available");
  
  if (result.status === 200 && Array.isArray(result.data) && result.data.length === 2) {
    const allAvailable = result.data.every((d: any) => d.state === "available");
    if (allAvailable) {
      console.log("✅ GET /api/device/state/:state - returns devices by state");
    } else {
      console.log("❌ GET /api/device/state/:state - wrong state in results");
    }
  } else {
    console.log("❌ GET /api/device/state/:state - failed");
    console.log("   Expected: status 200, array with 2 available devices");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Delete device
async function testDeleteDevice() {
  await cleanup();
  
  // Create a device first
  const device = await prisma.device.create({
    data: {
      name: "To Delete",
      brand: "Brand",
      state: "available"
    }
  });
  
  const result = await request("DELETE", `/api/device/${device.id}`);
  
  if (result.status === 200 && result.data.message) {
    // Verify it's actually deleted
    const check = await prisma.device.findUnique({ where: { id: device.id } });
    if (!check) {
      console.log("✅ DELETE /api/device/:id - deletes device");
    } else {
      console.log("❌ DELETE /api/device/:id - device still exists");
    }
  } else {
    console.log("❌ DELETE /api/device/:id - failed");
    console.log("   Expected: status 200 with message");
    console.log("   Got:", result.status, result.data);
  }
}

// Test: Delete device with invalid ID
async function testDeleteDeviceNotFound() {
  await cleanup();
  
  const result = await request("DELETE", "/api/device/99999");
  
  if (result.status === 404 && result.data.error) {
    console.log("✅ DELETE /api/device/:id - returns 404 for non-existent device");
  } else {
    console.log("❌ DELETE /api/device/:id - should return 404");
    console.log("   Expected: status 404 with error");
    console.log("   Got:", result.status, result.data);
  }
}

// test cannot update createdAt
async function testCannotUpdateCreatedAt() {
  await cleanup();
  
  const result = await request("PUT", "/api/device/1", { createdAt: "2025-01-01" });
  
  if (result.status === 400 && result.data.error) {
    console.log("✅ PUT /api/device/:id - returns 400 for createdAt update");
  }
}

// Run all tests
export async function runDeviceTests() {
  console.log("\n🧪 Running Device API Tests...\n");
  
  try {
    await testGetDevicesEmpty();
    await testCreateDevice();
    await testCreateDeviceMissingFields();
    await testGetDeviceById();
    await testGetDeviceByIdNotFound();
    await testUpdateDevice();
    await testUpdateDeviceNotFound();
    await testGetDevicesByBrand();
    await testGetDevicesByState();
    await testDeleteDevice();
    await testDeleteDeviceNotFound();
    await testCannotUpdateCreatedAt();
    console.log("\n✅ All tests completed!\n");
  } catch (error) {
    console.error("\n❌ Test error:", error);
  } finally {
    await cleanup();
  }
}

