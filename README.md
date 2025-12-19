# Inventory Management System

A comprehensive, full-stack inventory management application built with **React**, **Node.js**, **Express**, and **MongoDB**. Designed for healthcare facilities and retail businesses to manage stock levels, track expiring items, and generate detailed reports.

---

## Table of Contents

- [Features](#features)
- [Architecture] (#Architecture-Overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Models](#database-models)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Multi-Branch Support**: Manage inventory across multiple branches/locations
- **Inventory Categories**: Organize items by type (Medications, Consumables, General, Apparatus, Skincare, Medication Fridge)
- **Real-Time Stock Tracking**: Monitor stock levels in real-time
- **Expiry Management**: Track expiring and expired items with alerts
- **Low Stock Alerts**: Automatic notifications for items below minimum stock
- **Stock Adjustments**: Add or remove stock with reason tracking
- **Item Search & Filter**: Quick search and filter by category, stock status, expiry date
- **Dashboard Analytics**: Visual reports and charts for revenue and stock insights
- **User Authentication**: Secure login with JWT tokens
- **Role-Based Access**: Different permission levels for users

### Advanced Features
- **Batch Operations**: Bulk updates for items
- **Export Reports**: Generate detailed inventory reports
- **Notification System**: Real-time alerts for critical stock situations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Optional dark theme (if implemented)

---

# Inventory Management System - System Design

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite)                                        │   │
│  │  - Components (Sidebar, Header, Dashboard, etc.)        │   │
│  │  - Pages (Inventory, Reports, Settings)                 │   │
│  │  - Context API (UserContext)                            │   │
│  │  - Routing (React Router)                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTP / REST API / JSON
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Server                                       │   │
│  │  - CORS middleware                                       │   │
│  │  - Request validation                                    │   │
│  │  - Authentication middleware (JWT)                      │   │
│  │  - Rate limiting                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Controllers                                             │   │
│  │  - itemController.js                                    │   │
│  │  - userController.js                                    │   │
│  │  - notificationController.js                            │   │
│  │  - reportController.js                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services                                                │   │
│  │  - itemService.js                                       │   │
│  │  - notificationService.js                               │   │
│  │  - emailService.js                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mongoose Models                                         │   │
│  │  - Item                                                  │   │
│  │  - User                                                  │   │
│  │  - Branch                                                │   │
│  │  - Notification                                          │   │
│  │  - AuditLog                                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MongoDB (Atlas Cloud)                                   │   │
│  │  - Collections with indexes                             │   │
│  │  - Replication & Backup                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Action (Frontend)
        │
        ├─► HTTP Request (Axios)
        │
        ├─► Express Route Handler
        │
        ├─► Authentication Middleware (verify JWT)
        │
        ├─► Authorization Check (role-based)
        │
        ├─► Controller Logic
        │   ├─► Input Validation
        │   ├─► Call Service Layer
        │   └─► Format Response
        │
        ├─► Service Layer
        │   ├─► Business Logic
        │   ├─► Database Query via Mongoose
        │   ├─► Trigger Notifications/Emails
        │   └─► Return Data
        │
        ├─► MongoDB Query
        │   ├─► Execute with indexes
        │   ├─► Apply filters/pagination
        │   └─► Return results
        │
        ├─► HTTP Response (JSON)
        │
        └─► Frontend (React)
            ├─► Update State
            ├─► Re-render UI
            └─► Display Results
```

---

## Database Schema

### Collections & Relationships

```
┌──────────────────────┐
│      Branch          │
├──────────────────────┤
│ _id (PK)             │
│ name                 │
│ location             │
│ createdAt            │
└──────────────────────┘
         │ (1:M)
         │
    ┌────┴─────┬──────────────┬────────────────┐
    │           │              │                │
┌───▼────┐  ┌───▼────┐  ┌─────▼────┐  ┌─────▼─────┐
│  User  │  │  Item  │  │   Notif  │  │ AuditLog  │
├────────┤  ├────────┤  ├──────────┤  ├───────────┤
│ _id    │  │ _id    │  │ _id      │  │ _id       │
│ email  │  │ name   │  │ type     │  │ action    │
│ pwd    │  │ cat    │  │ message  │  │ itemId    │
│ role   │  │ qty    │  │ itemId   │  │ userId    │
│ branch │  │ min    │  │ read     │  │ timestamp │
└────────┘  │ expiry │  │ branch   │  └───────────┘
            │ branch │  └──────────┘
            └────────┘
```

---

## Component Architecture

### Frontend Structure

```
App.jsx
├── Routes
│   ├── /login → LoginPage
│   ├── /register → RegisterPage
│   └── /dashboard (Protected)
│       ├── Layout
│       │   ├── Header
│       │   ├── Sidebar
│       │   └── MainContent
│       │
│       ├── /dashboard → Dashboard
│       ├── /dashboard/inventory → Inventory
│       │   ├── /inventory/medication
│       │   ├── /inventory/consumables
│       │   ├── /inventory/general
│       │   └── ...
│       ├── /dashboard/add-item → AddItem
│       ├── /dashboard/adjust-stock → AdjustStock
│       ├── /dashboard/report → Report
│       └── /dashboard/settings → Settings
│
├── Contexts
│   └── UserContext
│       ├── user
│       ├── login()
│       ├── logout()
│       └── updateUser()
│
└── Services
    ├── api.js (axios instance)
    └── itemService.js
```

### Backend Structure

```
server.js (Entry point)
├── Middleware
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validation.js
│
├── Routes
│   ├── /api/users
│   │   ├── POST /login
│   │   ├── POST /register
│   │   └── POST /logout
│   ├── /api/items
│   │   ├── GET / (paginated)
│   │   ├── POST /
│   │   ├── PUT /:id
│   │   ├── DELETE /:id
│   │   ├── GET /lowstock
│   │   ├── GET /expired
│   │   └── GET /:category
│   ├── /api/notifications
│   └── /api/reports
│
├── Controllers
│   ├── itemController.js
│   ├── userController.js
│   ├── notificationController.js
│   └── reportController.js
│
├── Services
│   ├── itemService.js
│   ├── notificationService.js
│   └── emailService.js
│
├── Models
│   ├── Item.js
│   ├── User.js
│   ├── Branch.js
│   ├── Notification.js
│   └── AuditLog.js
│
└── Utils
    └── errorHandler.js
```

---

## Authentication & Authorization Flow

```
┌──────────────────────────────────────────────┐
│         User Login Request                   │
│  {email: "user@example.com", pwd: "***"}     │
└──────────────────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │  Find user in DB         │
        │  by email                │
        └──────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
    ┌───▼────┐           ┌─────▼────┐
    │Found   │           │Not Found │
    └───┬────┘           └────┬─────┘
        │                     │
        ▼                     ▼
    ┌─────────────┐    ┌──────────────┐
    │Compare      │    │Return Error  │
    │passwords    │    │401 Auth Fail │
    │(bcrypt)     │    └──────────────┘
    └─────┬───────┘
          │
    ┌─────┴──────────────┐
    │                    │
┌───▼────┐        ┌─────▼────┐
│Match   │        │No Match  │
└───┬────┘        └────┬─────┘
    │                  │
    ▼                  ▼
┌──────────────┐  ┌──────────────┐
│Generate JWT  │  │Return Error  │
│(user._id,    │  │401 Auth Fail │
│ role,        │  └──────────────┘
│ branchId)    │
└───┬──────────┘
    │
    ▼
┌─────────────────────────────┐
│Return JWT + User Info       │
│Store in localStorage        │
└─────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│Include JWT in every request  │
│Authorization: Bearer <JWT>   │
└──────────────────────────────┘
    │
    ▼
┌──────────────────────────────┐
│Verify JWT Middleware         │
│- Decode token                │
│- Check expiration            │
│- Extract user info           │
└──────────────────────────────┘
```

---

## Scalability & Performance Strategy

### Database Indexing
```javascript
// Item collection indexes
itemSchema.index({ branchId: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ expiryDate: 1 });
itemSchema.index({ stockLevel: 1 });
itemSchema.index({ branchId: 1, category: 1 });
itemSchema.index({ branchId: 1, itemCode: 1 }, { unique: true });

// User collection indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ branchId: 1 });

// Notification collection indexes
notificationSchema.index({ branchId: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ branchId: 1, isRead: 1 });
```

### Query Optimization
```javascript
// Bad: Fetch all fields
const items = await Item.find();

// Good: Fetch only needed fields (projection)
const items = await Item.find({}, 'name stockLevel category').lean();

// Bad: Multiple queries in loop
for (let item of items) {
  const detail = await Item.findById(item._id);
}

// Good: Lean query + pagination
const items = await Item.find()
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();
```

### Caching Strategy
```
Request
   │
   ▼
Check Redis Cache
   │
   ├─► Hit (return cached data)
   │
   └─► Miss
       │
       ▼
   Query MongoDB
       │
       ▼
   Store in Cache (TTL: 5-10 min)
       │
       ▼
   Return to Client
```

### Load Balancing (Production)
```
                    ┌──────────────┐
                    │ Load Balancer│
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
        ┌──▼──┐         ┌──▼──┐         ┌──▼──┐
        │API-1│         │API-2│         │API-3│
        └──┬──┘         └──┬──┘         └──┬──┘
           │               │               │
           └───────────────┼───────────────┘
                           │
                    ┌──────▼──────┐
                    │  MongoDB    │
                    │  (Primary)  │
                    └─────────────┘
```

---

## 🔔 Notification System

```
Item Stock Changed / Expired
        │
        ▼
Trigger Event
        │
        ▼
Check Notification Rules
├─► Low Stock? (qty < minStock)
├─► Expired? (expiryDate < today)
└─► Critical Alert? (qty = 0)
        │
        ▼
Create Notification Record
        │
        ├─► Save to MongoDB
        │
        └─► Send Email/SMS (optional)
            ├─► Nodemailer
            └─► SMS API (Twilio, etc.)
```

---

## 📊 Report Generation Flow

```
Report Request
├─► Date Range Filter
├─► Category Filter
├─► Branch Filter
        │
        ▼
Query MongoDB (aggregation)
├─► $match (filters)
├─► $group (by category/date)
├─► $sum (quantities)
└─► $sort
        │
        ▼
Format Data
├─► Calculate totals
├─► Calculate percentages
└─► Generate charts (Chart.js)
        │
        ▼
Return JSON / PDF Export
```

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend: http://localhost:5173 (Vite dev server)
├── Backend: http://localhost:5000 (Node + Nodemon)
└── Database: MongoDB Atlas (cloud)
```

### Production Environment
```
┌─────────────────────────────────┐
│       CDN (Cloudflare)          │
│  - Static assets caching        │
│  - Global distribution          │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│   Hosting Platform              │
│   (Render, Railway, Heroku)     │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐   │
│  │ Frontend Build (React)   │   │
│  │ - Optimized bundle       │   │
│  │ - Minified & gzipped     │   │
│  └──────────────────────────┘   │
│                                 │
│  ┌──────────────────────────┐   │
│  │ Backend API (Express)    │   │
│  │ - Environment vars       │   │
│  │ - Error handling         │   │
│  │ - Logging                │   │
│  └──────────────────────────┘   │
│                                 │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  MongoDB Atlas (Cloud DB)       │
│  - Automated backups            │
│  - Replica sets                 │
│  - Security rules               │
└─────────────────────────────────┘
```

---

## 🛡️ Security Measures

```
┌─────────────────────────────────────┐
│       Security Layers               │
├─────────────────────────────────────┤
│ 1. HTTPS/TLS (encrypted transport)  │
│ 2. CORS (cross-origin validation)   │
│ 3. JWT Authentication (token-based) │
│ 4. Password Hashing (bcrypt)        │
│ 5. Rate Limiting (prevent abuse)    │
│ 6. Input Validation (sanitize)      │
│ 7. SQL/Injection Prevention          │
│ 8. XSS Protection                   │
│ 9. CSRF Tokens                      │
│ 10. Audit Logging                   │
└─────────────────────────────────────┘
```

---

## 📝 Request/Response Examples

### Add Item Request/Response

```javascript
// REQUEST
POST /api/items
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Paracetamol",
  "category": "medications",
  "openingQty": 100,
  "minStock": 10,
  "itemCode": "PAR-001",
  "expiryDate": "2025-12-31"
}

// RESPONSE (201 Created)
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol",
    "category": "medications",
    "openingQty": 100,
    "currentQty": 100,
    "minStock": 10,
    "itemCode": "PAR-001",
    "expiryDate": "2025-12-31T00:00:00.000Z",
    "branchId": "507f1f77bcf86cd799439010",
    "createdAt": "2025-12-12T10:30:00.000Z",
    "updatedAt": "2025-12-12T10:30:00.000Z"
  }
}
```

### Get Items (Paginated) Request/Response

```javascript
// REQUEST
GET /api/items?page=1&limit=20&category=medications
Authorization: Bearer <JWT_TOKEN>

// RESPONSE
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol",
      "category": "medications",
      "currentQty": 95,
      "minStock": 10,
      "expiryDate": "2025-12-31T00:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 🔄 Error Handling

```javascript
// Centralized Error Handler
error
  │
  ├─► Authentication Error (401)
  ├─► Authorization Error (403)
  ├─► Validation Error (400)
  ├─► Not Found Error (404)
  ├─► Conflict Error (409)
  ├─► Server Error (500)
  └─► Log & Send Response

Response Format:
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": "Field 'name' is required"
  }
}
```

---

## 📊 System Monitoring

```
┌─────────────────────────────┐
│  Monitoring & Logging       │
├─────────────────────────────┤
│ ✓ Error Tracking (Sentry)   │
│ ✓ Performance Monitoring    │
│ ✓ Database Logs             │
│ ✓ API Request Logs          │
│ ✓ User Activity Audit       │
│ ✓ Uptime Monitoring         │
└─────────────────────────────┘
```

---

**This system design provides scalability, security, and maintainability for your Inventory Management System.**


## 🛠 Tech Stack

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Bootstrap 5** - CSS framework
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **CORS** - Cross-origin resource sharing
 DevTools
- **ESLint** - Code linting
- **Nodemon** - Development auto-reload
- **Git** - Version control



## Project Structure

```
Inventory/
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── AddItem.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── Backend/
│   ├── controllers/
│   │   ├── itemController.js
│   │   ├── userController.js
│   │   ├── notificationController.js
│   │   └── ...
│   ├── models/
│   │   ├── itemModel.js
│   │   ├── userModel.js
│   │   ├── notificationModel.js
│   │   └── ...
│   ├── routes/
│   │   ├── itemRoutes.js
│   │   ├── userRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── ...
│   ├── services/
│   │   ├── notificationService.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js
│   │   └── ...
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud - MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd Inventory
```

### Step 2: Backend Setup
```bash
cd Backend
npm install
```

### Step 3: Frontend Setup
```bash
cd ../Frontend
npm install
```



## Configuration

### Backend Configuration

1. **Create `.env` file in `/Backend`:**
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster0.mongodb.net/inventory

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your_jwt_secret_key

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Frontend URLs
FRONTEND_URL_PROD=https://inventory-sycr.onrender.com
FRONTEND_URL_DEV=http://localhost:5173
```

