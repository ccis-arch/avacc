import { eq, desc, asc, and, or, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, petOwners, pets, petBreeds, vaccinations, vaccineTypes, vaccinationLocations, vaccineInventory, reorderAlerts, vaccinationSchedules } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Pet Owner queries
export async function createPetOwner(data: typeof petOwners.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(petOwners).values(data);
  return result;
}

export async function getPetOwnerByUserId(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(petOwners).where(eq(petOwners.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getPetOwnerById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(petOwners).where(eq(petOwners.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePetOwner(id: number, data: Partial<typeof petOwners.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(petOwners).set(data).where(eq(petOwners.id, id));
}

// Pet Breed queries
export async function getAllBreeds() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(petBreeds).orderBy(asc(petBreeds.name));
}

export async function createBreed(data: typeof petBreeds.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(petBreeds).values(data);
}

// Pet queries
export async function createPet(data: typeof pets.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(pets).values(data);
}

export async function getPetsByOwnerId(ownerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(pets).where(eq(pets.ownerId, ownerId)).orderBy(asc(pets.name));
}

export async function getPetById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(pets).where(eq(pets.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePet(id: number, data: Partial<typeof pets.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(pets).set(data).where(eq(pets.id, id));
}

export async function getAllPets() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(pets).orderBy(desc(pets.createdAt));
}

// Vaccine Type queries
export async function getAllVaccineTypes() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccineTypes).orderBy(asc(vaccineTypes.name));
}

export async function createVaccineType(data: typeof vaccineTypes.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(vaccineTypes).values(data);
}

export async function getVaccineTypeById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vaccineTypes).where(eq(vaccineTypes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Vaccination queries
export async function createVaccination(data: typeof vaccinations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(vaccinations).values(data);
}

export async function getVaccinationsByPetId(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinations).where(eq(vaccinations.petId, petId)).orderBy(desc(vaccinations.vaccinationDate));
}

export async function getVaccinationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vaccinations).where(eq(vaccinations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateVaccination(id: number, data: Partial<typeof vaccinations.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(vaccinations).set(data).where(eq(vaccinations.id, id));
}

export async function getPendingVaccinations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinations).where(eq(vaccinations.status, 'pending')).orderBy(asc(vaccinations.vaccinationDate));
}

// Vaccination Location queries
export async function createVaccinationLocation(data: typeof vaccinationLocations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(vaccinationLocations).values(data);
}

export async function getAllVaccinationLocations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinationLocations).orderBy(asc(vaccinationLocations.name));
}

export async function getVaccinationLocationById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vaccinationLocations).where(eq(vaccinationLocations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateVaccinationLocation(id: number, data: Partial<typeof vaccinationLocations.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(vaccinationLocations).set(data).where(eq(vaccinationLocations.id, id));
}

// Vaccine Inventory queries
export async function createVaccineInventory(data: typeof vaccineInventory.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(vaccineInventory).values(data);
}

export async function getInventoryByLocationAndVaccine(locationId: number, vaccineTypeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vaccineInventory)
    .where(and(eq(vaccineInventory.locationId, locationId), eq(vaccineInventory.vaccineTypeId, vaccineTypeId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getInventoryByLocation(locationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccineInventory).where(eq(vaccineInventory.locationId, locationId));
}

export async function updateVaccineInventory(id: number, data: Partial<typeof vaccineInventory.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(vaccineInventory).set(data).where(eq(vaccineInventory.id, id));
}

export async function getLowStockInventory() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccineInventory)
    .where(sql`${vaccineInventory.quantityInStock} <= ${vaccineInventory.reorderThreshold}`)
    .orderBy(asc(vaccineInventory.quantityInStock));
}

// Reorder Alert queries
export async function createReorderAlert(data: typeof reorderAlerts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(reorderAlerts).values(data);
}

export async function getActiveReorderAlerts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(reorderAlerts).where(eq(reorderAlerts.status, 'active')).orderBy(desc(reorderAlerts.createdAt));
}

export async function getReorderAlertsByInventoryId(inventoryId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(reorderAlerts).where(eq(reorderAlerts.inventoryId, inventoryId));
}

export async function updateReorderAlert(id: number, data: Partial<typeof reorderAlerts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(reorderAlerts).set(data).where(eq(reorderAlerts.id, id));
}

// Vaccination Schedule queries
export async function createVaccinationSchedule(data: typeof vaccinationSchedules.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(vaccinationSchedules).values(data);
}

export async function getSchedulesByLocationAndDate(locationId: number, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinationSchedules)
    .where(and(
      eq(vaccinationSchedules.locationId, locationId),
      gte(vaccinationSchedules.scheduledDate, startDate),
      lte(vaccinationSchedules.scheduledDate, endDate)
    ))
    .orderBy(asc(vaccinationSchedules.scheduledDate));
}

export async function getSchedulesByPetId(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinationSchedules).where(eq(vaccinationSchedules.petId, petId)).orderBy(asc(vaccinationSchedules.scheduledDate));
}

