# Animal Bite Monitoring Tool - Database Documentation

## Overview

The Animal Bite Monitoring Tool database is designed to manage pet vaccination records, inventory tracking, location management, and appointment scheduling. The system supports role-based access control with separate permissions for administrators and pet owners.

## Database Architecture

### Database Engine
- **Type**: MySQL/TiDB
- **Character Set**: UTF8MB4 (supports emoji and special characters)
- **Collation**: utf8mb4_unicode_ci

---

## Table Specifications

### 1. **users** - Authentication & Authorization
**Purpose**: Core authentication table with role-based access control for admins and regular users.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `openId` | VARCHAR(64) | UNIQUE, NOT NULL | Manus OAuth identifier |
| `name` | TEXT | | User's display name |
| `email` | VARCHAR(320) | | User's email address |
| `loginMethod` | VARCHAR(64) | | Authentication method (e.g., 'manus') |
| `role` | ENUM('user','admin') | NOT NULL, DEFAULT 'user' | User role for access control |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last update timestamp |
| `lastSignedIn` | TIMESTAMP | NOT NULL | Last login timestamp |

**Indexes**: 
- PRIMARY KEY: `id`
- UNIQUE: `openId`
- INDEX: `role` (for role-based queries)

**Sample Data**: 3 records (1 admin, 2 users)

---

### 2. **petOwners** - Pet Owner Profiles
**Purpose**: Store detailed information about pet owners linked to user accounts.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique owner identifier |
| `userId` | INT | FOREIGN KEY, NOT NULL | Reference to users table |
| `firstName` | VARCHAR(100) | NOT NULL | Owner's first name |
| `lastName` | VARCHAR(100) | NOT NULL | Owner's last name |
| `email` | VARCHAR(320) | NOT NULL | Owner's email address |
| `phone` | VARCHAR(20) | | Contact phone number |
| `address` | TEXT | | Street address |
| `city` | VARCHAR(100) | | City name |
| `state` | VARCHAR(100) | | State/Province |
| `zipCode` | VARCHAR(20) | | Postal code |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Relationships**:
- FOREIGN KEY: `userId` → `users.id` (CASCADE DELETE)

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `userId`
- INDEX: `email`

**Sample Data**: 2 records

---

### 3. **petBreeds** - Pet Breed Reference
**Purpose**: Reference table containing all available pet breeds and species information.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique breed identifier |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Breed name |
| `species` | ENUM | NOT NULL | Species type (dog, cat, bird, rabbit, other) |
| `description` | TEXT | | Breed characteristics and info |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `name`
- INDEX: `species`

**Sample Data**: 7 records (various dog, cat, bird, and rabbit breeds)

---

### 4. **pets** - Pet Records
**Purpose**: Store individual pet information with owner and breed associations.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique pet identifier |
| `ownerId` | INT | FOREIGN KEY, NOT NULL | Reference to petOwners |
| `breedId` | INT | FOREIGN KEY, NOT NULL | Reference to petBreeds |
| `name` | VARCHAR(100) | NOT NULL | Pet's name |
| `dateOfBirth` | DATE | | Pet's date of birth |
| `microchipId` | VARCHAR(100) | | Microchip identification number |
| `weight` | DECIMAL(5,2) | | Weight in kilograms |
| `notes` | TEXT | | Additional notes about the pet |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Relationships**:
- FOREIGN KEY: `ownerId` → `petOwners.id` (CASCADE Delete)
- FOREIGN KEY: `breedId` → `petBreeds.id` (RESTRICT Delete)

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `ownerId`, `breedId`
- INDEX: `microchipId`

**Sample Data**: 3 records

---

### 5. **vaccineTypes** - Vaccine Categories
**Purpose**: Reference table for vaccine types with recommended schedules.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique vaccine type ID |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Vaccine name |
| `category` | VARCHAR(50) | NOT NULL | Category (Core, Non-Core) |
| `description` | TEXT | | Detailed vaccine information |
| `recommendedAgeMonths` | INT | | Recommended age for first dose (months) |
| `revaccineIntervalMonths` | INT | | Revaccination interval (months) |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `name`
- INDEX: `category`