2. **Start Backend:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

### Frontend Configuration

1. **Create `.env` file in `/Frontend`:**
```env
# API URLs
VITE_API_URL_DEV=http://localhost:5000
VITE_API_URL_PROD=https://your-backend-url.com

# Socket URLs (optional)
VITE_SOCKET_URL_DEV=http://localhost:5000
VITE_SOCKET_URL_PROD=https://your-backend-url.com
```

2. **Start Frontend:**
```bash
npm run dev
```

---

## Running the Application

### Development Mode
```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Production Build
```bash
# Frontend
cd Frontend
npm run build
npm run preview

# Backend
cd Backend
NODE_ENV=production npm start
```

---

## API Documentation

### Authentication Endpoints
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout

### Item Endpoints
- `GET /api/items` - Get all items (paginated)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `GET /api/items/lowstock` - Get low stock items
- `GET /api/items/expired` - Get expired items
- `GET /api/items/general` - Get general items
- `GET /api/items/medications` - Get medications
- `GET /api/items/consumables` - Get consumables
- `GET /api/items/aparatus` - Get apparatus
- `GET /api/items/skincare` - Get skincare products
- `GET /api/items/medication-fridge` - Get fridge medications

### Notification Endpoints
- `GET /api/notifications` - Get all notifications
- `GET /api/notifications/:id` - Get single notification
- `PUT /api/notifications/:id` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

---

## Frontend Components

### Key Components
- **Sidebar** - Navigation menu with collapse/expand
- **Header** - Top navigation bar
- **Dashboard** - Overview with analytics and charts
- **Inventory** - List and manage items
- **AddItem** - Form to add new items
- **AdjustStock** - Modify stock levels
- **Reports** - Generate and view reports
- **Settings** - User preferences and account management

### Context
- **UserContext** - Global user authentication state


## Database Models

### Item Model
```javascript
{
  name: String,
  category: String,
  openingQty: Number,
  currentQty: Number,
  minStock: Number,
  itemCode: String (unique per branch),
  expiryDate: Date,
  branchId: ObjectId (ref: Branch),
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  branchId: ObjectId (ref: Branch),
  role: String (admin, user),
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  type: String (low-stock, expired),
  message: String,
  item: String,
  count: Number,
  isRead: Boolean,
  branchId: ObjectId (ref: Branch),
  createdAt: Date,
  updatedAt: Date
}


## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (development/production) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `EMAIL_USER` | Email address for notifications |
| `EMAIL_PASS` | Email app password |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL_DEV` | Backend API URL for development |
| `VITE_API_URL_PROD` | Backend API URL for production |
| `VITE_SOCKET_URL_DEV` | Socket server URL for development |
| `VITE_SOCKET_URL_PROD` | Socket server URL for production |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License see the LICENSE file for details.

## Future Enhancements

- Real-time notifications with WebSocket
- Mobile app version
- Advanced analytics and forecasting
- Multi-language support
- Two-factor authentication
- Barcode scanning
- Supplier management

**Last Updated:** December 2025"# Inventory-System" 
