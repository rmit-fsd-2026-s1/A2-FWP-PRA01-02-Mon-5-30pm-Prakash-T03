**Group details**: A2-FWP-PRA01-02-Mon-5-30pm-Prakash-T03
**Names**: Effin Justin
**Student IDs**: s4132102
**Github Repo URL**: `https://github.com/rmit-fsd-2026-s1/A2-FWP-PRA01-02-Mon-5-30pm-Prakash-T03.git`

# Venue Vendors Full Stack Application

This repository has been restructured into **four separate projects** to fulfill the requirements of Assignment 2 (specifically separating the main client system from the admin controls):

1. **`frontend/`**: The React TS client app for Hirers and Vendors.
2. **`backend/`**: The Node/Express REST API serving the main client.
3. **`admin-frontend/`**: The standalone Admin Console React TS app (isolated from the main client).
4. **`admin-backend/`**: The standalone Admin GraphQL API.

---

## Port Assignments & Services

*   **Main Customer Frontend**: `https://venue-vendors-frontend-app.onrender.com/`
*   **Main Customer REST Backend**: `https://venue-vendor-backend-api.onrender.com`
*   **Admin Dashboard Frontend**: `https://venue-vendors-admin-frontend-app.onrender.com/`
*   **Admin GraphQL Backend**: `https://venue-vendors-admin-backend-api.onrender.com`

---

## Database Configuration

All backend services share a MySQL database. Ensure your local MySQL server is active.

### 1. Main REST Backend Setup
In the `backend/` directory, configure the `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=venue_vendors
JWT_SECRET=your_jwt_secret_here
```

### 2. Admin GraphQL Backend Setup
In the `admin-backend/` directory, configure the `.env` file:
```env
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=venue_vendors
JWT_SECRET=your_jwt_secret_here
```

### 3. Database Sync
TypeORM is configured with `synchronize: true` in development mode, which automatically creates the necessary database schema and tables upon backend server initialization.

---

## Running the Application Locally

To start the dev servers, run the respective commands in separate terminal shells:

### 1. Main Client Website
```bash
cd frontend
npm install
npm run dev
```

### 2. Main REST API
```bash
cd backend
npm install
npm run start
```

### 3. Admin Dashboard
```bash
cd admin-frontend
npm install
npm run dev
```

### 4. Admin GraphQL Server
```bash
cd admin-backend
npm install --legacy-peer-deps
npm run start
```

---

## Testing Verification

Unit tests are included for both backend environments to verify the integrity of the endpoints:

### Main Backend Tests (REST)
Includes 6 unit tests validating Auth validation, JWT middleware, document credibility scores, and REST CRUD actions:
```bash
cd backend
npm run test
```

### Admin Backend Tests (GraphQL)
Includes 6 unit tests validating Admin GraphQL login credentials (`admin` / `admin`), queries, and administrative mutations:
```bash
cd admin-backend
npm run test
```
