# 📊 Grafana Dashboards


This document is a step by step guide how to create dashboards on Grafana to **JMeter** 

---
## Pre-requisites

- EC2 with Ubuntu running
- Grafana and InfluxDB already installed and running
- If InfluxDB was installed by Docker, run on MobaXterm terminal: **docker start influxdb**

## 📚 Table of Contents

- [Configuring Data Sources](#configuring-data-sources)
- [Creating a Dashboard](#creating-a-dashboard)
- [Verifying Dashboards Created](#verifying-dashboards-created)
- [Testing Dashboards](#testing-dashboards)

---
## Configuring Data Sources

### InfluxDB

- Login on Grafana
- Click on Connections -> Add New Connection
- Select **InfluxDB**
- Click on Add New Data Source
- Name type JMeter
- Query Language select **Flux**
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

- Now we need to create a jmeter token with full acess write and read
- Click on **Load Data** -> **API Tokens**
- Click on **Generate API Token** -> **All Access API Token**
- On **Description** type a **jmeter**
- Click on **Save**
- It will display the token **save it in a secure place, you won't be able to see it again**

### Prometheus

- Login on Grafana
- Click on Connections -> Add New Connection
- Select **Prometheus**
- On **Connection** type the **Prometheus server URL** http://ec2-ip:9090
- Click on **Save & Test**

---
## Creating a Dashboard

### JMeter with InfluxDB2

- Click on Connections -> Data sources
- In the **JMeter** Data Sources, click on **Build a dashboard**
- Let's create **importing a dashboard**, click on **Import a dashboard**
- In a new **browser tab** access [JMeter Performance Testing](https://grafana.com/grafana/dashboards/13644-jmeter-load-test-org-md-jmeter-influxdb2-visualizer-influxdb-v2-0-flux/)
- Click on **Copy ID to clipboard**
- **Back to browser tab when Grafana New Dashboard is opened**
- Click on **Import a dashboard**
- **Save the Dashboard**
- Click on **Import a dashboard** again
- Paste the **Dashboard's ID** and click on Load
- On **Options session -> InfluxDB** select **JMeter**
- Click on **Import**

### JMeter with Prometheus

- Click on Connections -> Data sources
- On **prometheus** Data soruces, click on **Build a dashboard**
- Click on **Import a dashboard** and paste the **ID** from the template [JMeter with Prometheus](https://grafana.com/grafana/dashboards/2492-jmeter/)
- **Back to browser tab when Grafana New Dashboard is opened**
- Click on **Import a dashboard**
- **Save the Dashboard**
- Click on **Import a dashboard** again
- Paste the **Dashboard's ID** and click on Load
- On **Options session -> prometheus** select **prometheus**
- Click on Import

---
## Verifying Dashboards Created

- Click on **Dashboards** on left pannel
- **Both** dashboards imported are displayed
<img width="1598" height="296" alt="image" src="https://github.com/user-attachments/assets/9bf52c40-d5d8-42e9-8479-a71689809253" />



---
## Testing Dashboards

### JMeter with InfluxDB2


- To test the Dashboard, first of all we need a JMeter script with **Backend Listener**
- In **Backend Listener** fill in the fields:
  - **Backend Listener implementation**: select **influxdb2**
  - **influxDBHost**: EC2's IP
  - **influxDBPort**: 8086
  - **influxDBToken**: the one created to **jmeter**
  - **influxDBOrganization**: the same used in InfluxDB setup
  - **influxDBBucket**: the same used in InfluxDB setup
  - Also **add** these **3 new fields manually that are required to influxdb2**
    - **precision**: ms
    - **application**: application's name
    - **influxDBURL**: the complete URL with this format http://ec2-ip:8086
   <img width="1118" height="659" alt="image" src="https://github.com/user-attachments/assets/3e9d9296-6b05-490b-a3f0-5fb18c09c36e" />
   
 
- Save the file
- Upload it to **injection machine** at EC2 using MobaXterm
<img width="535" height="42" alt="image" src="https://github.com/user-attachments/assets/0a1d44f8-d506-4206-b116-579d6a00aeb0" />

- Now we need to update our jmeter in the injection machine with **influxdb2** plugin
- In the MobaXterm terminal, go to **/apps/apache-jmeter-5.6.3/lib/ext**
- Download the plugin with the command: **wget https://repo1.maven.org/maven2/io/github/mderevyankoaqa/jmeter-plugins-influxdb2-listener/2.8/jmeter-plugins-influxdb2-listener-2.8.jar**
<img width="1587" height="187" alt="image" src="https://github.com/user-attachments/assets/ae30faba-5ffd-4f02-b862-fe9a90fea9f9" />

- Verify if plugin is displayed with the command: **ls -lh jmeter-plugins-influxdb2-listener-2.8.jar**
<img width="890" height="27" alt="image" src="https://github.com/user-attachments/assets/004314f2-647d-41f7-9fff-7bdf2e56d18c" />

- One a browser tab and access Grafana: **http://ec2-ip:3000**
- Click on **Dashboard** -> select the **JMeter dashboard with InfluxDB2**

- In the **MobaXterm terminal**, back to the directory when you've uploaded the jmeter script
- **Execute** the script with this command in the MobaXterm terminal: **jmeter -n -t grafana-test.jmx -l results.txt -e -o results**

- **Go to Grafana** and verify the result of JMeter tests in **real time**, you can adjust the time interval as needed. For example: Last 5 minutes

<img width="1595" height="901" alt="image" src="https://github.com/user-attachments/assets/be7ebc64-0475-4130-b3f8-f4f60e60ceb7" />


**NOTE**: When the test execution finished, you'll be able to download JMeter hmtl report. The advantage of using Grafana dashboard to monitor it in real time, it's gaining time to investing bottleneck and issues founded during execution.

---
### JMeter with Prometheus

- To test the Dashboard, first of all we need a JMeter script with **Prometheus Listener**
- In the MobaXterm terminal, go to **/apps/apache-jmeter-5.6.3/lib/ext**
- Download the plugin with the command: **wget https://github.com/johrstrom/jmeter-prometheus-plugin/releases/download/0.7.1/jmeter-prometheus-plugin-0.7.1.jar**
- Verify if plugin is displayed with the command: **ls -lh jmeter-prometheus-plugin-0.7.1.jar**
- **Open JMeter locally**, in your script, right-click on Test Plan > Add > Listener > **Prometheus Listener**
- Click on **Add** button to add the following metrics
<img width="1432" height="432" alt="image" src="https://github.com/user-attachments/assets/63e14ffe-35b7-4e68-8913-cb10d0bb7a77" />


- Save the script and close the JMeter



- Upload the script with **Prometheus Listener to injection machine**
- One a browser tab and access Grafana: **http://ec2-ip:3000**
- Click on **Dashboard** -> select the **JMeter (via prometheus exporter)**
- In the **MobaXterm terminal**, back to the directory when you've uploaded the jmeter script
- **Execute** the script with this command in the MobaXterm terminal: **jmeter -n -t grafana-test.jmx -l results.txt -e -o results**

- **Go to Grafana** and verify the result of JMeter tests in **real time**, you can adjust the time interval as needed. For example: Last 5 minutes



    


