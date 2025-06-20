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
| Metric                                      | Suggested Tools                                   |
|---------------------------------------------|---------------------------------------------------|
| Throughput                                  | JMeter                                            |
| Number of Successful vs Failed Iterations   | JMeter                                            |
| Error Rate                                  | JMeter                                            |
| CPU Usage                                   | Prometheus (Node Exporter)                        |
| Memory Usage                                | Prometheus (Node Exporter)                        |
| Network Throughput                          | Prometheus (Node Exporter)                        |
| Database Performance                        | Prometheus (MongoDB Exporter)                     |


## ⚙️ Environment Pre-conditions

- ✅ **Application Deployment**: The API is deployed in a stable environment (e.g., staging or performance testing) with production-like configuration.
- ✅ **Database Initialization**: The database contains realistic and sufficient test data to simulate expected usage.
- ✅ **Monitoring Tools Available**: Tools such as Prometheus + Grafana, Node Exporter, or equivalents are configured and accessible.
- ✅ **JMeter Configuration**: JMeter (or another load testing tool) is installed and ready with preloaded test plans on the test machine (e.g., AWS EC2).
- ✅ **External Dependencies**: Any third-party services or APIs are either mocked or accessible and stable during testing.
- ✅ **Network Stability**: The connection between the load generator and the API is stable with minimal latency.
- ✅ **Time Synchronization**: All involved systems have synchronized clocks (e.g., via NTP) to ensure accurate time correlation.
- ✅ **Authentication Tokens**: JWT tokens (if required) are generated or retrieved automatically before testing secured endpoints.

## Roles and Responsibilites
| Roles                                       | Responsibilities                                                                              |
|---------------------------------------------|-----------------------------------------------------------------------------------------------|
| Tatiane - Performance Test Engineer         | - Prepare the test plan                                                                       |
|                                             | - Prepare the test script and test data                                                       |
|                                             | - Execute the scripts at AWS environment                                                      |
|                                             | - Analyze the execution's result                                                              |
|                                             | - Prepare the test report, identifying the bottlenecks and give suggestions of improvment     |
|                                             | - Conduct a meeting to present the test report to stakeholders and discuss the next steps     |
|                                             |                                                                                               |
| DevOps / SRE team                           | - Deploy the application                                                                      |
|                                             | - Scalate the test environments to be similar to production                                   |
|                                             |                                                                                               |
| Database team                               | - Scalate the test database to be similar to production                                       |
|                                             | - Monitoring the database during test execution, and report any issue in real time            |
|                                             | - Inform Performance Test Team, if there is any cache on database and how long it is          |
|                                             |                                                                                               |
| Application team                            | - Monitoring the database during test execution, and report any issue in real time            |
|                                             |                                                                                               |
| QA - Functional test team                   | - Inform Performance Test team once functional test is done and all critical issues are solved|
|                                             | - Show to Performance Test the scenarios that should be consider to performance test          |
|                                             | - Provide an example of test data to be used to performance test team                         |
|                                             |                                                                                               |
| QA - Functional test team and Dev team      | - Validate the script implemented by Performance test team is according to Production issue   |
|                                             | that should be reproducted or is according to the new project requirements                    |
|                                             |                                                                                               |
| Stackholder or Product/Project Owner        | - Provide information about the system that should be tested                                  |
|                                             | - Inform the Performance Acceptance Criteria                                                  |

### Notes
 - Performance Test Execution must not happen until Performance Acceptance Criteria and Performance Test Plan is clear and done.
 - All roles/person mention in table above wil be invited to follow the Performance Test Execution.
 - All roles/person mention in table above wil be invited to the meeting of performance results and next steps.
 - All roles/person mention in table above wil be part of a Performance commit.

## Test Data

## Scenarios

## Volumetry

## Servers to be monitored during Performance Test execution
