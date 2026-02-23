# Animal Bite Monitoring Tool - Project Guide

## Overview

The Animal Bite Monitoring Tool is a comprehensive pet vaccination management system designed to help administrators and pet owners track vaccinations, manage inventory, and schedule appointments across multiple locations.

## Core Features Implemented

### 1. Role-Based Access Control
- **Admin Users**: Full access to dashboard, inventory management, location management, and scheduling
- **Regular Users**: Access to their pet profiles, vaccination history, and scheduling
- Authentication via Manus OAuth with automatic role assignment

### 2. Database Schema
The system includes 10 interconnected tables:
- **users**: Core authentication with role support
- **petOwners**: Pet owner profiles with contact information
- **petBreeds**: Reference table for pet breeds and species
- **pets**: Individual pet records with owner association
- **vaccineTypes**: Vaccine categories and information
- **vaccinations**: Complete vaccination history per pet
- **vaccinationLocations**: Clinic/center locations with coordinates
- **vaccineInventory**: Stock levels per vaccine per location
- **reorderAlerts**: Low stock and expiry notifications
- **vaccinationSchedules**: Planned vaccinations with scheduling

### 3. Backend API (tRPC)
All procedures are organized by feature with role-based access:

**Public Procedures**:
- `breed.getAll()` - List all pet breeds
- `location.getAll()` - List all vaccination locations
- `vaccineType.getAll()` - List all vaccine types

**Protected Procedures** (authenticated users):
- `petOwner.create()` - Create pet owner profile
- `petOwner.getProfile()` - Get current user's profile
- `petOwner.update()` - Update profile information
- `pet.create()` - Register a new pet
- `pet.getMyPets()` - Get user's pets
- `pet.getPetById()` - Get specific pet details
- `pet.update()` - Update pet information
- `vaccination.getByPetId()` - Get vaccination history
- `schedule.getByPetId()` - Get scheduled vaccinations

**Admin-Only Procedures**:
- `vaccination.create()` - Record vaccination
- `vaccination.getPending()` - Get pending vaccinations
- `vaccination.update()` - Update vaccination status
- `location.create()` - Add vaccination location
- `location.update()` - Update location details
- `inventory.create()` - Add inventory record
- `inventory.update()` - Update stock levels
- `inventory.getLowStock()` - Get low stock items
- `alert.getActive()` - Get active reorder alerts
- `alert.acknowledge()` - Acknowledge alert
- `alert.resolve()` - Resolve alert
- `schedule.create()` - Schedule vaccination
- `schedule.update()` - Update schedule status
- `dashboard.getKPIs()` - Get dashboard metrics
- `dashboard.getStockLevels()` - Get inventory levels

### 4. Frontend Pages

**Home Page** (`/`)
- Landing page with feature overview
- Authentication entry point
- Automatic redirect to dashboard for authenticated users

**Admin Dashboard** (`/admin/dashboard`)
- KPI cards showing:
  - Total scheduled vaccinations
  - Low vaccination requests
  - Pending vaccinations
- Vaccination stock level bar chart
- Reorder alerts list
- Quick action buttons

**User Dashboard** (`/dashboard`)
- Pet list with quick view
- Pet card showing breed and details
- Add new pet button
- Link to vaccination history

**Pet Management** (`/pets`)
- Pet registration form (placeholder)
- Pet profile management

**Vaccination History** (`/pets/:id/vaccinations`)
- Complete vaccination records per pet
- Vaccination dates, expiry dates, batch numbers
- Veterinarian information and notes

### 5. Testing
- 12 vitest tests covering:
  - Authentication flows
  - Role-based access control
  - Public vs protected procedures
  - Admin-only access enforcement
  - Dashboard KPI retrieval
  - Alert management

All tests passing: ✓ 12/12

## Architecture

### Tech Stack
- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express 4 + tRPC 11 + Drizzle ORM
- **Database**: MySQL/TiDB
- **Authentication**: Manus OAuth
- **Charts**: Recharts
- **UI Components**: shadcn/ui

