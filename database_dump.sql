-- ============================================================================
-- Animal Bite Monitoring Tool - Complete Database Dump
-- Database: animal_bite_monitoring_tool
-- Generated: 2026-02-11
-- ============================================================================

-- ============================================================================
-- TABLE: users
-- Description: Core authentication table with role-based access control
-- ============================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) NOT NULL UNIQUE,
  `name` text,
  `email` varchar(320),
  `loginMethod` varchar(64),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `openId_unique` (`openId`),
  INDEX `role_idx` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample admin user
INSERT INTO `users` (`openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`) VALUES
('admin-001', 'Dr. Sarah Johnson', 'sarah.johnson@clinic.com', 'manus', 'admin', NOW(), NOW(), NOW()),
('user-001', 'John Smith', 'john.smith@email.com', 'manus', 'user', NOW(), NOW(), NOW()),
('user-002', 'Maria Garcia', 'maria.garcia@email.com', 'manus', 'user', NOW(), NOW(), NOW());

-- ============================================================================
-- TABLE: petOwners
-- Description: Pet owner profiles linked to users
-- ============================================================================
CREATE TABLE IF NOT EXISTS `petOwners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `email` varchar(320) NOT NULL,
  `phone` varchar(20),
  `address` text,
  `city` varchar(100),
  `state` varchar(100),
  `zipCode` varchar(20),
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  INDEX `userId_idx` (`userId`),
  INDEX `email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample pet owners
INSERT INTO `petOwners` (`userId`, `firstName`, `lastName`, `email`, `phone`, `address`, `city`, `state`, `zipCode`, `createdAt`, `updatedAt`) VALUES
(2, 'John', 'Smith', 'john.smith@email.com', '+1-555-0101', '123 Oak Street', 'Springfield', 'IL', '62701', NOW(), NOW()),
(3, 'Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-0102', '456 Maple Avenue', 'Chicago', 'IL', '60601', NOW(), NOW());

