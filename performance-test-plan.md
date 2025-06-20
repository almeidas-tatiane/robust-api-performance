# 📈 Performance Test Plan

## 📝 About the Project

This performance test plan is designed for a RESTful API application built with Node.js, Express, and MongoDB Atlas. The API is secured using JWT authentication and supports user registration, login, and full CRUD operations on items. This project demonstrates a practical approach to performance testing using tools like JMeter, Prometheus, and Grafana.

This test plan was created as part of a personal portfolio project to demonstrate performance engineering best practices and readiness to return to the professional market.

## 🎯 Goal
The objective of this test is to assess the system’s behavior under expected load conditions.
It focuses on evaluating the API’s performance across key functionalities, including authentication (/login) and CRUD operations on /items.

### 🕹️Test Endpoints
- ➕ **POST /register** – Creates a user with `username` and `password`.
- 🔐 **POST /login** – Authenticates the user and returns a JWT token.
- ➕ **POST /items** – Creates a new item. Requires JWT authentication.
- 🔍 **GET /items** – Retrieves all items. Requires JWT authentication.
- 🔍 **GET /items/:id** – Retrieves a specific item by ID. Requires JWT authentication.
- ✏️ **PUT /items/:id** – Updates an item's name and/or description. Requires JWT authentication.
- 🗑️ **DELETE /items/:id** – Deletes an item by ID. Requires JWT authentication.


### 📦 Swagger
Open the Swagger YAML file in the Swagger Editor 

