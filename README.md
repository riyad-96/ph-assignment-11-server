# TicketBari Server 🖥️

This is the backend server for **TicketBari**, responsible for managing the application's business logic, secure data storage, and role-based permissions.

**Live API Link:** [https://ticketbari-server.vercel.app](https://ticketbari-server.vercel.app)

### 📋 Project Purpose

The backend serves as the engine for TicketBari, ensuring that the three-tier user system (User, Vendor, Admin) operates securely. It handles complex data relationships, such as ticket availability, booking approvals, and payment processing.

### 🛡️ Backend Logic & Features

- **Role-Based Access Control (RBAC):** Implementation of custom middleware to verify user roles and protect sensitive operations (e.g., ensuring only Admins can manage users).
- **Booking Management:** Logic to handle the lifecycle of a ticket booking from "Pending" to "Accepted" or "Rejected."
- **Security & Verification:** Uses `firebase-admin` to validate client-side authentication tokens on the server.
- **Payment Integration:** Secure server-side implementation of **Stripe** to process ticket purchases.
- **Admin Moderation:** Powerful tools for Admins to manage the vendor ecosystem, including ticket approvals and fraud detection.

### 🗄️ Database Architecture

The system uses **MongoDB** to manage the following collections:

- **Users:** Stores roles and account status (active/fraud).
- **Tickets:** Contains price, destination, and vendor details.
- **Bookings:** Links users to tickets with status tracking.

### 🛠️ Tech Stack & Dependencies

#### Core Framework

- **Express.js (v5):** Robust routing and server framework.
- **MongoDB:** NoSQL database for flexible and scalable data management.

#### Security & Authentication

- **firebase-admin:** For secure server-side verification of user identity.
- **cors:** Enabling secure communication between the frontend and backend.
- **dotenv:** Protection of sensitive environment variables.

#### Payments & Utilities

- **stripe:** Handles financial transactions and payment intents.
- **date-fns:** Efficient management of booking dates and timestamps.

### 📦 Dependencies List

```json
{
  "express": "^5.1.0",
  "mongodb": "^7.0.0",
  "firebase-admin": "^13.6.0",
  "stripe": "^20.0.0",
  "cors": "^2.8.5",
  "date-fns": "^4.1.0",
  "dotenv": "^17.2.3"
}
```
