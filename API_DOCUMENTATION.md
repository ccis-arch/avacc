# Animal Bite Monitoring Tool - API Documentation

## Overview

The Animal Bite Monitoring Tool uses **tRPC** (TypeScript RPC) for type-safe API communication. All procedures are organized by feature modules and enforce role-based access control.

---

## Authentication & Authorization

### Authentication Flow
1. User initiates OAuth login via Manus OAuth portal
2. Callback handler creates/updates user session
3. Session cookie stored for subsequent requests
4. Each tRPC call includes authenticated user context

### Authorization Levels
- **Public Procedures**: No authentication required
- **Protected Procedures**: User must be authenticated
- **Admin Procedures**: User must have 'admin' role

---

## API Procedures

### Authentication Module (`trpc.auth`)

#### `auth.me` - Get Current User
**Type**: Public Query
**Description**: Retrieve current authenticated user information
**Input**: None
**Output**: 
```typescript
{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
} | null
```
**Example**:
```typescript
const { data: user } = trpc.auth.me.useQuery();
```

---

#### `auth.logout` - Logout User
**Type**: Protected Mutation
**Description**: Clear session cookie and logout user
**Input**: None
**Output**: 
```typescript
{ success: boolean }
```
**Example**:
```typescript
const logout = trpc.auth.logout.useMutation();
await logout.mutateAsync();
```

---

### Pet Owner Module (`trpc.petOwner`)

#### `petOwner.create` - Register Pet Owner
**Type**: Protected Mutation
**Description**: Create a new pet owner profile
**Input**:
```typescript
{
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}
```
**Output**: 
```typescript
{
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  // ... other fields
}
```
**Authorization**: Protected (any authenticated user)
**Example**:
```typescript
const createOwner = trpc.petOwner.create.useMutation();
await createOwner.mutateAsync({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com'
});
```

---

#### `petOwner.getProfile` - Get Owner Profile
**Type**: Protected Query
**Description**: Retrieve current user's pet owner profile
**Input**: None
**Output**: PetOwner object or null
**Authorization**: Protected
**Example**:
```typescript
const { data: profile } = trpc.petOwner.getProfile.useQuery();
```

---

#### `petOwner.update` - Update Owner Profile
**Type**: Protected Mutation
**Description**: Update pet owner information
**Input**: Partial PetOwner fields
**Output**: Updated PetOwner object
**Authorization**: Protected (can only update own profile)
**Example**:
```typescript
const updateOwner = trpc.petOwner.update.useMutation();
await updateOwner.mutateAsync({
  phone: '+1-555-0123'
});
```

---

### Pet Module (`trpc.pet`)

#### `pet.create` - Register New Pet
**Type**: Protected Mutation
**Description**: Register a new pet for the authenticated user
**Input**:
```typescript
{
  name: string;
  breedId: number;
  dateOfBirth?: Date;
  microchipId?: string;
  weight?: number;
  notes?: string;
}
```
**Output**: 
```typescript
{
  id: number;
  ownerId: number;
  breedId: number;
  name: string;
  dateOfBirth: Date | null;
  microchipId: string | null;
  weight: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```
**Authorization**: Protected
**Example**:
```typescript
const createPet = trpc.pet.create.useMutation();
await createPet.mutateAsync({
  name: 'Max',
  breedId: 1,
  dateOfBirth: new Date('2020-03-15'),
  microchipId: 'CHIP-001'
});
```

---

#### `pet.getMyPets` - Get User's Pets
**Type**: Protected Query
**Description**: Retrieve all pets owned by authenticated user
**Input**: None
**Output**: Array of Pet objects
**Authorization**: Protected
**Example**:
```typescript
const { data: pets } = trpc.pet.getMyPets.useQuery();
```

---

#### `pet.getById` - Get Pet Details
**Type**: Protected Query
**Description**: Retrieve specific pet information
**Input**: 
```typescript
{ id: number }
```
**Output**: Pet object with related data
**Authorization**: Protected (can only view own pets)
**Example**:
```typescript
const { data: pet } = trpc.pet.getById.useQuery({ id: 1 });
```

