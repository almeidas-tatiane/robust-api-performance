# 📊 Grafana Dashboards

This document is a step by step guide how to create dashboards on Grafana to Node Exporter and JMeter.

---
## Pre-requisites

- EC2 with Ubuntu running
- Grafana and InfluxDB already installed and running

---
## Configuring Data Sources

- Login on Grafana
- Click on Connections -> Add New Connection
- Select InfluxDB
- Click on Add New Data Source
- Name type JMeter
- Query Language select Flux
- In HTTP session -> URL, type: http://EC2'IP:8086
- On Auth, let all options **disabled**
- On InfluxDB details, fill in, [See how to configure here](https://github.com/almeidas-tatiane/robust-api-performance/edit/main/docs/configure-influx-injection-machine)
  - **Organization**
  - **Token**
  - **Default Bucket**
- Click on Save & Test
<img width="1467" height="143" alt="image" src="https://github.com/user-attachments/assets/8fb4f127-4c7b-4a27-9957-d9583a2d87d2" />

- Click again on **Data sources** on **let pannel under Connections**
- The **JMeter** data source is displayed
<img width="1503" height="162" alt="image" src="https://github.com/user-attachments/assets/4fb5ada0-51ab-4188-946b-2f3a0026cffe" />

