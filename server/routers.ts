import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

// Helper to create admin-only procedure
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Type for location creation with optional coordinates
type LocationInput = {
  name: string;
  address: string;
  city: string;
  state?: string | null;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  operatingHours?: string | null;
};

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Pet Owner procedures
  petOwner: router({
    create: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getPetOwnerByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Pet owner profile already exists' });
        }
        
        await db.createPetOwner({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true }
      }),

    getProfile: protectedProcedure
      .query(async ({ ctx }) => {
        const owner = await db.getPetOwnerByUserId(ctx.user.id);
        return owner;
      }),

    update: protectedProcedure
      .input(z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const owner = await db.getPetOwnerByUserId(ctx.user.id);
        if (!owner) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet owner profile not found' });
        }
        
        await db.updatePetOwner(owner.id, input);
        return { success: true };
      }),

    getAllOwners: adminProcedure
      .query(async () => {
        // This would need a getAllPetOwners function in db.ts
        return [];
      }),
  }),

  pet: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        breedId: z.number(),
        dateOfBirth: z.date().optional(),
        microchipId: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        let owner = await db.getPetOwnerByUserId(ctx.user.id);
        
        // Auto-create pet owner profile if it doesn't exist
        if (!owner) {
          const nameParts = (ctx.user.name || 'User').split(' ');
          await db.createPetOwner({
            userId: ctx.user.id,
            firstName: nameParts[0] || 'User',
            lastName: nameParts[1] || '',
            email: ctx.user.email || '',
          });
          owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create pet owner profile' });
          }
        }
        
        await db.createPet({
          ownerId: owner.id,
          ...input,
        });
        return { success: true }
      }),

    getMyPets: protectedProcedure
      .query(async ({ ctx }) => {
        const owner = await db.getPetOwnerByUserId(ctx.user.id);
        if (!owner) return [];
        
        return await db.getPetsByOwnerId(owner.id);
      }),

    getPetById: protectedProcedure
      .input(z.number())
      .query(async ({ ctx, input }) => {
        const pet = await db.getPetById(input);
        if (!pet) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
        }
        
        // Check ownership for non-admin users
        if (ctx.user.role !== 'admin') {
          const owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner || pet.ownerId !== owner.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        return pet;
      }),

    update: protectedProcedure
      .input(z.object({
        petId: z.number(),
        name: z.string().min(1).optional(),
        breedId: z.number().optional(),
        dateOfBirth: z.date().optional(),
        microchipId: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const pet = await db.getPetById(input.petId);
        if (!pet) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
        }
        
        if (ctx.user.role !== 'admin') {
          const owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner || pet.ownerId !== owner.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        const { petId, ...updateData } = input;
        await db.updatePet(petId, updateData);
        return { success: true };
      }),

    getAllPets: adminProcedure
      .query(async () => {
        return await db.getAllPets();
      }),
  }),

  breed: router({
    getAll: publicProcedure
      .query(async () => {
        return await db.getAllBreeds();
      }),
  }),

  vaccination: router({
    create: protectedProcedure
      .input(z.object({
        petId: z.number(),
        vaccineTypeId: z.number(),
        vaccinationDate: z.date(),
        status: z.enum(['completed', 'pending', 'scheduled']).optional(),
        veterinarian: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const pet = await db.getPetById(input.petId);
        if (!pet) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
        }
        
        if (ctx.user.role !== 'admin') {
          const owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner || pet.ownerId !== owner.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        await db.createVaccination({
          petId: input.petId,
          vaccineTypeId: input.vaccineTypeId,
          vaccinationDate: input.vaccinationDate,
          status: input.status || 'completed',
          veterinarian: input.veterinarian,
          notes: input.notes,
        });
        
        return { success: true };
      }),

    getByPet: protectedProcedure
      .input(z.number())
      .query(async ({ ctx, input }) => {
        const pet = await db.getPetById(input);
        if (!pet) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
        }
        
        if (ctx.user.role !== 'admin') {
          const owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner || pet.ownerId !== owner.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        return await db.getVaccinationsByPetId(input);
      }),

    getAll: adminProcedure
      .query(async () => {
        return (await db.getPendingVaccinations()) || [];
      }),
  }),

  vaccineType: router({
    getAll: publicProcedure
      .query(async () => {
        return await db.getAllVaccineTypes();
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        category: z.string().min(1),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createVaccineType(input);
        return { success: true };
      }),
  }),

  location: router({
    getAll: publicProcedure
      .query(async () => {
        return await db.getAllVaccinationLocations();
      }),

    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        operatingHours: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createVaccinationLocation(input);
        return { success: true };
      }),
  }),

  inventory: router({
    getAll: adminProcedure
      .query(async () => {
        return [];
      }),

    create: adminProcedure
      .input(z.object({
        vaccineTypeId: z.number(),
        locationId: z.number(),
        quantity: z.number().min(0),
        reorderThreshold: z.number().min(0),
      }))
      .mutation(async ({ input }) => {
        await db.createVaccineInventory(input);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        inventoryId: z.number(),
        quantity: z.number().min(0).optional(),
        reorderThreshold: z.number().min(0).optional(),
      }))
      .mutation(async ({ input }) => {
        const { inventoryId, ...updateData } = input;
        await db.updateVaccineInventory(inventoryId, updateData);
        return { success: true };
      }),
  }),

  reorderAlert: router({
    getAll: adminProcedure
      .query(async () => {
        return await db.getActiveReorderAlerts();
      }),
  }),

  schedule: router({
    create: adminProcedure
      .input(z.object({
        petId: z.number(),
        vaccineTypeId: z.number(),
        locationId: z.number(),
        scheduledDate: z.date(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createVaccinationSchedule(input);
        return { success: true };
      }),

    getAll: adminProcedure
      .query(async () => {
        return await db.getScheduledVaccinations();
      }),

    getByLocation: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const now = new Date();
        const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return await db.getSchedulesByLocationAndDate(input, now, nextMonth);
      }),
  }),

  dashboard: router({
    getKPIs: adminProcedure
      .query(async () => {
        const scheduled = await db.getTotalScheduledVaccinations();
        const pending = await db.getPendingVaccinationCount();
        const lowRequests = await db.getLowVaccinationRequests();
        
        return {
          scheduledVaccinations: scheduled || 0,
          pendingVaccinations: pending || 0,
          lowVaccinationRequests: 0,
        };
      }),

    getStockLevels: adminProcedure
      .query(async () => {
        return await db.getAllPets();
      }),

    getReorderAlerts: adminProcedure
      .query(async () => {
        return await db.getActiveReorderAlerts();
      }),
  }),

  petsList: router({
    getAll: adminProcedure
      .query(async () => {
        return await db.getAllPetsWithDetails();
      }),

    getWithVaccinations: adminProcedure
      .input(z.object({
        search: z.string().optional(),
        species: z.string().optional(),
      }))
      .query(async ({ input }) => {
        if (input.search) {
          return await db.searchPets(input.search);
        }
        if (input.species) {
          return await db.getPetsBySpecies(input.species);
        }
        return await db.getAllPetsWithDetails();
      }),
  }),

  vaccinationHistory: router({
    getByPet: protectedProcedure
      .input(z.number())
      .query(async ({ ctx, input }) => {
        const pet = await db.getPetById(input);
        if (!pet) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
        }
        
        if (ctx.user.role !== 'admin') {
          const owner = await db.getPetOwnerByUserId(ctx.user.id);
          if (!owner || pet.ownerId !== owner.id) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
          }
        }
        
        return await db.getVaccinationsByPetId(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;

