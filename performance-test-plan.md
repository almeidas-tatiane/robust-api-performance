# 🧪 Performance Test Plan

## 🎯 Goal
The objective of this test is to assess the system's behavior under expected load conditions.
It will evaluate the API’s performance across key functionalities, including authentication (/login) and CRUD operations for /items.

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

![image](https://github.com/user-attachments/assets/987f8c75-56b3-4a85-8d04-00c594336a03)


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

## ✅ Acceptance Criteria
- The system must maintain an error rate below 1%.
- 90th percentile response time must be:
    - ≤ 200 ms for GET and DELETE requests
    - ≤ 500 ms for POST and PUT requests

- These thresholds apply under the following conditions:
    - 50 concurrent users
    - 10 requests per second

## 🛠️ Tools
- JMeter: (https://jmeter.apache.org/download_jmeter.cgi)
- Grafana: (https://grafana.com/docs/grafana/latest/setup-grafana/installation/)
- Prometheus: (https://prometheus.io/download/)


## Performance Metrics

## Environment Pre-Conditions

## Roles and Responsibilites

## Test Data

## Scenarios

## Volumetry

## Servers to be monitored during Performance Test execution
