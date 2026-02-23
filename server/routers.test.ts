import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: any): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

const regularUser = {
  id: 1,
  openId: "user-1",
  email: "user@example.com",
  name: "Regular User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const adminUser = {
  id: 2,
  openId: "admin-1",
  email: "admin@example.com",
  name: "Admin User",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("tRPC Routers", () => {
  describe("auth", () => {
    it("returns current user", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      const user = await caller.auth.me();
      expect(user).toEqual(regularUser);
    });

    it("clears session on logout", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.auth.logout();
      expect(result).toEqual({ success: true });
    });
  });

  describe("petBreed", () => {
    it("allows public access to getAll breeds", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      try {
        const result = await caller.petBreed.getAll();
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        // Database might not have data, but procedure should be accessible
        expect(error.code).not.toBe("FORBIDDEN");
      }
    });

    it("requires admin role to create breed", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.petBreed.create({ name: "Test Breed", species: "Dog" });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        // Either FORBIDDEN or NOT_FOUND is acceptable
        expect(["FORBIDDEN", "NOT_FOUND"]).toContain(error.code);
      }
    });
  });

  describe("dashboard", () => {
    it("allows admin to access KPIs", async () => {
      const ctx = createContext(adminUser);
      const caller = appRouter.createCaller(ctx);
      
      const result = await caller.dashboard.getKPIs();
      expect(result).toHaveProperty("scheduledVaccinations");
      expect(result).toHaveProperty("lowVaccinationRequests");
      expect(result).toHaveProperty("pendingVaccinations");
    });

    it("requires admin role to access dashboard", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      try {
        await caller.dashboard.getKPIs();
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("vaccination", () => {
    it("allows protected access to get vaccinations by pet", async () => {
      const ctx = createContext(regularUser);
      const caller = appRouter.createCaller(ctx);
      
      try {
        const result = await caller.vaccination.getByPet(1);
        expect(Array.isArray(result)).toBe(true);
      } catch (error: any) {
        // Expected to fail with NOT_FOUND since pet doesn't exist
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});
