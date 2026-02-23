-- ============================================================================
-- ANIMAL BITE MONITORING TOOL - SAMPLE DATA
-- ============================================================================
-- This script populates the database with realistic sample data for testing
-- All timestamps are set to current time or relative dates
-- ============================================================================

-- ============================================================================
-- 1. PET BREEDS (Reference Data)
-- ============================================================================
INSERT INTO petBreeds (name, species, description, createdAt, updatedAt) VALUES
('Labrador Retriever', 'dog', 'Friendly and energetic breed, excellent family dogs', NOW(), NOW()),
('German Shepherd', 'dog', 'Intelligent and loyal working dogs', NOW(), NOW()),
('Golden Retriever', 'dog', 'Gentle and intelligent breed, great with families', NOW(), NOW()),
('Bulldog', 'dog', 'Sturdy and affectionate companion dogs', NOW(), NOW()),
('Poodle', 'dog', 'Intelligent and active breed, hypoallergenic coat', NOW(), NOW()),
('Persian Cat', 'cat', 'Long-haired breed known for calm temperament', NOW(), NOW()),
('Siamese Cat', 'cat', 'Vocal and social breed with distinctive markings', NOW(), NOW()),
('Bengal Cat', 'cat', 'Energetic and playful breed with wild appearance', NOW(), NOW()),
('British Shorthair', 'cat', 'Calm and independent breed with dense coat', NOW(), NOW()),
('Cockatiel', 'bird', 'Small parrot species, popular pet bird', NOW(), NOW()),
('Parakeet', 'bird', 'Small colorful parrot species', NOW(), NOW()),
('Lop Rabbit', 'rabbit', 'Long-eared rabbit breed, friendly and social', NOW(), NOW());

