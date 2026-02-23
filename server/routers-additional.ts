// Additional tRPC procedures for pets list and vaccination history
// These procedures should be added to the appRouter in routers.ts

import { protectedProcedure, publicProcedure } from "./_core/trpc";
import { adminProcedure } from "./routers";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";

export const petsListRouter = {
  getAllWithDetails: adminProcedure
    .query(async () => {
      return await db.getAllPetsWithDetails();
    }),

  getWithVaccinationHistory: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const petData = await db.getPetWithVaccinationHistory(input);
      if (!petData) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Pet not found' });
      }
      
      // Check ownership for non-admin users
      if (ctx.user.role !== 'admin') {
        const owner = await db.getPetOwnerByUserId(ctx.user.id);
        if (!owner || petData.pet.ownerId !== owner.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
        }
      }
      
      return petData;
    }),

  search: publicProcedure
    .input(z.string().min(1))
    .query(async ({ input }) => {
      return await db.searchPets(input);
    }),

  getByBreed: publicProcedure
    .input(z.number())
    .query(async ({ input }) => {
      return await db.getPetsByBreed(input);
    }),

  getBySpecies: publicProcedure
    .input(z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']))
    .query(async ({ input }) => {
      return await db.getPetsBySpecies(input);
    }),
};

export const vaccinationHistoryRouter = {
  getByPetId: protectedProcedure
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
      
      return await db.getVaccinationHistoryWithDetails(input);
    }),

  getUpcoming: protectedProcedure
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
      
      return await db.getUpcomingVaccinationsForPet(input);
    }),
};