🔗 [Swagger Editor] (https://editor.swagger.io/)

[📥 Download swagger.yaml](https://github.com/almeidas-tatiane/robust-api-performance/raw/main/swagger.yaml)

### 🔧 Infrastructure Architecture 
High-level architecture of a RESTful API secured with JWT authentication.

![image](https://github.com/user-attachments/assets/987f8c75-56b3-4a85-8d04-00c594336a03)


#### 🧪 Key Notes:
- The load generator (JMeter) will run on an AWS-hosted EC2 instance.
- The Node.js API communicates with MongoDB Atlas via Mongoose.
- JWT tokens are required to access all `/items` endpoints.
- Monitoring is handled using Prometheus and Node Exporter, with Grafana dashboards providing real-time visibility into key performance metrics such as CPU, memory, and request latency.

#### 🔧Technologies Used
- Node.js + Express  
- MongoDB Atlas (cloud-hosted database)  
- JSON Web Tokens (JWT)  
- bcryptjs (password hashing)  
- dotenv (environment config)  

## ✅ Acceptance Criteria
- The system must maintain an **error rate below 1%**.
- **90th percentile response time** must be:
  - **≤ 200 ms** for GET and DELETE requests
  - **≤ 500 ms** for POST and PUT requests

- These thresholds apply under the following load:
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
- This test plan uses JMeter as the performance testing tool, but alternatives such as Gatling or K6 may also be considered.
- If the company uses APM tools such as Dynatrace, Datadog, or New Relic, additional performance insights may include:
  - Service Backtrace Analysis
  - Service Flow Visualization
  - PurePath Tracing (Dynatrace-specific)
  - Current Hotspots

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
|                                             | - Prepare the test plan and scripts                                                           |
|                                             | - Set up test data                                                                             |
| **Tatiane - Performance Test Engineer**     | - Execute the scripts at AWS environment                                                      |
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
|                                             | - Provide application's architecture diagram to performance test team                         |
|                                             |                                                                                               |
| **QA - Functional test team**               | - Notify the Performance Team when functional testing is complete and critical bugs           |
|                                             | are resolved                                                                                  |
|                                             | - Share relevant scenarios to be considered for performance testing                           |
|                                             | - Provide example test data for use by the Performance Team                                   |
|                                             |                                                                                               |
| **QA - Functional test team and Dev team**  | - Validate that performance scripts reflect production issues or new feature requirements     |
|                                             |                                                                                               |
| **Stakeholder or Product/Project Owner**    | - Provide context on the system being tested                                                  |
|                                             | - Define and communicate performance acceptance criteria                                      |

### 📝 Notes
- Performance testing must not begin until the acceptance criteria and test plan are clearly defined and approved.
- All stakeholders listed above will be invited to observe the test execution.
- All stakeholders will be invited to the results meeting to discuss findings and next steps.
- All stakeholders will be included in the dedicated communication channel (Performance Committee).

## 📁 Test Data
The Performance Test Team will use external CSV files containing:

- **Login Users:** 50 usernames and passwords
- **Items List:** 100 items to be added, retrieved, updated, and deleted

## 🧠 Test Strategy
The following test types will be executed:
| Test Type             | % of volumetry | Time   | Ramp Up        | Steady State                         | Ramp Down                              |
|-----------------------|----------------|--------|----------------|--------------------------------------|----------------------------------------|
| **Baseline**          | 10%            | 1 hour | 10 min         | 48 min                               | 2 min                                  |
| **Load**              | 100%           | 1 hour | 10 min         | 48 min                               | 2 min                                  |

### 📝 Notes
The volumetric values for each scenario during Load and Baseline tests are defined in the 'Test Scenarios with Volumetry' section

## 🔄 Test Scenarios with Volumetry
The following scenarios will be tested:
| Scenario              | Endpoint     | Method | Auth Required  | Description                          | Volumetry (Example)                    |
|-----------------------|--------------|--------|----------------|--------------------------------------|----------------------------------------|
| Register a user       | `/register`  | POST   | No             | Creates a user with username/password| 50 new users per test cycle            |
| Login                 | `/login`     | POST   | No             | Authenticates user and returns token | 500 logins per hour                    |
| Create an item        | `/items`     | POST   | Yes            | Adds a new item                      | 300 items created per hour             |
| Retrieve all items    | `/items`     | GET    | Yes            | Fetches all items                    | 1000 requests per hour                 |
| Retrieve item by ID   | `/items/:id` | GET    | Yes            | Fetches a specific item              | 1500 requests per hour                 |
| Update item by ID     | `/items/:id` | PUT    | Yes            | Updates item name/description        | 200 updates per hour                   |
| Delete item by ID     | `/items/:id` | DELETE | Yes            | Removes an item                      | 100 deletions per hour                 |

### 📝 Notes
- If the Stakeholder or Product Owner cannot provide volumetry information, and the application is already live in production, performance testers can gather realistic volumetric data using APM tools such as **Datadog, New Relic, or Dynatrace**.
- It's recommended to analyze metrics over a representative period — ideally the **last 1 to 3 months** — to identify average usage patterns, traffic peaks, and outliers. This ensures the test scenarios reflect actual system usage and help prevent under/over-estimating the load.

## 🖥️ Servers to Be Monitored During Performance Test Execution

| Server/Component            | Type                 | Monitoring Tool           | Notes                                |
|----------------------------|-----------------------|---------------------------|--------------------------------------|
| Application Server         | AWS EC2 / S3 Hosting  | Node Exporter + Prometheus| Monitor CPU, memory, latency         |
| Database (MongoDB Atlas)   | Cloud DB              | MongoDB Atlas / Exporter  | Monitor query performance, I/O, cache|
| JMeter Load Generator      | AWS EC2               | Node Exporter + Prometheus| Monitor CPU/network during test      |
| Monitoring Stack           | Prometheus + Grafana  | -                         | Dashboards for live monitoring       |

### 🔗 Live Dashboard Access
- [Grafana - JMeter Execution Dashboard](http://your-monitoring-stack/grafana/d/jmeter-live-dashboard) *(this link will be replaced once I have created actual URL)*

### 📝 Notes
- If the application is deployed in an AWS Object Storage service (e.g., S3 static hosting), only front-end metrics can be collected — backend monitoring must be done at the API level.
- Always validate that Node Exporter and MongoDB exporters are installed, configured, and reachable before execution begins.

