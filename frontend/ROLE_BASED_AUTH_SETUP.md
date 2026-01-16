# Role-Based Authentication Setup Guide

## Overview
This project uses **Clerk** for authentication and **MongoDB** for storing user profiles with role-based access control (RBAC).

## Features
- ✅ Clerk authentication (Google, Email, etc.)
- ✅ MongoDB user profile storage
- ✅ Role-based access control
- ✅ Complete profile flow for new users
- ✅ Automatic role-based redirects

## User Roles
- `doctor` - Healthcare providers
- `patient` - Patients
- `nurse` - Nursing staff
- `admin` - System administrators
- `caretaker` - Family members/caretakers
- `lab_reporter` - Laboratory staff

## Setup Instructions

### 1. MongoDB Setup

**Option A: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
4. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hackcrypt
   ```

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB: `mongod`
3. Use default connection string in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/hackcrypt
   ```

### 2. Clerk Webhook Setup (Optional but Recommended)

Webhooks keep user data synced between Clerk and MongoDB.

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Webhooks** section
3. Click **Add Endpoint**
4. Set endpoint URL: `https://your-domain.com/api/webhooks/clerk`
5. Subscribe to events:
   - `user.updated`
   - `user.deleted`
6. Copy the **Signing Secret**
7. Add to `.env`:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 3. Environment Variables

Complete `.env` file should have:
```env
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# MongoDB
MONGO_URI=mongodb://localhost:27017/hackcrypt

# Clerk Webhook (optional)
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

## User Flow

1. **Sign Up/Sign In** → User authenticates with Clerk
2. **Complete Profile** → User fills role, phone, DOB, gender
3. **Role-Based Redirect** → User directed to appropriate dashboard:
   - Doctors → `/doctor/dashboard`
   - Patients → `/patient/dashboard`
   - Admin → `/admin/dashboard`
   - Others → Default dashboard

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── users/
│   │   │   └── create-profile/
│   │   │       └── route.ts          # Profile creation API
│   │   └── webhooks/
│   │       └── clerk/
│   │           └── route.ts          # Clerk webhook handler
│   ├── complete-profile/
│   │   └── page.tsx                  # Profile completion form
│   ├── doctor/
│   │   └── dashboard/
│   │       └── page.tsx              # Doctor dashboard
│   ├── unauthorized/
│   │   └── page.tsx                  # Access denied page
│   └── page.tsx                      # Home (role-based redirect)
├── components/
│   └── RoleBasedAccess.tsx          # RBAC wrapper component
├── lib/
│   ├── mongodb.ts                    # MongoDB connection
│   └── getUserData.ts                # User data utilities
├── models/
│   └── User.ts                       # MongoDB user schema
└── middleware.ts                     # Route protection
```

## Using Role-Based Access Control

### Server Component (Recommended)
```tsx
import { RoleBasedAccess } from "@/components/RoleBasedAccess";

export default async function AdminPage() {
  return (
    <RoleBasedAccess allowedRoles={["admin", "doctor"]}>
      <div>This content is only visible to admins and doctors</div>
    </RoleBasedAccess>
  );
}
```

### Helper Functions
```tsx
import { getUserRole, isDoctor, isAdmin } from "@/lib/getUserData";

// Get current user's role
const role = await getUserRole(); // returns "doctor" | "patient" | etc.

// Check specific role
const doctorAccess = await isDoctor(); // returns boolean
const adminAccess = await isAdmin(); // returns boolean
```

## API Endpoints

### POST `/api/users/create-profile`
Creates or updates user profile in MongoDB.

**Body:**
```json
{
  "phone": "1234567890",
  "role": "doctor",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

### POST `/api/webhooks/clerk`
Handles Clerk webhook events for user sync.

## Security Features

- ✅ Server-side role verification
- ✅ Protected routes via middleware
- ✅ MongoDB connection with environment variables
- ✅ Clerk authentication required for all protected routes
- ✅ Role validation before accessing sensitive pages

## Troubleshooting

### "MongoDB connection error"
- Check `MONGO_URI` in `.env`
- Ensure MongoDB is running (for local setup)
- Check network access in MongoDB Atlas (for cloud)

### "User role not found"
- User hasn't completed profile
- Check MongoDB to verify user document exists
- Clear cache and re-login

### "Access Denied"
- User role doesn't match allowed roles
- Update user role in MongoDB or adjust page access control

## Next Steps

1. **Add Patient Dashboard**: Create `/app/patient/dashboard/page.tsx`
2. **Add Admin Dashboard**: Create `/app/admin/dashboard/page.tsx`
3. **Protect Other Routes**: Use `RoleBasedAccess` component on sensitive pages
4. **Add Role Management**: Create UI for admins to change user roles

## Support

For issues or questions, check:
- [Clerk Documentation](https://clerk.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