---

#### `pet.update` - Update Pet Information
**Type**: Protected Mutation
**Description**: Update pet details
**Input**: Pet ID and fields to update
**Output**: Updated Pet object
**Authorization**: Protected (can only update own pets)
**Example**:
```typescript
const updatePet = trpc.pet.update.useMutation();
await updatePet.mutateAsync({
  id: 1,
  name: 'Maxwell',
  weight: 33.5
});
```

---

#### `pet.delete` - Delete Pet Record
**Type**: Protected Mutation
**Description**: Delete a pet record
**Input**: 
```typescript
{ id: number }
```
**Output**: 
```typescript
{ success: boolean }
```
**Authorization**: Protected (can only delete own pets)
**Example**:
```typescript
const deletePet = trpc.pet.delete.useMutation();
await deletePet.mutateAsync({ id: 1 });
```

---

### Breed Module (`trpc.breed`)

#### `breed.getAll` - Get All Breeds
**Type**: Public Query
**Description**: Retrieve all available pet breeds
**Input**: None
**Output**: Array of PetBreed objects
**Authorization**: Public
**Example**:
```typescript
const { data: breeds } = trpc.breed.getAll.useQuery();
```

---

#### `breed.getBySpecies` - Get Breeds by Species
**Type**: Public Query
**Description**: Retrieve breeds for specific species
**Input**: 
```typescript
{ species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other' }
```
**Output**: Array of PetBreed objects
**Authorization**: Public
**Example**:
```typescript
const { data: dogBreeds } = trpc.breed.getBySpecies.useQuery({ 
  species: 'dog' 
});
```

---

### Vaccine Type Module (`trpc.vaccineType`)

#### `vaccineType.getAll` - Get All Vaccine Types
**Type**: Public Query
**Description**: Retrieve all available vaccine types
**Input**: None
**Output**: Array of VaccineType objects
**Authorization**: Public
**Example**:
```typescript
const { data: vaccines } = trpc.vaccineType.getAll.useQuery();
```

---

#### `vaccineType.getByCategory` - Get Vaccines by Category
**Type**: Public Query
**Description**: Retrieve vaccines by category (Core/Non-Core)
**Input**: 
```typescript
{ category: string }
```
**Output**: Array of VaccineType objects
**Authorization**: Public
**Example**:
```typescript
const { data: coreVaccines } = trpc.vaccineType.getByCategory.useQuery({ 
  category: 'Core' 
});
```

---

### Vaccination Module (`trpc.vaccination`)

#### `vaccination.getByPetId` - Get Pet's Vaccination History
**Type**: Protected Query
**Description**: Retrieve vaccination history for a specific pet
**Input**: 
```typescript
{ petId: number }
```
**Output**: Array of Vaccination objects with related data
**Authorization**: Protected (can only view own pets)
**Example**:
```typescript
const { data: history } = trpc.vaccination.getByPetId.useQuery({ 
  petId: 1 
});
```

---

#### `vaccination.create` - Record Vaccination
**Type**: Admin Mutation
**Description**: Create a new vaccination record
**Input**:
```typescript
{
  petId: number;
  vaccineTypeId: number;
  vaccinationDate: Date;
  expiryDate?: Date;
  locationId?: number;
  batchNumber?: string;
  veterinarian?: string;
  notes?: string;
}
```
**Output**: Vaccination object
**Authorization**: Admin only
**Example**:
```typescript
const recordVaccine = trpc.vaccination.create.useMutation();
await recordVaccine.mutateAsync({
  petId: 1,
  vaccineTypeId: 1,
  vaccinationDate: new Date(),
  batchNumber: 'BATCH-2024-001'
});
```

---

### Location Module (`trpc.location`)

#### `location.getAll` - Get All Vaccination Locations
**Type**: Public Query
**Description**: Retrieve all vaccination clinic locations
**Input**: None
**Output**: Array of VaccinationLocation objects
**Authorization**: Public
**Example**:
```typescript
const { data: locations } = trpc.location.getAll.useQuery();
```

---