### Project Structure
```
/client
  /src
    /pages          - Page components
    /components     - Reusable UI components
    /contexts       - React contexts
    /lib            - Utilities and tRPC client
    /index.css      - Global styles
    App.tsx         - Main routing

/server
  /routers.ts       - tRPC procedure definitions
  /db.ts            - Database query helpers
  /routers.test.ts  - API tests

/drizzle
  /schema.ts        - Database schema
  /migrations       - SQL migrations

/shared
  - Shared constants and types
```

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL/TiDB database connection

### Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   - Database connection string in `DATABASE_URL`
   - OAuth credentials (automatically provided by Manus)

3. **Run development server**:
   ```bash
   pnpm dev
   ```

4. **Run tests**:
   ```bash
   pnpm test
   ```

5. **Type checking**:
   ```bash
   pnpm check
   ```

## Usage Workflows

### Admin Workflow
1. Login with admin credentials
2. View dashboard KPIs and alerts
3. Manage vaccination locations and inventory
4. Schedule vaccinations for pets
5. Monitor stock levels and reorder alerts

### User Workflow
1. Login with user credentials
2. Register pet owner profile
3. Add pets with breed information
4. View vaccination history
5. Schedule vaccinations at available locations

## Key Implementation Details

### Role-Based Access
- Implemented via `adminProcedure` helper in tRPC
- Checks `ctx.user.role` for authorization
- Throws `FORBIDDEN` error for unauthorized access
- Frontend conditionally renders based on `useAuth().user?.role`

### Data Relationships
- Pet owners linked to users via `userId`
- Pets linked to owners and breeds
- Vaccinations linked to pets and vaccine types
- Inventory linked to vaccines and locations
- Schedules linked to pets, locations, and vaccines

### Dashboard KPIs
- **Scheduled Vaccinations**: Count of records with status='scheduled'
- **Low Vaccination Requests**: Count of pending vaccinations
- **Pending Vaccinations**: Count of records with status='pending'

### Stock Alerts
- Triggered when `quantityInStock <= reorderThreshold`
- Tracked in `reorderAlerts` table with status tracking
- Admin can acknowledge or resolve alerts

## Future Enhancements

### Phase 2 (Planned)
- [ ] Google Maps integration for location visualization
- [ ] Calendar view for vaccination scheduling
- [ ] Pet owner registration forms
- [ ] Vaccination record creation forms
- [ ] Email notifications for appointments
- [ ] SMS alerts for low stock
- [ ] Advanced reporting and analytics
- [ ] Batch operations for inventory management
- [ ] Appointment reminders
- [ ] Vaccination certificate generation

### Phase 3 (Planned)
- [ ] Mobile app version
- [ ] QR code scanning for pet identification
- [ ] Integration with veterinary management systems
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Custom report generation
- [ ] API rate limiting and security hardening

## Database Queries

### Common Queries

**Get all vaccinations for a pet**:
```typescript
const vaccinations = await db.getVaccinationsByPetId(petId);
```

**Get low stock inventory**:
```typescript
const lowStock = await db.getLowStockInventory();
```

**Get active reorder alerts**:
```typescript
const alerts = await db.getActiveReorderAlerts();
```

**Get scheduled vaccinations**:
```typescript
const scheduled = await db.getScheduledVaccinations();
```

## Security Considerations

1. **Authentication**: All procedures require Manus OAuth authentication
2. **Authorization**: Role-based access control enforced at procedure level
3. **Data Isolation**: Users can only access their own pet data
4. **Admin Verification**: Admin operations require explicit admin role
5. **Error Handling**: Sensitive errors logged but generic messages returned to client

## Performance Optimizations

1. **Database Indexes**: Created on frequently queried fields
2. **Query Optimization**: Using Drizzle ORM for efficient queries
3. **Caching**: tRPC automatic query caching via React Query
4. **Lazy Loading**: Pages load data on demand
5. **Pagination**: Ready for implementation in future versions

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check database credentials
- Ensure database server is running

### Authentication Issues
- Clear browser cookies and try again
- Verify OAuth credentials are configured
- Check browser console for error messages

### API Errors
- Check server logs for detailed error messages
- Verify user has appropriate role for operation
- Ensure required fields are provided in requests

## Support & Contribution

For issues or feature requests, please refer to the project documentation or contact the development team.

## License

This project is proprietary and confidential.