export async function getScheduleById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vaccinationSchedules).where(eq(vaccinationSchedules.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateVaccinationSchedule(id: number, data: Partial<typeof vaccinationSchedules.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(vaccinationSchedules).set(data).where(eq(vaccinationSchedules.id, id));
}

export async function getScheduledVaccinations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(vaccinationSchedules).where(eq(vaccinationSchedules.status, 'scheduled')).orderBy(asc(vaccinationSchedules.scheduledDate));
}

// Dashboard KPI queries
export async function getTotalScheduledVaccinations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({ count: sql`COUNT(*)` }).from(vaccinationSchedules).where(eq(vaccinationSchedules.status, 'scheduled'));
  return result[0]?.count || 0;
}

export async function getLowVaccinationRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({ count: sql`COUNT(*)` }).from(vaccinations).where(eq(vaccinations.status, 'pending'));
  return result[0]?.count || 0;
}

export async function getPendingVaccinationCount() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({ count: sql`COUNT(*)` }).from(vaccinations).where(eq(vaccinations.status, 'pending'));
  return result[0]?.count || 0;
}


// Comprehensive Pet with Vaccination History queries
export async function getAllPetsWithDetails() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select({
    pet: pets,
    breed: petBreeds,
    owner: petOwners,
  })
    .from(pets)
    .innerJoin(petBreeds, eq(pets.breedId, petBreeds.id))
    .innerJoin(petOwners, eq(pets.ownerId, petOwners.id))
    .orderBy(desc(pets.createdAt));
}

export async function getPetWithVaccinationHistory(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const petData = await db.select({
    pet: pets,
    breed: petBreeds,
    owner: petOwners,
  })
    .from(pets)
    .innerJoin(petBreeds, eq(pets.breedId, petBreeds.id))
    .innerJoin(petOwners, eq(pets.ownerId, petOwners.id))
    .where(eq(pets.id, petId))
    .limit(1);
  
  if (petData.length === 0) return null;
  
  const vaccinationData = await db.select({
    vaccination: vaccinations,
    vaccineType: vaccineTypes,
    location: vaccinationLocations,
  })
    .from(vaccinations)
    .innerJoin(vaccineTypes, eq(vaccinations.vaccineTypeId, vaccineTypes.id))
    .leftJoin(vaccinationLocations, eq(vaccinations.locationId, vaccinationLocations.id))
    .where(eq(vaccinations.petId, petId))
    .orderBy(desc(vaccinations.vaccinationDate));
  
  return {
    ...petData[0],
    vaccinations: vaccinationData,
  };
}

export async function searchPets(query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const searchTerm = `%${query}%`;
  
  return await db.select({
    pet: pets,
    breed: petBreeds,
    owner: petOwners,
  })
    .from(pets)
    .innerJoin(petBreeds, eq(pets.breedId, petBreeds.id))
    .innerJoin(petOwners, eq(pets.ownerId, petOwners.id))
    .where(
      or(
        sql`${pets.name} LIKE ${searchTerm}`,
        sql`${petOwners.firstName} LIKE ${searchTerm}`,
        sql`${petOwners.lastName} LIKE ${searchTerm}`,
        sql`${pets.microchipId} LIKE ${searchTerm}`
      )
    )
    .orderBy(desc(pets.createdAt));
}

export async function getPetsByBreed(breedId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select({
    pet: pets,
    breed: petBreeds,
    owner: petOwners,
  })
    .from(pets)
    .innerJoin(petBreeds, eq(pets.breedId, petBreeds.id))
    .innerJoin(petOwners, eq(pets.ownerId, petOwners.id))
    .where(eq(pets.breedId, breedId))
    .orderBy(asc(pets.name));
}

export async function getPetsBySpecies(species: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select({
    pet: pets,
    breed: petBreeds,
    owner: petOwners,
  })
    .from(pets)
    .innerJoin(petBreeds, eq(pets.breedId, petBreeds.id))
    .innerJoin(petOwners, eq(pets.ownerId, petOwners.id))
    .where(eq(petBreeds.species, species as any))
    .orderBy(asc(pets.name));
}

export async function getVaccinationHistoryWithDetails(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select({
    vaccination: vaccinations,
    vaccineType: vaccineTypes,
    location: vaccinationLocations,
  })
    .from(vaccinations)
    .innerJoin(vaccineTypes, eq(vaccinations.vaccineTypeId, vaccineTypes.id))
    .leftJoin(vaccinationLocations, eq(vaccinations.locationId, vaccinationLocations.id))
    .where(eq(vaccinations.petId, petId))
    .orderBy(desc(vaccinations.vaccinationDate));
}

export async function getUpcomingVaccinationsForPet(petId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const today = new Date();
  
  return await db.select({
    schedule: vaccinationSchedules,
    vaccineType: vaccineTypes,
    location: vaccinationLocations,
  })
    .from(vaccinationSchedules)
    .innerJoin(vaccineTypes, eq(vaccinationSchedules.vaccineTypeId, vaccineTypes.id))
    .innerJoin(vaccinationLocations, eq(vaccinationSchedules.locationId, vaccinationLocations.id))
    .where(
      and(
        eq(vaccinationSchedules.petId, petId),
        gte(vaccinationSchedules.scheduledDate, today),
        eq(vaccinationSchedules.status, 'scheduled')
      )
    )
    .orderBy(asc(vaccinationSchedules.scheduledDate));
}
