# 🧪 Robust RESTful API with JWT Authentication

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/) [![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas) [![Postman](https://img.shields.io/badge/Postman-Collection-orange?logo=postman)](./robust-api-postman-collection.json)


A robust and extensible RESTful API built with Node.js, Express, and MongoDB Atlas.  Supports full CRUD operations with JWT-based authentication.

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Why this Project?](#-why-this-project)
- [Technologies Used](#-technologies-used)
- [API Overview](#-api-overview)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#️-environment-variables)
- [Postman Collection](#-postman-collection)
- [Swagger](#-swagger)
- [How to Run Locally](#️-how-to-run-this-project-locally)
- [Performance Test Plan](#-performance-test-plan)


---
## 🧪 Designed for Performance Testing
This API was created specifically to practice performance testing with tools like Apache JMeter,K6 and Gatling.

Features include:
- Dynamic data handling
- Realistic user scenarios
- JWT-based authentication
- Complete CRUD functionality

---

## 🚀 Why this project?

This project was developed as a hands-on exercise to **practice and validate performance testing techniques** using tools like JMeter. It simulates real-world operations like authentication, CRUD operations — providing a rich environment for designing, executing, and analyzing load and stress test scenarios.

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

### ➕ POST /register
Create a user with username and password.
```json
{
  "username": "admin",
  "password": "password"
}
```

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
#### 🔍 GET /items

**Description:** Retrieves all items.  
**Authentication:** Requires JWT.

**Response:**
```json
{
  "_id": "item_id",
  "name": "Item Name",
  "description": "Item description"
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


## 🛠️ Environment Variables
Create a .env file in the root of the project with the following content:

```ini
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/robust-api?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```
---
## 📥 Postman Collection
Use the collection below to quickly test the API endpoints with JWT authentication and pre-configured examples:

📦 [📥 Download robust-api-postman-collection.json](https://github.com/almeidas-tatiane/robust-api-performance/raw/main/robust-api-postman-collection.json)

---
## 📥 Swagger
Open the file in the Swagger Editor (https://editor.swagger.io/)

📦 [📥 Download swagger.yaml](https://github.com/almeidas-tatiane/robust-api-performance/raw/main/swagger.yaml)

## 🛠️ How to run this project locally?
Inside the project's folder, run in command line
```cmd
node server.js
```
---
## 🧪 Performance Test Plan
This test plan was created as part of a personal portfolio project to demonstrate performance engineering best practices and readiness to return to the professional market.

🔗 [📊 View Full Performance Test Plan (GitHub)](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/performance-test-plan.md)