-- ============================================================================
-- 2. VACCINE TYPES (Reference Data)
-- ============================================================================
INSERT INTO vaccineTypes (name, category, description, recommendedAgeMonths, revaccineIntervalMonths, createdAt, updatedAt) VALUES
('Rabies', 'core', 'Protection against rabies virus', 12, 12, NOW(), NOW()),
('DHPP', 'core', 'Distemper, Hepatitis, Parvo, Parainfluenza', 6, 12, NOW(), NOW()),
('Bordetella', 'non-core', 'Protection against kennel cough', 8, 12, NOW(), NOW()),
('Leptospirosis', 'core', 'Protection against leptospirosis bacteria', 8, 12, NOW(), NOW()),
('FVRCP', 'core', 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia', 8, 12, NOW(), NOW()),
('Feline Leukemia', 'non-core', 'Protection against feline leukemia virus', 8, 12, NOW(), NOW()),
('Feline Immunodeficiency', 'non-core', 'Protection against feline immunodeficiency virus', 12, 12, NOW(), NOW()),
('Avian Influenza', 'core', 'Protection for pet birds against avian flu', 4, 12, NOW(), NOW()),
('Myxomatosis', 'core', 'Protection for rabbits against myxomatosis', 8, 12, NOW(), NOW());

-- ============================================================================
-- 3. VACCINATION LOCATIONS (Clinics/Centers)
-- ============================================================================
INSERT INTO vaccinationLocations (name, address, city, state, zipCode, phone, email, operatingHours, latitude, longitude, createdAt, updatedAt) VALUES
('Downtown Veterinary Clinic', '123 Main Street', 'New York', 'NY', '10001', '(212) 555-0101', 'info@downtown-vet.com', 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM', 40.7128, -74.0060, NOW(), NOW()),
('Riverside Animal Hospital', '456 River Road', 'Los Angeles', 'CA', '90001', '(213) 555-0202', 'contact@riverside-animal.com', 'Mon-Sun: 8AM-8PM', 34.0522, -118.2437, NOW(), NOW()),
('Parkside Pet Care', '789 Park Avenue', 'Chicago', 'IL', '60601', '(312) 555-0303', 'hello@parkside-pet.com', 'Mon-Sat: 9AM-5PM', 41.8781, -87.6298, NOW(), NOW()),
('Sunset Veterinary Services', '321 Sunset Boulevard', 'Houston', 'TX', '77001', '(713) 555-0404', 'care@sunset-vet.com', 'Mon-Fri: 8AM-6PM, Sat: 9AM-3PM', 29.7604, -95.3698, NOW(), NOW()),
('Northside Animal Wellness', '654 North Street', 'Phoenix', 'AZ', '85001', '(602) 555-0505', 'wellness@northside-animal.com', 'Mon-Fri: 9AM-7PM, Sat: 10AM-5PM', 33.4484, -112.0742, NOW(), NOW());

-- ============================================================================
-- 4. PET OWNERS (Users' Profiles)
-- ============================================================================
INSERT INTO petOwners (userId, firstName, lastName, email, phone, address, city, state, zipCode, createdAt, updatedAt) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '(555) 123-4567', '100 Oak Street', 'New York', 'NY', '10001', NOW(), NOW()),
(2, 'Sarah', 'Johnson', 'sarah.j@email.com', '(555) 234-5678', '200 Elm Avenue', 'Los Angeles', 'CA', '90001', NOW(), NOW()),
(3, 'Michael', 'Brown', 'mbrown@email.com', '(555) 345-6789', '300 Pine Road', 'Chicago', 'IL', '60601', NOW(), NOW()),
(4, 'Emily', 'Davis', 'emily.d@email.com', '(555) 456-7890', '400 Maple Drive', 'Houston', 'TX', '77001', NOW(), NOW()),
(5, 'David', 'Wilson', 'dwilson@email.com', '(555) 567-8901', '500 Cedar Lane', 'Phoenix', 'AZ', '85001', NOW(), NOW());

-- ============================================================================
-- 5. PETS
-- ============================================================================
INSERT INTO pets (ownerId, breedId, name, dateOfBirth, microchipId, notes, createdAt, updatedAt) VALUES
(1, 1, 'Max', '2021-03-15', 'MC001234567890', 'Friendly and energetic Labrador', NOW(), NOW()),
(1, 3, 'Bella', '2020-07-22', 'MC001234567891', 'Golden Retriever, loves swimming', NOW(), NOW()),
(2, 2, 'Charlie', '2022-01-10', 'MC001234567892', 'German Shepherd, excellent guard dog', NOW(), NOW()),
(2, 6, 'Luna', '2021-11-05', 'MC001234567893', 'Persian cat, calm and affectionate', NOW(), NOW()),
(3, 4, 'Rocky', '2020-05-18', 'MC001234567894', 'Bulldog, loves short walks', NOW(), NOW()),
(3, 7, 'Whiskers', '2022-02-14', 'MC001234567895', 'Siamese cat, very vocal', NOW(), NOW()),
(4, 5, 'Daisy', '2021-09-30', 'MC001234567896', 'Poodle, recently groomed', NOW(), NOW()),
(4, 10, 'Tweety', '2020-08-12', 'MC001234567897', 'Cockatiel, loves to sing', NOW(), NOW()),
(5, 8, 'Tiger', '2021-06-20', 'MC001234567898', 'Bengal cat, very playful', NOW(), NOW()),
(5, 12, 'Hoppy', '2022-04-03', 'MC001234567899', 'Lop rabbit, friendly and social', NOW(), NOW());

-- ============================================================================
-- 6. VACCINATIONS (Historical Records)
-- ============================================================================
INSERT INTO vaccinations (petId, vaccineTypeId, vaccinationDate, expiryDate, veterinarian, locationId, status, notes, createdAt, updatedAt) VALUES
-- Max (Labrador) vaccinations
(1, 1, DATE_SUB(NOW(), INTERVAL 6 MONTH), DATE_ADD(NOW(), INTERVAL 6 MONTH), 'Dr. Sarah Chen', 1, 'completed', 'Rabies vaccination, no adverse reactions', NOW(), NOW()),
(1, 2, DATE_SUB(NOW(), INTERVAL 6 MONTH), DATE_ADD(NOW(), INTERVAL 6 MONTH), 'Dr. Sarah Chen', 1, 'completed', 'DHPP vaccination, dog is healthy', NOW(), NOW()),
(1, 3, DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_ADD(NOW(), INTERVAL 9 MONTH), 'Dr. James Miller', 1, 'completed', 'Bordetella booster', NOW(), NOW()),

-- Bella (Golden Retriever) vaccinations
(2, 1, DATE_SUB(NOW(), INTERVAL 4 MONTH), DATE_ADD(NOW(), INTERVAL 8 MONTH), 'Dr. Sarah Chen', 1, 'completed', 'Rabies vaccination', NOW(), NOW()),
(2, 2, DATE_SUB(NOW(), INTERVAL 4 MONTH), DATE_ADD(NOW(), INTERVAL 8 MONTH), 'Dr. Sarah Chen', 1, 'completed', 'DHPP vaccination', NOW(), NOW()),

-- Charlie (German Shepherd) vaccinations
(3, 1, DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 10 MONTH), 'Dr. Michael Torres', 2, 'completed', 'Rabies vaccination', NOW(), NOW()),
(3, 2, DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 10 MONTH), 'Dr. Michael Torres', 2, 'completed', 'DHPP vaccination', NOW(), NOW()),
(3, 4, DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_ADD(NOW(), INTERVAL 11 MONTH), 'Dr. Michael Torres', 2, 'completed', 'Leptospirosis vaccination', NOW(), NOW()),

