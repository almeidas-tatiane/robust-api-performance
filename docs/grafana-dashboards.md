# 📊 Grafana Dashboards

This document is a step by step guide how to create dashboards on Grafana to **JMeter** and **Node Exporter**.

---
## Pre-requisites

- EC2 with Ubuntu running
- Grafana and InfluxDB already installed and running
- If InfluxDB was installed by Docker, run on MobaXterm terminal: **docker start influxdb**


---
## Configuring Data Sources

### InfluxDB

- Login on Grafana
- Click on Connections -> Add New Connection
- Select **InfluxDB**
- Click on Add New Data Source
- Name type JMeter
- Query Language select Flux
- In HTTP session -> URL, type: http://EC2'IP:8086
- On Auth, let all options **disabled**
- On InfluxDB details, fill in, [See how to configure here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/docs/configure-influx-injection-machine.md)
  - **Organization**
  - **Token**
  - **Default Bucket**
- Click on Save & Test
<img width="1467" height="143" alt="image" src="https://github.com/user-attachments/assets/8fb4f127-4c7b-4a27-9957-d9583a2d87d2" />

- Click again on **Data sources** on **let pannel under Connections**
- The **JMeter** data source is displayed
<img width="1503" height="162" alt="image" src="https://github.com/user-attachments/assets/4fb5ada0-51ab-4188-946b-2f3a0026cffe" />

### Prometheus

- Login on Grafana
- Click on Connections -> Add New Connection
- Select **Prometheus**
- On **Connection** type the **Prometheus server URL** http://ec2-ip:9090
- Click on **Save & Test**

---
## Creating a Dashboard

### JMeter

- Click on Connections -> Data sources
- In the **JMeter** Data Sources, click on **Build a dashboard**
- Let's create **importing a dashboard**, click on **Import a dashboard**
- In a new **browser tab** access [JMeter Performance Testing](https://grafana.com/grafana/dashboards/17506-jmeter-performance-testing-dashboard/)
- Click on **Copy ID to clipboard**
- **Back to browser tab when Grafana New Dashboard is opened**
- Click on **Import a dashboard**
- **Save the Dashboard**
- Click on **Import a dashboard** again
- Paste the **Dashboard's ID** and click on Load
<img width="787" height="71" alt="image" src="https://github.com/user-attachments/assets/e49d8a6b-afbd-4e95-ae9a-3a22dad83ff6" />

- On **Options session -> InfluxDB** select **JMeter**

<img width="956" height="770" alt="image" src="https://github.com/user-attachments/assets/1d168912-4a66-4b3f-9eef-94edac2c8b38" />

- Click on **Import**

<img width="1907" height="851" alt="image" src="https://github.com/user-attachments/assets/c825423c-7419-4295-8f67-593b47502105" />

### Node Exporter

- Click on Connections -> Data sources
- On **prometheus** Data soruces, click on **Build a dashboard**
- Click on **Import a dashboard** and paste the **ID** from the template [Node Exporter](https://grafana.com/grafana/dashboards/1860-node-exporter-full/)
- **Back to browser tab when Grafana New Dashboard is opened**
- Click on **Import a dashboard**
- **Save the Dashboard**
- Click on **Import a dashboard** again
- Paste the **Dashboard's ID** and click on Load
<img width="808" height="86" alt="image" src="https://github.com/user-attachments/assets/f999a525-6e3d-4fc3-8b02-1b93fd394f23" />

- On **Options session -> prometheus** select **prometheus**
<img width="922" height="778" alt="image" src="https://github.com/user-attachments/assets/469da8b6-93cf-41df-aafb-ddcfc14fd0d2" />

- Click on Import
<img width="1895" height="847" alt="image" src="https://github.com/user-attachments/assets/1ec71f58-dd16-4d3c-9bdf-c13a1658a4a7" />

---
## Verifying Dashboards Created

- Click on **Dashboards** on left pannel
- **Both** dashboards imported are displayed
<img width="1915" height="469" alt="image" src="https://github.com/user-attachments/assets/dfdb6d8e-da35-4e9e-bde5-17f8f8d9f0c7" />

---
## Testing Dashboards

### JMeter with InfluxDB


- To test the Dashboard, first of all we need a JMeter script with **Backend Listener**
- In **Backend Listener** fill in the fields:
  - **Backend Listener implementation**: select **influxdb2**
  - **influxDBHost**: EC2's IP
  - **influxDBPort**: 8086
  - **influxDBToken**: the same token used in InfluxDB setup
  - **influxDBOrganization**: the same used in InfluxDB setup
  - **influxDBBucket**: the same used in InfluxDB setup
 
- Save the file
- Upload it to **injection machine** at EC2
<img width="535" height="42" alt="image" src="https://github.com/user-attachments/assets/0a1d44f8-d506-4206-b116-579d6a00aeb0" />

- Now we need to update our jmeter in the injection machine with **influxdb2** plugin
- In the MobaXterm terminal, go to **/apps/apache-jmeter-5.6.3/lib/ext**
- Download the plugin with the command: **wget https://repo1.maven.org/maven2/io/github/mderevyankoaqa/jmeter-plugins-influxdb2-listener/2.8/jmeter-plugins-influxdb2-listener-2.8.jar**
<img width="1587" height="187" alt="image" src="https://github.com/user-attachments/assets/ae30faba-5ffd-4f02-b862-fe9a90fea9f9" />

- Verify if plugin is diapleyd with the command: ls -lh jmeter-plugins-influxdb2-listener-2.8.jar
<img width="890" height="27" alt="image" src="https://github.com/user-attachments/assets/004314f2-647d-41f7-9fff-7bdf2e56d18c" />

- Back to the directory when you've uploaded the jmeter script
- **Execute** the script with this command in the MobaXterm terminal: jmeter -n -t grafana-test.jmx -l results.txt -e -o results




    


