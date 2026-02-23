import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, date } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Pet owners - registered users who own pets
 */
export const petOwners = mysqlTable("petOwners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PetOwner = typeof petOwners.$inferSelect;
export type InsertPetOwner = typeof petOwners.$inferInsert;

/**
 * Pet breeds reference table
 */
export const petBreeds = mysqlTable("petBreeds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  species: mysqlEnum("species", ["dog", "cat", "bird", "rabbit", "other"]).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PetBreed = typeof petBreeds.$inferSelect;
export type InsertPetBreed = typeof petBreeds.$inferInsert;

/**
 * Pets - animals registered in the system
 */
export const pets = mysqlTable("pets", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  breedId: int("breedId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  dateOfBirth: date("dateOfBirth"),
  microchipId: varchar("microchipId", { length: 100 }),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pet = typeof pets.$inferSelect;
export type InsertPet = typeof pets.$inferInsert;

/**
 * Vaccine types/categories
 */
export const vaccineTypes = mysqlTable("vaccineTypes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 50 }).notNull(),
  description: text("description"),
  recommendedAgeMonths: int("recommendedAgeMonths"),
  revaccineIntervalMonths: int("revaccineIntervalMonths"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VaccineType = typeof vaccineTypes.$inferSelect;
export type InsertVaccineType = typeof vaccineTypes.$inferInsert;

/**
 * Vaccination records - history of vaccinations per pet
 */
export const vaccinations = mysqlTable("vaccinations", {
  id: int("id").autoincrement().primaryKey(),
  petId: int("petId").notNull(),
  vaccineTypeId: int("vaccineTypeId").notNull(),
  vaccinationDate: date("vaccinationDate").notNull(),
  expiryDate: date("expiryDate"),
  locationId: int("locationId"),
  batchNumber: varchar("batchNumber", { length: 100 }),
  veterinarian: varchar("veterinarian", { length: 100 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["completed", "scheduled", "pending"]).default("completed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertVaccination = typeof vaccinations.$inferInsert;

/**
 * Vaccination locations - clinics/centers where vaccinations are administered
 */
export const vaccinationLocations = mysqlTable("vaccinationLocations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }),
  zipCode: varchar("zipCode", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  operatingHours: text("operatingHours"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VaccinationLocation = typeof vaccinationLocations.$inferSelect;
export type InsertVaccinationLocation = typeof vaccinationLocations.$inferInsert;

/**
 * Vaccine inventory - stock levels per vaccine type per location
 */
export const vaccineInventory = mysqlTable("vaccineInventory", {
  id: int("id").autoincrement().primaryKey(),
  vaccineTypeId: int("vaccineTypeId").notNull(),
  locationId: int("locationId").notNull(),
  quantityInStock: int("quantityInStock").notNull().default(0),
  reorderThreshold: int("reorderThreshold").notNull().default(10),
  reorderQuantity: int("reorderQuantity").notNull().default(50),
  lastRestockedDate: date("lastRestockedDate"),
  expiryDate: date("expiryDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VaccineInventory = typeof vaccineInventory.$inferSelect;
export type InsertVaccineInventory = typeof vaccineInventory.$inferInsert;

/**
 * Reorder alerts - tracks low stock situations
 */
export const reorderAlerts = mysqlTable("reorderAlerts", {
  id: int("id").autoincrement().primaryKey(),
  inventoryId: int("inventoryId").notNull(),
  alertType: mysqlEnum("alertType", ["low_stock", "expired", "expiring_soon"]).notNull(),
  quantity: int("quantity"),
  status: mysqlEnum("status", ["active", "acknowledged", "resolved"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ReorderAlert = typeof reorderAlerts.$inferSelect;
export type InsertReorderAlert = typeof reorderAlerts.$inferInsert;

/**
 * Vaccination schedules - planned vaccinations per location
 */
export const vaccinationSchedules = mysqlTable("vaccinationSchedules", {
  id: int("id").autoincrement().primaryKey(),
  locationId: int("locationId").notNull(),
  petId: int("petId").notNull(),
  vaccineTypeId: int("vaccineTypeId").notNull(),
  scheduledDate: date("scheduledDate").notNull(),
  scheduledTime: varchar("scheduledTime", { length: 10 }),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VaccinationSchedule = typeof vaccinationSchedules.$inferSelect;
export type InsertVaccinationSchedule = typeof vaccinationSchedules.$inferInsert;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  petOwners: many(petOwners),
}));

export const petOwnersRelations = relations(petOwners, ({ one, many }) => ({
  user: one(users, {
    fields: [petOwners.userId],
    references: [users.id],
  }),
  pets: many(pets),
}));

export const petsRelations = relations(pets, ({ one, many }) => ({
  owner: one(petOwners, {
    fields: [pets.ownerId],
    references: [petOwners.id],
  }),
  breed: one(petBreeds, {
    fields: [pets.breedId],
    references: [petBreeds.id],
  }),
  vaccinations: many(vaccinations),
  schedules: many(vaccinationSchedules),
}));

export const petBreedsRelations = relations(petBreeds, ({ many }) => ({
  pets: many(pets),
}));

export const vaccineTypesRelations = relations(vaccineTypes, ({ many }) => ({
  vaccinations: many(vaccinations),
  inventory: many(vaccineInventory),
  schedules: many(vaccinationSchedules),
}));

export const vaccinationsRelations = relations(vaccinations, ({ one }) => ({
  pet: one(pets, {
    fields: [vaccinations.petId],
    references: [pets.id],
  }),
  vaccineType: one(vaccineTypes, {
    fields: [vaccinations.vaccineTypeId],
    references: [vaccineTypes.id],
  }),
  location: one(vaccinationLocations, {
    fields: [vaccinations.locationId],
    references: [vaccinationLocations.id],
  }),
}));

export const vaccinationLocationsRelations = relations(vaccinationLocations, ({ many }) => ({
  vaccinations: many(vaccinations),
  inventory: many(vaccineInventory),
  schedules: many(vaccinationSchedules),
}));

export const vaccineInventoryRelations = relations(vaccineInventory, ({ one, many }) => ({
  vaccineType: one(vaccineTypes, {
    fields: [vaccineInventory.vaccineTypeId],
    references: [vaccineTypes.id],
  }),
  location: one(vaccinationLocations, {
    fields: [vaccineInventory.locationId],
    references: [vaccinationLocations.id],
  }),
  alerts: many(reorderAlerts),
}));

export const reorderAlertsRelations = relations(reorderAlerts, ({ one }) => ({
  inventory: one(vaccineInventory, {
    fields: [reorderAlerts.inventoryId],
    references: [vaccineInventory.id],
  }),
}));

export const vaccinationSchedulesRelations = relations(vaccinationSchedules, ({ one }) => ({
  location: one(vaccinationLocations, {
    fields: [vaccinationSchedules.locationId],
    references: [vaccinationLocations.id],
  }),
  pet: one(pets, {
    fields: [vaccinationSchedules.petId],
    references: [pets.id],
  }),
  vaccineType: one(vaccineTypes, {
    fields: [vaccinationSchedules.vaccineTypeId],
    references: [vaccineTypes.id],
  }),
}));
