# 🧪 Performance Test Plan

## Goal
The objective of this test is to verify the system's behavior under an expected load.
The test will verify the API's performance; that covers: login and CRUD.

### 📦Test Endpoints
- ➕ POST /register - Create an user with username and password.
- 🔐 POST /login - Authenticate with username and password. Returns a JWT token.
- ➕ POST /items -  Creates a new item. Authentication: Requires JWT.
- 🔍 GET /items - Retrieves all items. Requires JWT.
- 🔍 GET /items/:id - Retrieves a specific item by ID. Requires JWT.
- ✏️ PUT /items/:id - Updates the item's name and/or description. Authentication: Requires JWT.
- 🗑️ DELETE /items/:id - Deletes an item by ID. Authentication: Requires JWT.


### 📦 Swagger
Open the file in the Swagger Editor (https://editor.swagger.io/)

[📥 Download swagger.yaml](https://github.com/almeidas-tatiane/robust-api-performance/raw/main/swagger.yaml)

### 🔧 Infrastructure Architecture 
RESTful API with JWT Authentication

+----------------------+           +----------------------+
|     End User         |  --->     |   Load Generator     |
| (JMeter or BlazeMeter)           |  (JMeter CLI/GUI)    |
+----------------------+           +----------------------+
                                           |
                                           | HTTP(S) Requests
                                           v
+--------------------------------------------------------------+
|                  Node.js Application (Express)              |
|  - JWT Authentication                                        |
|  - Full CRUD for items (/items)                              |
|  - Login and Registration endpoints (/login, /register)      |
|  - Batch operations (/batch)                                 |
+--------------------------------------------------------------+
                                           |
                                           | Mongoose (ODM)
                                           v
+-----------------------------+       +-----------------------------+
|        MongoDB Atlas        | <-->  |  Cloud MongoDB Database     |
|   (Managed cloud database)  |       | Stores users and item data  |
+-----------------------------+       +-----------------------------+

                +--------------------+
                |     Monitoring     |
                |  Prometheus +      |
                |  Node Exporter +   |
                |  Grafana Dashboard |
                +--------------------+

#### 🧪 Key Notes:
- The Load Generator (JMeter) will run in an EC2 at AWS.
- The Node.js API interacts directly with MongoDB Atlas using Mongoose.
- The application is secured with JWT tokens, required to access /items.
- Server-level monitoring is handled by Prometheus and Node Exporter, with Grafana dashboards for real-time performance metrics like CPU usage, memory, and request latency.

#### 🔧Technologies Used

- Node.js + Express  
- MongoDB Atlas (cloud-hosted database)  
- JSON Web Tokens (JWT)  
- bcryptjs (password hashing)  
- dotenv (environment config)  

## Acceptance Criteria
The system must maintain an error rate below 1%, and ensure all API requests are processed in 90 percentil within 200ms for GET/DELETE and 500ms for POST/PUT operations under a load of 50 concurrent users and 10 requests per second.

## 🛠️ Tools

## Performance Metrics

## Environment Pre-Conditions

## Roles and Responsibilites

## Test Data

## Scenarios

## Volumetry

## Servers to be monitored during Performance Test execution
