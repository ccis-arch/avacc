CREATE TABLE `petBreeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`species` enum('dog','cat','bird','rabbit','other') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `petBreeds_id` PRIMARY KEY(`id`),
	CONSTRAINT `petBreeds_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `petOwners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`address` text,
	`city` varchar(100),
	`state` varchar(100),
	`zipCode` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `petOwners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerId` int NOT NULL,
	`breedId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`dateOfBirth` date,
	`microchipId` varchar(100),
	`weight` decimal(5,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reorderAlerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inventoryId` int NOT NULL,
	`alertType` enum('low_stock','expired','expiring_soon') NOT NULL,
	`quantity` int,
	`status` enum('active','acknowledged','resolved') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reorderAlerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccinationLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
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
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaccinationLocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccinationSchedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`locationId` int NOT NULL,
	`petId` int NOT NULL,
	`vaccineTypeId` int NOT NULL,
	`scheduledDate` date NOT NULL,
	`scheduledTime` varchar(10),
	`status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaccinationSchedules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`petId` int NOT NULL,
	`vaccineTypeId` int NOT NULL,
	`vaccinationDate` date NOT NULL,
	`expiryDate` date,
	`locationId` int,
	`batchNumber` varchar(100),
	`veterinarian` varchar(100),
	`notes` text,
	`status` enum('completed','scheduled','pending') NOT NULL DEFAULT 'completed',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaccinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccineInventory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vaccineTypeId` int NOT NULL,
	`locationId` int NOT NULL,
	`quantityInStock` int NOT NULL DEFAULT 0,
	`reorderThreshold` int NOT NULL DEFAULT 10,
	`reorderQuantity` int NOT NULL DEFAULT 50,
	`lastRestockedDate` date,
	`expiryDate` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vaccineInventory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vaccineTypes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(50) NOT NULL,
	`description` text,
	`recommendedAgeMonths` int,
	`revaccineIntervalMonths` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vaccineTypes_id` PRIMARY KEY(`id`),
	CONSTRAINT `vaccineTypes_name_unique` UNIQUE(`name`)
);