**Sample Data**: 7 records (Rabies, DHPP, FVRCP, Bordetella, Leptospirosis, Lyme Disease, Feline Leukemia)

---

### 6. **vaccinations** - Vaccination History
**Purpose**: Track complete vaccination history for each pet.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique vaccination record ID |
| `petId` | INT | FOREIGN KEY, NOT NULL | Reference to pets |
| `vaccineTypeId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccineTypes |
| `vaccinationDate` | DATE | NOT NULL | Date vaccination was administered |
| `expiryDate` | DATE | | Date vaccination expires |
| `locationId` | INT | FOREIGN KEY | Reference to vaccinationLocations |
| `batchNumber` | VARCHAR(100) | | Vaccine batch/lot number |
| `veterinarian` | VARCHAR(100) | | Veterinarian who administered |
| `notes` | TEXT | | Additional notes |
| `status` | ENUM | NOT NULL, DEFAULT 'completed' | Status (completed, scheduled, pending) |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Relationships**:
- FOREIGN KEY: `petId` → `pets.id` (CASCADE Delete)
- FOREIGN KEY: `vaccineTypeId` → `vaccineTypes.id` (RESTRICT Delete)
- FOREIGN KEY: `locationId` → `vaccinationLocations.id` (SET NULL)

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEYS: `petId`, `vaccineTypeId`
- INDEX: `vaccinationDate`, `status`

**Sample Data**: 4 records

---

### 7. **vaccinationLocations** - Clinic/Center Locations
**Purpose**: Store information about vaccination clinics and centers.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique location ID |
| `name` | VARCHAR(150) | NOT NULL | Clinic/center name |
| `address` | TEXT | NOT NULL | Street address |
| `city` | VARCHAR(100) | NOT NULL | City name |
| `state` | VARCHAR(100) | | State/Province |
| `zipCode` | VARCHAR(20) | | Postal code |
| `latitude` | DECIMAL(10,8) | | GPS latitude coordinate |
| `longitude` | DECIMAL(11,8) | | GPS longitude coordinate |
| `phone` | VARCHAR(20) | | Contact phone number |
| `email` | VARCHAR(320) | | Contact email address |
| `operatingHours` | TEXT | | Operating hours information |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Indexes**:
- PRIMARY KEY: `id`
- INDEX: `city`
- INDEX: `latitude`, `longitude` (for geographic queries)

**Sample Data**: 3 records (Springfield, Chicago, Riverside)

---

### 8. **vaccineInventory** - Stock Levels
**Purpose**: Track vaccine stock levels per vaccine type per location.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique inventory record ID |
| `vaccineTypeId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccineTypes |
| `locationId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccinationLocations |
| `quantityInStock` | INT | NOT NULL, DEFAULT 0 | Current stock quantity |
| `reorderThreshold` | INT | NOT NULL, DEFAULT 10 | Minimum quantity before reorder alert |
| `reorderQuantity` | INT | NOT NULL, DEFAULT 50 | Quantity to order when restocking |
| `lastRestockedDate` | DATE | | Date of last restock |
| `expiryDate` | DATE | | Expiry date of current stock |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Relationships**:
- FOREIGN KEY: `vaccineTypeId` → `vaccineTypes.id` (RESTRICT Delete)
- FOREIGN KEY: `locationId` → `vaccinationLocations.id` (CASCADE Delete)
- UNIQUE: `vaccineTypeId`, `locationId` (one inventory per vaccine per location)

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `vaccineTypeId`, `locationId`
- FOREIGN KEYS: `vaccineTypeId`, `locationId`
- INDEX: `quantityInStock`

**Sample Data**: 7 records

---

### 9. **reorderAlerts** - Low Stock & Expiry Alerts
**Purpose**: Track and manage inventory alerts for low stock and expiring vaccines.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique alert ID |
| `inventoryId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccineInventory |
| `alertType` | ENUM | NOT NULL | Alert type (low_stock, expired, expiring_soon) |
| `quantity` | INT | | Current quantity when alert triggered |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | Status (active, acknowledged, resolved) |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Alert creation time |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last update time |

