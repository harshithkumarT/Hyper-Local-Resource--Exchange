# 📍 LocalShare - Hyper-Local Resource Exchange

LocalShare is a full-stack peer-to-peer sharing platform that allows neighbors to lend and borrow items (like tools, electronics, and kitchen appliances) to reduce waste and build community resilience.

## 🚀 Features

- **Geospatial Discovery**: Interactive map using Leaflet.js and MongoDB 2dsphere indexing to find items within a specific radius.
- **Secure Authentication**: JWT-based auth with password hashing using bcryptjs.
- **Borrowing Workflow**: 
  - Request to borrow with specific date ranges.
  - Overlap prevention to ensure items aren't double-booked.
  - Owner dashboard to approve or reject requests.
- **Real-time Communication**: Integrated chat system using Socket.io for seamless coordination between owners and borrowers.
- **Modern UI**: Responsive design built with React, Tailwind CSS, and Lucide icons.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React-Router, Leaflet.js, Socket.io-client.
- **Backend**: Node.js, Express, Socket.io.
- **Database**: MongoDB (Atlas) with Geospatial indexing.
- **Authentication**: JSON Web Tokens (JWT), bcryptjs.

## 📦 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshithkumarT/Hyper-Local-Resource--Exchange.git
   cd localshare
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_random_secret_string
     NODE_ENV=development
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🗺️ Project Architecture

- `backend/models`: MongoDB schemas (User, Item, Booking, Conversation, Message).
- `backend/controllers`: Business logic for auth, items, bookings, and chat.
- `backend/routes`: REST API endpoints.
- `frontend/src/context`: Global state management for Auth and Toast notifications.
- `frontend/src/pages`: View components for Home, Login, Register, ItemDetails, AddItem, and Dashboards.
- `frontend/src/components`: Reusable UI elements like Navbar and ProtectedRoute.

## 📝 License
MIT
