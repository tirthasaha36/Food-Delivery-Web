# 🍔 Food Delivery Website

## 📌 Overview
This is the backend for a **Food Delivery Website/App** built using **Node.js, Express, MongoDB**, and **JWT authentication**. It includes features for **user authentication, restaurant and menu management, cart functionality, and order placement**.

---
## 🚀 Features
### ✅ **User Authentication**
- User **Signup & Login** with JWT-based authentication
- Role-based access (**Admin & Customer**)

### ✅ **Restaurant Management**
- Add, Update, Delete Restaurants (Admin only)
- View restaurants and their menu (Public)

### ✅ **Menu Management**
- Create, Update, Delete Food Items under restaurants
- Retrieve menu details

### ✅ **Cart System**
- Add items to cart
- Update or remove items from the cart
- Clear cart after order placement

### ✅ **Order Placement (Next Step)**
- Checkout and place orders
- Order history for users

### ✅ **Payment Integration (Upcoming)**
- Secure online payments for orders

---
## 🛠️ **Tech Stack**
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Token)
- **Middleware:** CORS, bcrypt for password hashing
- **API Testing:** Postman

---
## 📂 **Project Structure**
```
📦 food-delivery-backend
 ┣ 📂 models           # Database Schemas
 ┣ 📂 routes           # API Routes
 ┣ 📂 middleware       # Authentication Middleware
 ┣ 📜 server.js        # Main Server File
 ┣ 📜 .env             # Environment Variables
 ┗ 📜 README.md        # Project Documentation
```

---
## 📦 **Installation & Setup**
### 🔹 **1. Clone the Repository**
```bash
git clone https://github.com/your-username/food-delivery-api.git
cd food-delivery-api
```

### 🔹 **2. Install Dependencies**
```bash
npm install
```

### 🔹 **3. Configure Environment Variables**
Create a `.env` file in the root folder and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 🔹 **4. Start the Server**
```bash
npm start
```

---
## 📬 **API Endpoints**
### 🔹 **User Authentication**
- `POST /api/users/signup` → Register a new user
- `POST /api/users/login` → Login user & get token

### 🔹 **Restaurant Management**
- `GET /api/restaurants` → Get all restaurants
- `POST /api/restaurants` → Add a new restaurant (Admin)

### 🔹 **Cart Operations**
- `POST /api/cart/add` → Add item to cart
- `PUT /api/cart/update` → Update cart quantity
- `DELETE /api/cart/remove/:itemId` → Remove item from cart
- `DELETE /api/cart/clear` → Clear entire cart

---
## 🔥 **Next Steps**
- Implement **Order Placement**
- Add **Payment Gateway Integration**
- Develop the **Frontend (Mobile App / Website)**

---
## 👨‍💻 **Contributors**
- **Tirtha Saha** ([@tirthasaha36](https://github.com/tirthasaha36))

🚀 **Happy Coding!**

