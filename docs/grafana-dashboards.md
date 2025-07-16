# Grafana Dashboards

This document is a step by step guide how to create dashboards on Grafana to Node Exporter and JMeter.

---
## Pre-requisites

- EC2 with Ubuntu running
- Grafana and InfluxDB already installed and running
- Already protected the Grafana and InfluxDB's port with NGINX. [Check the steps here](https://github.com/almeidas-tatiane/robust-api-performance/edit/main/docs/setup-nginx.md)

---
## Configuring Grafana

- Login on Grafana
- Click on Connections -> Add New Connection
- Select InfluxDB
- Click on Add New Data Source
- Name type Performance Testing
- Query Language select Flux
- In HTTP session -> URL, type: http://EC2'IP/influxdb
- On Auth, select Basic auth
- On Basic Auth Details, fill in the user and password, the same to NGINX Basic Auth
- On InfluxDB details, fill in
  - Database
  - User
  - Password

