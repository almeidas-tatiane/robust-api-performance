# Configure injection machine with Influx

This document is a step by step guide how to configure injection machine at EC2 with Influx

## Pre-requisites

- Start your EC2 at AWS
- Access EC2 terminal by MobaXterm
- Inbound port **8086** open in the Security Group
  - To add inbound roule, go to **EC2-> Network & Security -> Security Groups**
  - Click on Create Security Group
  - Fill in the fields to allow **InfluxDB**
    
  ![image](https://github.com/user-attachments/assets/86c3c405-edb4-47cc-beb6-632aa98ad1e2)


  **NOTE**: Source is Anywhere/IPv4 to both **InfluxDB** and **Grafana**

  - Click on **Add rule** to add a new rule to allow **Grafana**
  - Fill in the fields
 
  ![image](https://github.com/user-attachments/assets/2874888f-715b-43f7-bb42-8cddc482fe7d)

  - Click on Create Security Group
 
  ![image](https://github.com/user-attachments/assets/b537a21f-efec-422d-bc1b-12d6f9a4ea1c)

  


  