-- ============================================================================
-- TABLE: petBreeds
-- Description: Reference table for pet breeds and species
-- ============================================================================
CREATE TABLE IF NOT EXISTS `petBreeds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL UNIQUE,
  `species` enum('dog','cat','bird','rabbit','other') NOT NULL,
  `description` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_unique` (`name`),
  INDEX `species_idx` (`species`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample pet breeds
INSERT INTO `petBreeds` (`name`, `species`, `description`, `createdAt`) VALUES
('Labrador Retriever', 'dog', 'Large, friendly dog breed known for loyalty and intelligence', NOW()),
('Golden Retriever', 'dog', 'Friendly and intelligent dog breed, excellent family pets', NOW()),
('German Shepherd', 'dog', 'Large working dog breed, highly intelligent and trainable', NOW()),
('Siamese', 'cat', 'Elegant cat breed with distinctive color points and vocal nature', NOW()),
('Persian', 'cat', 'Long-haired cat breed known for calm temperament', NOW()),
('Budgerigar', 'bird', 'Small colorful parrot, popular as pet birds', NOW()),
('Holland Lop', 'rabbit', 'Small rabbit breed with distinctive lop ears', NOW());

-- ============================================================================
-- TABLE: pets
-- Description: Pet records with owner and breed associations
-- ============================================================================
CREATE TABLE IF NOT EXISTS `pets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ownerId` int NOT NULL,
  `breedId` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `dateOfBirth` date,
  `microchipId` varchar(100),
  `weight` decimal(5,2),
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`ownerId`) REFERENCES `petOwners` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`breedId`) REFERENCES `petBreeds` (`id`) ON DELETE RESTRICT,
  INDEX `ownerId_idx` (`ownerId`),
  INDEX `breedId_idx` (`breedId`),
  INDEX `microchipId_idx` (`microchipId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample pets
INSERT INTO `pets` (`ownerId`, `breedId`, `name`, `dateOfBirth`, `microchipId`, `weight`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Max', '2020-03-15', 'CHIP-001-ABC', 32.50, 'Very friendly and energetic', NOW(), NOW()),
(1, 4, 'Whiskers', '2019-07-22', 'CHIP-002-DEF', 4.20, 'Indoor cat, prefers quiet environment', NOW(), NOW()),
(2, 2, 'Buddy', '2021-05-10', 'CHIP-003-GHI', 28.75, 'Loves playing fetch', NOW(), NOW());

-- ============================================================================
-- TABLE: vaccineTypes
-- Description: Vaccine categories and information
-- ============================================================================
CREATE TABLE IF NOT EXISTS `vaccineTypes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL UNIQUE,
  `category` varchar(50) NOT NULL,
  `description` text,
  `recommendedAgeMonths` int,
  `revaccineIntervalMonths` int,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_unique` (`name`),
  INDEX `category_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample vaccine types
INSERT INTO `vaccineTypes` (`name`, `category`, `description`, `recommendedAgeMonths`, `revaccineIntervalMonths`, `createdAt`) VALUES
('Rabies', 'Core', 'Rabies virus vaccine for dogs and cats', 12, 36, NOW()),
('DHPP', 'Core', 'Distemper, Hepatitis, Parvo, Parainfluenza for dogs', 6, 12, NOW()),
('FVRCP', 'Core', 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia for cats', 8, 12, NOW()),
('Bordetella', 'Non-Core', 'Kennel cough vaccine for dogs', 6, 12, NOW()),
('Leptospirosis', 'Non-Core', 'Leptospirosis vaccine for dogs', 8, 12, NOW()),
('Lyme Disease', 'Non-Core', 'Lyme disease vaccine for dogs', 12, 12, NOW()),
('Feline Leukemia', 'Non-Core', 'FeLV vaccine for cats', 8, 12, NOW());

-- ============================================================================
-- TABLE: vaccinationLocations
-- Description: Clinic/center locations where vaccinations are administered
-- ============================================================================
CREATE TABLE IF NOT EXISTS `vaccinationLocations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100),
  `zipCode` varchar(20),
  `latitude` decimal(10,8),
  `longitude` decimal(11,8),
  `phone` varchar(20),
  `email` varchar(320),
  `operatingHours` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `city_idx` (`city`),
  INDEX `coordinates_idx` (`latitude`, `longitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample vaccination locations
INSERT INTO `vaccinationLocations` (`name`, `address`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `phone`, `email`, `operatingHours`, `createdAt`, `updatedAt`) VALUES
('Springfield Animal Clinic', '789 Veterinary Lane', 'Springfield', 'IL', '62701', 39.7817, -89.6501, '+1-217-555-0100', 'info@springfield-clinic.com', 'Mon-Fri: 8AM-6PM, Sat: 9AM-2PM', NOW(), NOW()),
('Chicago Pet Hospital', '1234 Michigan Avenue', 'Chicago', 'IL', '60601', 41.8781, -87.6298, '+1-312-555-0200', 'contact@chicago-pet.com', 'Mon-Sat: 8AM-8PM, Sun: 10AM-4PM', NOW(), NOW()),
('Riverside Veterinary Center', '567 River Road', 'Springfield', 'IL', '62702', 39.7650, -89.6200, '+1-217-555-0300', 'admin@riverside-vet.com', 'Mon-Fri: 9AM-5PM, Sat: 10AM-3PM', NOW(), NOW());

-- ============================================================================
-- TABLE: vaccinations
-- Description: Vaccination history per pet
-- ============================================================================
CREATE TABLE IF NOT EXISTS `vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `petId` int NOT NULL,
  `vaccineTypeId` int NOT NULL,
  `vaccinationDate` date NOT NULL,
  `expiryDate` date,
  `locationId` int,
  `batchNumber` varchar(100),
  `veterinarian` varchar(100),
  `notes` text,
  `status` enum('completed','scheduled','pending') NOT NULL DEFAULT 'completed',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`petId`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vaccineTypeId`) REFERENCES `vaccineTypes` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`locationId`) REFERENCES `vaccinationLocations` (`id`) ON DELETE SET NULL,
  INDEX `petId_idx` (`petId`),
  INDEX `vaccineTypeId_idx` (`vaccineTypeId`),
  INDEX `vaccinationDate_idx` (`vaccinationDate`),
  INDEX `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample vaccinations
INSERT INTO `vaccinations` (`petId`, `vaccineTypeId`, `vaccinationDate`, `expiryDate`, `locationId`, `batchNumber`, `veterinarian`, `notes`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2024-01-15', '2027-01-15', 1, 'BATCH-2024-001', 'Dr. Emily Wilson', 'Rabies booster administered', 'completed', NOW(), NOW()),
(1, 2, '2024-01-15', '2025-01-15', 1, 'BATCH-2024-002', 'Dr. Emily Wilson', 'DHPP booster administered', 'completed', NOW(), NOW()),
(2, 3, '2024-02-10', '2025-02-10', 2, 'BATCH-2024-003', 'Dr. Robert Chen', 'FVRCP booster for cat', 'completed', NOW(), NOW()),
(3, 1, '2024-03-05', '2027-03-05', 3, 'BATCH-2024-004', 'Dr. Sarah Johnson', 'Rabies vaccination', 'completed', NOW(), NOW());

-- ============================================================================
-- TABLE: vaccineInventory
-- Description: Stock levels per vaccine type per location
-- ============================================================================
CREATE TABLE IF NOT EXISTS `vaccineInventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vaccineTypeId` int NOT NULL,
  `locationId` int NOT NULL,
  `quantityInStock` int NOT NULL DEFAULT 0,
  `reorderThreshold` int NOT NULL DEFAULT 10,
  `reorderQuantity` int NOT NULL DEFAULT 50,
  `lastRestockedDate` date,
  `expiryDate` date,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`vaccineTypeId`) REFERENCES `vaccineTypes` (`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`locationId`) REFERENCES `vaccinationLocations` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `vaccine_location_unique` (`vaccineTypeId`, `locationId`),
  INDEX `vaccineTypeId_idx` (`vaccineTypeId`),
  INDEX `locationId_idx` (`locationId`),
  INDEX `quantityInStock_idx` (`quantityInStock`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample vaccine inventory
INSERT INTO `vaccineInventory` (`vaccineTypeId`, `locationId`, `quantityInStock`, `reorderThreshold`, `reorderQuantity`, `lastRestockedDate`, `expiryDate`, `createdAt`, `updatedAt`) VALUES
(1, 1, 45, 10, 50, '2024-12-01', '2026-12-01', NOW(), NOW()),
(2, 1, 38, 10, 50, '2024-11-15', '2026-11-15', NOW(), NOW()),
(3, 2, 52, 10, 50, '2024-12-10', '2026-12-10', NOW(), NOW()),
(1, 2, 8, 10, 50, '2024-11-20', '2026-11-20', NOW(), NOW()),
(4, 1, 25, 10, 50, '2024-12-05', '2026-12-05', NOW(), NOW()),
(1, 3, 15, 10, 50, '2024-12-08', '2026-12-08', NOW(), NOW()),
(2, 3, 5, 10, 50, '2024-11-25', '2026-11-25', NOW(), NOW());

-- ============================================================================
-- TABLE: reorderAlerts
-- Description: Low stock and expiry notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS `reorderAlerts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `inventoryId` int NOT NULL,
  `alertType` enum('low_stock','expired','expiring_soon') NOT NULL,
  `quantity` int,
  `status` enum('active','acknowledged','resolved') NOT NULL DEFAULT 'active',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`inventoryId`) REFERENCES `vaccineInventory` (`id`) ON DELETE CASCADE,
  INDEX `inventoryId_idx` (`inventoryId`),
  INDEX `alertType_idx` (`alertType`),
  INDEX `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample reorder alerts
INSERT INTO `reorderAlerts` (`inventoryId`, `alertType`, `quantity`, `status`, `createdAt`, `updatedAt`) VALUES
(4, 'low_stock', 8, 'active', NOW(), NOW()),
(7, 'low_stock', 5, 'active', NOW(), NOW());

-- ============================================================================
-- TABLE: vaccinationSchedules
-- Description: Planned vaccinations per location
-- ============================================================================
CREATE TABLE IF NOT EXISTS `vaccinationSchedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `locationId` int NOT NULL,
  `petId` int NOT NULL,
  `vaccineTypeId` int NOT NULL,
  `scheduledDate` date NOT NULL,
  `scheduledTime` varchar(10),
  `status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
  `notes` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`locationId`) REFERENCES `vaccinationLocations` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`petId`) REFERENCES `pets` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`vaccineTypeId`) REFERENCES `vaccineTypes` (`id`) ON DELETE RESTRICT,
  INDEX `locationId_idx` (`locationId`),
  INDEX `petId_idx` (`petId`),
  INDEX `scheduledDate_idx` (`scheduledDate`),
  INDEX `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample vaccination schedules
INSERT INTO `vaccinationSchedules` (`locationId`, `petId`, `vaccineTypeId`, `scheduledDate`, `scheduledTime`, `status`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, '2025-02-15', '10:00', 'scheduled', 'Rabies booster appointment', NOW(), NOW()),
(2, 2, 3, '2025-02-20', '14:30', 'scheduled', 'Feline FVRCP booster', NOW(), NOW()),
(3, 3, 2, '2025-02-25', '09:00', 'scheduled', 'DHPP booster for dog', NOW(), NOW());

-- ============================================================================
-- INDEXES AND CONSTRAINTS SUMMARY
-- ============================================================================
-- All tables include:
-- - Primary key auto-increment for unique identification
-- - Foreign key constraints for referential integrity
-- - Timestamps for audit trail (createdAt, updatedAt)
-- - Appropriate indexes on frequently queried columns
-- - Enum types for status and category fields

-- ============================================================================
-- VIEW: Active Reorder Alerts
-- ============================================================================
CREATE OR REPLACE VIEW `active_reorder_alerts` AS
SELECT 
  ra.id,
  ra.alertType,
  ra.quantity,
  ra.status,
  vi.quantityInStock,
  vi.reorderThreshold,
  vt.name AS vaccineName,
  vt.category,
  vl.name AS locationName,
  vl.city,
  ra.createdAt,
  ra.updatedAt
FROM reorderAlerts ra
JOIN vaccineInventory vi ON ra.inventoryId = vi.id
JOIN vaccineTypes vt ON vi.vaccineTypeId = vt.id
JOIN vaccinationLocations vl ON vi.locationId = vl.id
WHERE ra.status = 'active'
ORDER BY ra.createdAt DESC;

-- ============================================================================
-- VIEW: Upcoming Vaccinations
-- ============================================================================
CREATE OR REPLACE VIEW `upcoming_vaccinations` AS
SELECT 
  vs.id,
  vs.scheduledDate,
  vs.scheduledTime,
  vs.status,
  p.name AS petName,
  po.firstName,
  po.lastName,
  po.email,
  po.phone,
  vt.name AS vaccineName,
  vl.name AS locationName,
  vl.address,
  vl.city,
  vl.phone AS locationPhone
FROM vaccinationSchedules vs
JOIN pets p ON vs.petId = p.id
JOIN petOwners po ON p.ownerId = po.id
JOIN vaccineTypes vt ON vs.vaccineTypeId = vt.id
JOIN vaccinationLocations vl ON vs.locationId = vl.id
WHERE vs.scheduledDate >= CURDATE()
  AND vs.status = 'scheduled'
ORDER BY vs.scheduledDate ASC, vs.scheduledTime ASC;

-- ============================================================================
-- VIEW: Pet Vaccination History
-- ============================================================================
CREATE OR REPLACE VIEW `pet_vaccination_history` AS
SELECT 
  v.id,
  p.id AS petId,
  p.name AS petName,
  po.firstName,
  po.lastName,
  vt.name AS vaccineName,
  vt.category,
  v.vaccinationDate,
  v.expiryDate,
  v.status,
  vl.name AS locationName,
  v.veterinarian,
  v.batchNumber,
  v.notes
FROM vaccinations v
JOIN pets p ON v.petId = p.id
JOIN petOwners po ON p.ownerId = po.id
JOIN vaccineTypes vt ON v.vaccineTypeId = vt.id
LEFT JOIN vaccinationLocations vl ON v.locationId = vl.id
ORDER BY p.id, v.vaccinationDate DESC;

-- ============================================================================
-- END OF DATABASE DUMP
-- ============================================================================
-- Total Tables: 10
-- Total Views: 3
-- Total Sample Records: 25+
-- Last Updated: 2026-02-11
-- ============================================================================