**Relationships**:
- FOREIGN KEY: `inventoryId` → `vaccineInventory.id` (CASCADE Delete)

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `inventoryId`
- INDEX: `alertType`, `status`

**Sample Data**: 2 records (both low_stock alerts)

---

### 10. **vaccinationSchedules** - Appointment Scheduling
**Purpose**: Manage scheduled vaccinations and appointments.

**Columns**:
| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique schedule ID |
| `locationId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccinationLocations |
| `petId` | INT | FOREIGN KEY, NOT NULL | Reference to pets |
| `vaccineTypeId` | INT | FOREIGN KEY, NOT NULL | Reference to vaccineTypes |
| `scheduledDate` | DATE | NOT NULL | Appointment date |
| `scheduledTime` | VARCHAR(10) | | Appointment time (HH:MM format) |
| `status` | ENUM | NOT NULL, DEFAULT 'scheduled' | Status (scheduled, completed, cancelled, no_show) |
| `notes` | TEXT | | Appointment notes |
| `createdAt` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation |
| `updatedAt` | TIMESTAMP | NOT NULL, AUTO_UPDATE | Last modification |

**Relationships**:
- FOREIGN KEY: `locationId` → `vaccinationLocations.id` (CASCADE Delete)
- FOREIGN KEY: `petId` → `pets.id` (CASCADE Delete)
- FOREIGN KEY: `vaccineTypeId` → `vaccineTypes.id` (RESTRICT Delete)

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEYS: `locationId`, `petId`, `vaccineTypeId`
- INDEX: `scheduledDate`, `status`

**Sample Data**: 3 records

---

## Database Views

### 1. **active_reorder_alerts**
Displays all active reorder alerts with related vaccine and location information.

**Columns**: id, alertType, quantity, status, quantityInStock, reorderThreshold, vaccineName, category, locationName, city, createdAt, updatedAt

**Purpose**: Quick view of inventory issues requiring attention.

---

### 2. **upcoming_vaccinations**
Shows all scheduled vaccinations with pet owner and location details.

**Columns**: id, scheduledDate, scheduledTime, status, petName, firstName, lastName, email, phone, vaccineName, locationName, address, city, locationPhone

**Purpose**: Helps admins manage upcoming appointments and send reminders.

---

### 3. **pet_vaccination_history**
Complete vaccination history for each pet with all related information.

**Columns**: id, petId, petName, firstName, lastName, vaccineName, category, vaccinationDate, expiryDate, status, locationName, veterinarian, batchNumber, notes

**Purpose**: Provides comprehensive vaccination records for pet owners and veterinarians.

---

## Entity Relationships

```
users (1) ──→ (many) petOwners
         ↓
petOwners (1) ──→ (many) pets
                    ↓
                 petBreeds (1) ←── (many) pets
                 
pets (1) ──→ (many) vaccinations
         ├──→ (many) vaccinationSchedules
         
vaccineTypes (1) ──→ (many) vaccinations
              ├──→ (many) vaccineInventory
              ├──→ (many) vaccinationSchedules

vaccinationLocations (1) ──→ (many) vaccinations
                      ├──→ (many) vaccineInventory
                      ├──→ (many) vaccinationSchedules