#### `location.getById` - Get Location Details
**Type**: Public Query
**Description**: Retrieve specific location information
**Input**: 
```typescript
{ id: number }
```
**Output**: VaccinationLocation object
**Authorization**: Public
**Example**:
```typescript
const { data: location } = trpc.location.getById.useQuery({ id: 1 });
```

---

#### `location.create` - Create New Location
**Type**: Admin Mutation
**Description**: Add a new vaccination clinic location
**Input**:
```typescript
{
  name: string;
  address: string;
  city: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  operatingHours?: string;
}
```
**Output**: VaccinationLocation object
**Authorization**: Admin only
**Example**:
```typescript
const createLocation = trpc.location.create.useMutation();
await createLocation.mutateAsync({
  name: 'New Clinic',
  address: '123 Main St',
  city: 'Springfield'
});
```

---

### Inventory Module (`trpc.inventory`)

#### `inventory.getByLocation` - Get Location Inventory
**Type**: Admin Query
**Description**: Retrieve vaccine inventory for a specific location
**Input**: 
```typescript
{ locationId: number }
```
**Output**: Array of VaccineInventory objects
**Authorization**: Admin only
**Example**:
```typescript
const { data: inventory } = trpc.inventory.getByLocation.useQuery({ 
  locationId: 1 
});
```

---

#### `inventory.updateStock` - Update Stock Level
**Type**: Admin Mutation
**Description**: Update vaccine stock quantity
**Input**:
```typescript
{
  inventoryId: number;
  quantityInStock: number;
  lastRestockedDate?: Date;
}
```
**Output**: Updated VaccineInventory object
**Authorization**: Admin only
**Example**:
```typescript
const updateStock = trpc.inventory.updateStock.useMutation();
await updateStock.mutateAsync({
  inventoryId: 1,
  quantityInStock: 45
});
```

---

### Alert Module (`trpc.alert`)

#### `alert.getActive` - Get Active Alerts
**Type**: Admin Query
**Description**: Retrieve all active reorder and expiry alerts
**Input**: None
**Output**: Array of ReorderAlert objects with related data
**Authorization**: Admin only
**Example**:
```typescript
const { data: alerts } = trpc.alert.getActive.useQuery();
```

---

#### `alert.acknowledge` - Acknowledge Alert
**Type**: Admin Mutation
**Description**: Mark an alert as acknowledged
**Input**: 
```typescript
{ alertId: number }
```
**Output**: Updated ReorderAlert object
**Authorization**: Admin only
**Example**:
```typescript
const ackAlert = trpc.alert.acknowledge.useMutation();
await ackAlert.mutateAsync({ alertId: 1 });
```

---

### Schedule Module (`trpc.schedule`)

#### `schedule.getByPetId` - Get Pet's Schedules
**Type**: Protected Query
**Description**: Retrieve vaccination schedules for a pet
**Input**: 
```typescript
{ petId: number }
```
**Output**: Array of VaccinationSchedule objects
**Authorization**: Protected (can only view own pets)
**Example**:
```typescript
const { data: schedules } = trpc.schedule.getByPetId.useQuery({ 
  petId: 1 
});
```

---

#### `schedule.create` - Schedule Vaccination
**Type**: Admin Mutation
**Description**: Create a new vaccination appointment
**Input**:
```typescript
{
  locationId: number;
  petId: number;
  vaccineTypeId: number;
  scheduledDate: Date;
  scheduledTime?: string;
  notes?: string;
}
```
**Output**: VaccinationSchedule object
**Authorization**: Admin only
**Example**:
```typescript
const scheduleVaccine = trpc.schedule.create.useMutation();
await scheduleVaccine.mutateAsync({
  locationId: 1,
  petId: 1,
  vaccineTypeId: 1,
  scheduledDate: new Date('2025-02-15'),
  scheduledTime: '10:00'
});
```

---

### Dashboard Module (`trpc.dashboard`)

#### `dashboard.getKPIs` - Get Dashboard KPIs
**Type**: Admin Query
**Description**: Retrieve key performance indicators for dashboard
**Input**: None
**Output**:
```typescript
{
  totalScheduledVaccinations: number;
  lowVaccinationRequests: number;
  pendingVaccinations: number;
}
```
**Authorization**: Admin only
**Example**:
```typescript
const { data: kpis } = trpc.dashboard.getKPIs.useQuery();
```