-- Luna (Persian Cat) vaccinations
(4, 5, DATE_SUB(NOW(), INTERVAL 5 MONTH), DATE_ADD(NOW(), INTERVAL 7 MONTH), 'Dr. Patricia Lee', 2, 'completed', 'FVRCP vaccination', NOW(), NOW()),
(4, 6, DATE_SUB(NOW(), INTERVAL 5 MONTH), DATE_ADD(NOW(), INTERVAL 7 MONTH), 'Dr. Patricia Lee', 2, 'completed', 'Feline Leukemia vaccination', NOW(), NOW()),

-- Rocky (Bulldog) vaccinations
(5, 1, DATE_SUB(NOW(), INTERVAL 8 MONTH), DATE_ADD(NOW(), INTERVAL 4 MONTH), 'Dr. Robert Kim', 3, 'completed', 'Rabies vaccination', NOW(), NOW()),
(5, 2, DATE_SUB(NOW(), INTERVAL 8 MONTH), DATE_ADD(NOW(), INTERVAL 4 MONTH), 'Dr. Robert Kim', 3, 'completed', 'DHPP vaccination', NOW(), NOW()),

-- Whiskers (Siamese Cat) vaccinations
(6, 5, DATE_SUB(NOW(), INTERVAL 3 MONTH), DATE_ADD(NOW(), INTERVAL 9 MONTH), 'Dr. Jennifer White', 3, 'completed', 'FVRCP vaccination', NOW(), NOW()),

-- Daisy (Poodle) vaccinations
(7, 1, DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_ADD(NOW(), INTERVAL 11 MONTH), 'Dr. David Brown', 4, 'completed', 'Rabies vaccination', NOW(), NOW()),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 MONTH), DATE_ADD(NOW(), INTERVAL 11 MONTH), 'Dr. David Brown', 4, 'completed', 'DHPP vaccination', NOW(), NOW()),

-- Tweety (Cockatiel) vaccinations
(8, 8, DATE_SUB(NOW(), INTERVAL 7 MONTH), DATE_ADD(NOW(), INTERVAL 5 MONTH), 'Dr. Lisa Anderson', 4, 'completed', 'Avian Influenza vaccination', NOW(), NOW()),

-- Tiger (Bengal Cat) vaccinations
(9, 5, DATE_SUB(NOW(), INTERVAL 2 MONTH), DATE_ADD(NOW(), INTERVAL 10 MONTH), 'Dr. Mark Johnson', 5, 'completed', 'FVRCP vaccination', NOW(), NOW()),

-- Hoppy (Lop Rabbit) vaccinations
(10, 9, DATE_SUB(NOW(), INTERVAL 6 MONTH), DATE_ADD(NOW(), INTERVAL 6 MONTH), 'Dr. Susan Garcia', 5, 'completed', 'Myxomatosis vaccination', NOW(), NOW());

-- ============================================================================
-- 7. VACCINATION SCHEDULES (Upcoming Appointments)
-- ============================================================================
INSERT INTO vaccinationSchedules (petId, vaccineTypeId, scheduledDate, locationId, status, notes, createdAt, updatedAt) VALUES
-- Upcoming vaccinations
(1, 3, DATE_ADD(NOW(), INTERVAL 15 DAY), 1, 'scheduled', 'Bordetella booster appointment', NOW(), NOW()),
(2, 1, DATE_ADD(NOW(), INTERVAL 20 DAY), 1, 'scheduled', 'Rabies booster appointment', NOW(), NOW()),
(3, 1, DATE_ADD(NOW(), INTERVAL 10 DAY), 2, 'scheduled', 'Rabies booster appointment', NOW(), NOW()),
(4, 6, DATE_ADD(NOW(), INTERVAL 25 DAY), 2, 'scheduled', 'Feline Leukemia booster', NOW(), NOW()),
(5, 1, DATE_ADD(NOW(), INTERVAL 5 DAY), 3, 'scheduled', 'Rabies booster - URGENT', NOW(), NOW()),
(6, 5, DATE_ADD(NOW(), INTERVAL 30 DAY), 3, 'scheduled', 'FVRCP booster appointment', NOW(), NOW()),
(7, 3, DATE_ADD(NOW(), INTERVAL 12 DAY), 4, 'scheduled', 'Bordetella booster appointment', NOW(), NOW()),
(9, 6, DATE_ADD(NOW(), INTERVAL 22 DAY), 5, 'scheduled', 'Feline Leukemia booster', NOW(), NOW()),
(10, 9, DATE_ADD(NOW(), INTERVAL 18 DAY), 5, 'scheduled', 'Myxomatosis booster appointment', NOW(), NOW());

