# 🧪 Performance Test Plan

## 🎯 Goal
The objective of this test is to assess the system’s behavior under expected load conditions.
It focuses on evaluating the API’s performance across key functionalities, including authentication (/login) and CRUD operations on /items.

### 📦Test Endpoints
- ➕ POST /register - Create an user with username and password.
- 🔐 POST /login - Authenticate with username and password. Returns a JWT token.
- ➕ POST /items -  Creates a new item. Authentication: Requires JWT.
- 🔍 GET /items - Retrieves all items. Requires JWT.
- 🔍 GET /items/:id - Retrieves a specific item by ID. Requires JWT.
- ✏️ PUT /items/:id - Updates the item's name and/or description. Authentication: Requires JWT.
- 🗑️ DELETE /items/:id - Deletes an item by ID. Authentication: Requires JWT.


### 📦 Swagger
Open the Swagger YAML file in the Swagger Editor 

🔗 Swagger Editor (https://editor.swagger.io/)

[📥 Download swagger.yaml](https://github.com/almeidas-tatiane/robust-api-performance/raw/main/swagger.yaml)

### 🔧 Infrastructure Architecture 
High-level architecture of a RESTful API secured with JWT Authentication.

![image](https://github.com/user-attachments/assets/987f8c75-56b3-4a85-8d04-00c594336a03)


#### 🧪 Key Notes:
- The load generator (JMeter) will run on an EC2 instance hosted on AWS.
- The Node.js API communicates with MongoDB Atlas via Mongoose.
- JWT tokens are used to secure all /items endpoints.
- Monitoring is handled using Prometheus and Node Exporter, with Grafana dashboards for real-time visibility into key performance metrics such as CPU, memory, and request latency.

#### 🔧Technologies Used
- Node.js + Express  
- MongoDB Atlas (cloud-hosted database)  
- JSON Web Tokens (JWT)  
- bcryptjs (password hashing)  
- dotenv (environment config)  

## ✅ Acceptance Criteria
- The system must maintain an **error rate below 1%.**
- **90th percentile response time** must be:
    - **≤ 200 ms** for GET and DELETE requests
    - **≤ 500 ms** for POST and PUT requests

- These thresholds apply under the following conditions:
    - **50 concurrent users**
    - **10 requests per second**

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

### 📝 Notes
- This test plan will use JMeter as Performance test tool, but other tools can be consider as Gatling, K6.
- If the company has Dynatrace, Datadog or New Relic as APM tool other performance metrics can be consider for the test:
  -- Service / Analyze backtrace
  -- Service / View service flow
  -- Service / Pure Paths
  -- Service / Current hotspots

## ⚙️ Environment Pre-conditions

- ✅ **Application Deployment**: The API is deployed in a stable environment (e.g., staging or performance testing) with production-like configuration.
- ✅ **Database Initialization**: The database contains realistic and sufficient test data to simulate expected usage.
- ✅ **Monitoring Tools Available**: Tools such as Prometheus + Grafana, Node Exporter, or equivalents are configured and accessible.
- ✅ **JMeter Configuration**: JMeter (or another load testing tool) is installed and ready with preloaded test plans on the test machine (e.g., AWS EC2).
- ✅ **External Dependencies**: Any third-party services or APIs are either mocked or accessible and stable during testing.
- ✅ **Network Stability**: The connection between the load generator and the API is stable with minimal latency.
- ✅ **Time Synchronization**: All involved systems have synchronized clocks (e.g., via NTP) to ensure accurate time correlation.
- ✅ **Authentication Tokens**: JWT tokens (if required) are generated or retrieved automatically before testing secured endpoints.

## 👥 Roles and Responsibilites
| Roles                                       | Responsibilities                                                                              |
|---------------------------------------------|-----------------------------------------------------------------------------------------------|
| **Tatiane - Performance Test Engineer**     | - Prepare the test plan and scripts                                                           |
|                                             | - Setup test data                                                                             |
|                                             | - Execute the scripts at AWS environment                                                      |
|                                             | - Analyze execution results                                                                   |
|                                             | - Prepare the test report, identify bottlenecks, and suggest improvements                     |
|                                             | - Present the test results to stakeholders and discuss next steps                             |
|                                             |                                                                                               |
| **DevOps / SRE team**                       | - Deploy the application                                                                      |
|                                             | - Scale the test environment to closely match production                                      |
|                                             |                                                                                               |
| **Database team**                           | - Scale the test database to match production                                                 |
|                                             | - Monitor the database during test execution                                                  |
|                                             | - Inform the Performance Team of any caching mechanisms and their expiration duration         |
|                                             |                                                                                               |
| **Application team**                        | - Monitor application behavior during test execution                                          |
|                                             | - Report any anomalies in real-time                                                           |
|                                             |                                                                                               |
| **QA - Functional test team**               | - Notify the Performance Team when functional testing is complete and critical bugs           |
|                                             | are resolved                                                                                  |
|                                             | - Share relevant scenarios to be considered for performance testing                           |
|                                             | - Provide example test data for use by the Performance Team                                   |
|                                             |                                                                                               |
| **QA - Functional test team and Dev team**  | - Validate that performance scripts reflect production issues or new feature requirements     |
|                                             |                                                                                               |
| **Stackholder or Product/Project Owner**    | - Provide context on the system being tested                                                  |
|                                             | - Define and communicate performance acceptance criteria                                      |

### 📝 Notes
- Performance testing must not begin until the acceptance criteria and test plan are clearly defined and approved.
- All stakeholders listed above will be invited to observe the performance test execution.
- All stakeholders listed above will be invited to the performance results meeting to discuss findings and next steps.
- All stakeholders will be part of a dedicated performance test communication channel (Performance Commit).

## Test Data

## Scenarios

## Volumetry

## Servers to be monitored during Performance Test execution