---

#### `dashboard.getStockLevels` - Get Stock Levels
**Type**: Admin Query
**Description**: Retrieve vaccine stock levels across all locations
**Input**: None
**Output**: Array of VaccineInventory objects
**Authorization**: Admin only
**Example**:
```typescript
const { data: stock } = trpc.dashboard.getStockLevels.useQuery();
```

---

## Error Handling

### Error Response Format
```typescript
{
  code: string; // 'UNAUTHORIZED', 'FORBIDDEN', 'NOT_FOUND', 'BAD_REQUEST', etc.
  message: string; // Human-readable error message
  cause?: unknown; // Additional error details
}
```

### Common Error Codes
| Code | HTTP | Description |
|------|------|-------------|
| `UNAUTHORIZED` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `BAD_REQUEST` | 400 | Invalid input parameters |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Error Handling Example
```typescript
const createPet = trpc.pet.create.useMutation({
  onError: (error) => {
    if (error.code === 'UNAUTHORIZED') {
      // Redirect to login
    } else if (error.code === 'BAD_REQUEST') {
      // Show validation error
      console.error(error.message);
    }
  }
});
```

---

## Pagination & Filtering

### Pagination Pattern
```typescript
{
  limit: number;      // Items per page
  offset: number;     // Starting position
  sortBy?: string;    // Sort field
  sortOrder?: 'asc' | 'desc';
}
```

### Filtering Pattern
```typescript
{
  filters: {
    status?: string;
    city?: string;
    dateRange?: { start: Date; end: Date };
  }
}
```

---

## Type Safety

### TypeScript Integration
All procedures are fully typed. The tRPC client provides complete type inference:

```typescript
// Input type automatically inferred
const createPet = trpc.pet.create.useMutation();
await createPet.mutateAsync({
  name: 'Max',
  breedId: 1,
  // TypeScript error if missing required fields
});

// Output type automatically inferred
const { data: pet } = trpc.pet.getById.useQuery({ id: 1 });
// pet is typed as Pet | undefined
```

---

## Rate Limiting

**Current Status**: Not implemented
**Recommended**: Implement rate limiting for production
- 100 requests per minute per user
- 1000 requests per minute per IP
- Exponential backoff for repeated failures

---

## Caching Strategy

### Query Caching
- Breed data: 24 hours (rarely changes)
- Location data: 1 hour (occasionally updated)
- User data: Session duration
- Inventory data: 5 minutes (frequently updated)

### Cache Invalidation
```typescript
const utils = trpc.useUtils();
// Invalidate specific query
await utils.pet.getMyPets.invalidate();
// Invalidate entire router
await utils.invalidate();
```

---

## Testing

### Example Test
```typescript
import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('Pet API', () => {
  it('should create a pet', async () => {
    const caller = appRouter.createCaller(mockContext);
    const result = await caller.pet.create({
      name: 'Max',
      breedId: 1
    });
    expect(result.name).toBe('Max');
  });
});
```

---

## Best Practices

### Client-Side
1. Use optimistic updates for better UX
2. Handle loading and error states
3. Invalidate related queries on mutations
4. Use `useQuery` for data fetching, `useMutation` for modifications
5. Implement proper error boundaries

### Server-Side
1. Validate all inputs with Zod
2. Check user permissions in procedures
3. Log important actions for audit trail
4. Use transactions for multi-step operations
5. Return only necessary fields

---

## Migration Guide

### From REST to tRPC
```typescript
// Before (REST)
const response = await fetch('/api/pets', {
  method: 'POST',
  body: JSON.stringify({ name: 'Max', breedId: 1 })
});

// After (tRPC)
const createPet = trpc.pet.create.useMutation();
await createPet.mutateAsync({ name: 'Max', breedId: 1 });
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-11 | Initial API release with core procedures |

---

## Support & Feedback

For API issues or feature requests, please refer to the project documentation or contact the development team.