vaccineInventory (1) ──→ (many) reorderAlerts
```

---

## Data Integrity & Constraints

### Foreign Key Constraints
- **CASCADE Delete**: Deleting a petOwner cascades to pets; deleting pets cascades to vaccinations and schedules
- **RESTRICT Delete**: Prevents deletion of vaccineTypes and petBreeds if referenced
- **SET NULL**: Deleting a location sets locationId to NULL in vaccinations

### Unique Constraints
- `users.openId`: Ensures unique OAuth identifiers
- `petBreeds.name`: Prevents duplicate breed names
- `vaccineTypes.name`: Prevents duplicate vaccine names
- `vaccineInventory.(vaccineTypeId, locationId)`: One inventory record per vaccine per location

### Enum Constraints
- `users.role`: Limited to 'user' or 'admin'
- `petBreeds.species`: Limited to dog, cat, bird, rabbit, or other
- `vaccinations.status`: Limited to completed, scheduled, or pending
- `reorderAlerts.alertType`: Limited to low_stock, expired, or expiring_soon
- `vaccinationSchedules.status`: Limited to scheduled, completed, cancelled, or no_show

---

## Indexing Strategy

### Performance Optimization
- **Foreign Keys**: Automatically indexed for join performance
- **Frequently Queried Columns**: `role`, `species`, `status`, `alertType`
- **Date Ranges**: `vaccinationDate`, `scheduledDate` indexed for range queries
- **Geographic Queries**: `latitude`, `longitude` combined index for location-based searches
- **Lookups**: `email`, `microchipId`, `openId` indexed for quick searches

---

## Sample Data Summary

| Table | Records | Purpose |
|-------|---------|---------|
| users | 3 | 1 admin, 2 regular users |
| petOwners | 2 | Owner profiles |
| petBreeds | 7 | Available breeds |
| pets | 3 | Registered pets |
| vaccineTypes | 7 | Available vaccines |
| vaccinations | 4 | Historical records |
| vaccinationLocations | 3 | Clinic locations |
| vaccineInventory | 7 | Stock levels |
| reorderAlerts | 2 | Active alerts |
| vaccinationSchedules | 3 | Upcoming appointments |

---

## Backup & Recovery

### Recommended Backup Strategy
- **Frequency**: Daily automated backups
- **Retention**: 30 days minimum
- **Method**: Full backup + incremental backups
- **Storage**: Off-site redundant storage

### Recovery Procedures
1. Restore from latest backup
2. Apply transaction logs if available
3. Verify data integrity
4. Test application connectivity

---

## Performance Considerations

### Query Optimization Tips
1. Use indexes on foreign keys and frequently filtered columns
2. Avoid SELECT * queries; specify needed columns
3. Use LIMIT for pagination on large result sets
4. Consider denormalization for frequently joined tables
5. Monitor slow query logs regularly

### Scaling Strategies
- Implement read replicas for reporting queries
- Use connection pooling for concurrent access
- Archive old vaccination records to separate table
- Implement caching for reference data (breeds, vaccine types)

---

## Security Considerations

### Data Protection
- All user data encrypted at rest
- Sensitive fields (microchipId, phone) masked in logs
- Role-based access control enforced at application level
- Audit trail maintained via createdAt/updatedAt timestamps

### Access Control
- Admin role required for inventory management
- Users can only view their own pet records
- Location data is public for appointment scheduling
- Vaccination history visible only to pet owner and admins

---

## Migration & Deployment

### Database Setup
1. Execute `database_dump.sql` to create all tables
2. Verify all indexes are created
3. Test views for correct functionality
4. Validate foreign key relationships
5. Run integration tests

### Version Control
- Schema changes tracked in Drizzle migrations
- Sample data included for testing
- Backup of production data maintained separately

---

## Maintenance Tasks

### Regular Maintenance
- **Weekly**: Monitor reorder alerts, verify inventory accuracy
- **Monthly**: Archive old vaccination records, analyze query performance
- **Quarterly**: Review and optimize indexes, backup verification
- **Annually**: Database health check, capacity planning

### Monitoring
- Track database size growth
- Monitor query performance
- Alert on failed backups
- Review access logs for anomalies

---

## Conclusion

The Animal Bite Monitoring Tool database is designed with scalability, security, and data integrity in mind. The schema supports comprehensive vaccination management while maintaining referential integrity through appropriate constraints and relationships. Regular maintenance and monitoring ensure optimal performance and reliability.

For questions or modifications, refer to the Drizzle schema file (`drizzle/schema.ts`) and the generated migration files.
