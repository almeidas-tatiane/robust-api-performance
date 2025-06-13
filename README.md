# 🧪 Robust RESTful API with JWT Authentication

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas)  
[![Postman](https://img.shields.io/badge/Postman-Collection-orange?logo=postman)](./robust-api-postman-collection.json)

A robust and extensible RESTful API built with Node.js, Express, and MongoDB Atlas.  
Supports full CRUD operations with JWT-based authentication and batch endpoint processing.

---

## 🚀 Why this project?

This project was developed as a hands-on exercise to **practice and validate performance testing techniques** using tools like JMeter. It simulates real-world operations like authentication, CRUD operations, and batch processing — providing a rich environment for designing, executing, and analyzing load and stress test scenarios.

---

## 🔧 Technologies Used

- Node.js + Express  
- MongoDB Atlas (cloud-hosted database)  
- JSON Web Tokens (JWT)  
- bcryptjs (password hashing)  
- dotenv (environment config)  
- Postman for testing  

---

## 📚 API Overview

All protected routes require a JWT sent in the `Authorization` header as `Bearer <token>`.

---

## 📦 API Endpoints

### 🔐 Auth
#### POST /login 
Authenticate with username and password.  
Returns a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
```
#### 🔍 GET /items/:id

**Description:** Retrieves a specific item by ID.  
**Authentication:** Requires JWT.

**Response:**
```json
{
  "_id": "item_id",
  "name": "Item Name",
  "description": "Item description"
}

```
#### ➕ POST /items
Description: Creates a new item.
Authentication: Requires JWT.

**Request Body:**
```json
{
  "name": "New Item",
  "description": "Optional description"
}
```
**Response:**
```json
{
  "_id": "generated_id",
  "name": "New Item",
  "description": "Optional description"
}
```
#### ✏️ PUT /items/:id
Description: Updates the item's name and/or description.
Authentication: Requires JWT.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```
#### 🗑️ DELETE /items/:id
Description: Deletes an item by ID.
Authentication: Requires JWT.

**Response:**
204 No Content on success.

### 🔁 Batch Endpoint
#### POST /batch
Description: Allows multiple operations (GET, POST) in a single request.
Authentication: Requires JWT.

**Request Body:**
```json
{
  "operations": [
    { "method": "GET", "path": "/items" },
    {
      "method": "POST",
      "path": "/items",
      "body": {
        "name": "Batch Item",
        "description": "Created via batch"
      }
    }
  ]
}
```
**Response:**
```json
[
  {
    "status": 200,
    "body": [ /* array of items */ ]
  },
  {
    "status": 201,
    "body": {
      "_id": "generated_id",
      "name": "Batch Item",
      "description": "Created via batch"
    }
  }
]
```
### 🛠️ Environment Variables
Create a .env file in the root of the project with the following content:

```ini
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/robust-api?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

### 📥 Postman Collection
Use the collection below to quickly test the API endpoints with JWT authentication and pre-configured examples:

📦 **Download:**  robust-api.postman_collection.json

### 🧪 Designed for Performance Testing
This API was created specifically to practice performance testing with tools like Apache JMeter.

Features include:
- Dynamic data handling
- Realistic user scenarios
- JWT-based authentication
- Batch processing of multiple operations
- Complete CRUD functionality

These capabilities make it perfect for creating realistic load, stress, and spike testing scenarios.