-- ============================================================================
-- 8. VACCINE INVENTORY (Stock Levels)
-- ============================================================================
INSERT INTO vaccineInventory (vaccineTypeId, locationId, quantityInStock, reorderThreshold, reorderQuantity, expiryDate, createdAt, updatedAt) VALUES
-- Downtown Veterinary Clinic (Location 1)
(1, 1, 45, 20, 50, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),
(2, 1, 38, 15, 40, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(3, 1, 22, 10, 30, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),
(4, 1, 15, 10, 25, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),
(5, 1, 28, 15, 35, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),

-- Riverside Animal Hospital (Location 2)
(1, 2, 52, 20, 50, DATE_ADD(NOW(), INTERVAL 7 MONTH), NOW(), NOW()),
(2, 2, 41, 15, 40, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),
(3, 2, 8, 10, 30, DATE_ADD(NOW(), INTERVAL 3 MONTH), NOW(), NOW()),
(5, 2, 35, 15, 35, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(6, 2, 19, 10, 25, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),

-- Parkside Pet Care (Location 3)
(1, 3, 35, 20, 50, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(2, 3, 28, 15, 40, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),
(3, 3, 12, 10, 30, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),
(4, 3, 20, 10, 25, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),

-- Sunset Veterinary Services (Location 4)
(1, 4, 48, 20, 50, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),
(2, 4, 39, 15, 40, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(3, 4, 25, 10, 30, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),
(5, 4, 32, 15, 35, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(8, 4, 18, 10, 20, DATE_ADD(NOW(), INTERVAL 3 MONTH), NOW(), NOW()),

-- Northside Animal Wellness (Location 5)
(1, 5, 42, 20, 50, DATE_ADD(NOW(), INTERVAL 6 MONTH), NOW(), NOW()),
(2, 5, 36, 15, 40, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(5, 5, 30, 15, 35, DATE_ADD(NOW(), INTERVAL 5 MONTH), NOW(), NOW()),
(6, 5, 22, 10, 25, DATE_ADD(NOW(), INTERVAL 4 MONTH), NOW(), NOW()),
(9, 5, 16, 10, 20, DATE_ADD(NOW(), INTERVAL 3 MONTH), NOW(), NOW());

-- ============================================================================
-- 9. REORDER ALERTS
-- ============================================================================
INSERT INTO reorderAlerts (vaccineTypeId, locationId, alertType, currentStock, threshold, quantity, status, createdAt, updatedAt) VALUES
-- Low stock alerts
(3, 2, 'low_stock', 8, 10, 30, 'active', NOW(), NOW()),
(8, 4, 'low_stock', 18, 10, 20, 'active', NOW(), NOW()),
(9, 5, 'low_stock', 16, 10, 20, 'active', NOW(), NOW()),
(6, 2, 'low_stock', 19, 10, 25, 'active', NOW(), NOW()),

-- Expiry soon alerts
(3, 1, 'expiry_soon', 22, 10, 30, 'active', DATE_ADD(NOW(), INTERVAL 30 DAY), NOW()),
(4, 3, 'expiry_soon', 20, 10, 25, 'active', DATE_ADD(NOW(), INTERVAL 25 DAY), NOW());

-- ============================================================================
-- Summary Statistics
-- ============================================================================
-- Total Records Created:
-- - Pet Breeds: 12
-- - Vaccine Types: 9
-- - Vaccination Locations: 5
-- - Pet Owners: 5
-- - Pets: 10
-- - Vaccinations (Historical): 16
-- - Vaccination Schedules: 9
-- - Vaccine Inventory: 25
-- - Reorder Alerts: 6
-- ============================================================================
