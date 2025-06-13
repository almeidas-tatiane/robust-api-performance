# 🧪 Robust RESTful API with JWT Authentication

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)  
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas)  
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)  
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

#### `POST /login`  
Authenticate with username and password.  
Returns a JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "password"
}
### 🔍 `GET /items/:id`

**Description:** Retrieves a specific item by ID.  
**Authentication:** Requires JWT.

**Response:**
```json
{
  "_id": "item_id",
  "name": "Item Name",
  "description": "Item description"
}
