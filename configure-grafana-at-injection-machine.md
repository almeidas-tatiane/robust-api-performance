# 🧭 Configure Grafana on injection machine

This document is a step by step guide how to configure Grafana on injection machine at EC2

## Pre-requisites

- An **Ubuntu EC2** instance running (e.g., **t3.micro or larger**)

![image](https://github.com/user-attachments/assets/989acfce-2ece-482a-9773-94a46d26cd61)

- Security Group with **ports 22 (SSH), 3000 (Grafana Web UI)** open
- To see how to configure security groups,[check here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/configure-injection-machine-with-influxdb.md#pre-requisites)

![image](https://github.com/user-attachments/assets/bd4ead6c-803c-48bf-97c3-b3a2a047096d)


- SSH access to your instance using **.pem** file. You can access using MobaXterm terminal
---
## Installing Grafana on Ubuntu EC2


