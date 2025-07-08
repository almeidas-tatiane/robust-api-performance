# 📘 Configure injection machine with InfluxDB

This document is a step by step guide how to configure injection machine at EC2 with InfluxDB

## Pre-requisites

- Start your EC2 at AWS
- Access EC2 terminal by MobaXterm
- Docker installed
- Inbound port **8086** open in the Security Group
  - To add inbound roule, go to **EC2-> click on Instances and select your instance**
  - Scroll down to the **Security section** and click on the **Security Group** link
  - In the **Inbound Rules** tab, click Edit **Inbound Rules**
  - Click Add Rule
  - Add both rules
  - **NOTE**: Source Anywhere/IPv4 
    
![image](https://github.com/user-attachments/assets/89995a62-d224-44d4-96d7-1521f7a8d637)

  - Click on **Save Rules**

  ![image](https://github.com/user-attachments/assets/ea9ac069-9846-4412-89ab-5bb6b754263c)


---

## Install Docker on Ubuntu

- Run the following commands **one by one** on EC2 terminal by MobaXterm

```
# Update the package list
sudo apt update && sudo apt upgrade -y

# Install Docker dependencies
sudo apt install -y ca-certificates curl gnupg

# Add Docker’s official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update again and install Docker Engine
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```
---
## Start Docker and Enable on Boot

- Run the following commands **one by one** on EC2 terminal by MobaXterm

```
# Start Docker
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker
```
--- 
## Allow Docker for Current User

- Run the command on EC2 terminal by MobaXterm

```
sudo usermod -aG docker $USER
```

- Then **log out and log back in** using MobaXterm to apply the group change
---
## Run InfluxDB in Docker

- Run the command on EC2 terminal by MobaXterm

```
docker run -d \
  --name influxdb \
  -p 8086:8086 \
  -v influxdb_data:/var/lib/influxdb2 \
  -v influxdb_config:/etc/influxdb2 \
  influxdb:2.7
```
---
## Access InfluxDB Web UI

- Open this URL in your browser
```
http://<YOUR-EC2-PUBLIC-IP>:8086
```

![image](https://github.com/user-attachments/assets/ff40475b-bda5-4f46-b21a-b0a3863d69b7)

---
## Initial Web Setup

- In the browser:
  - Set up **username** and **password**
  - Choose **organization name** and **bucket**
  
  ![image](https://github.com/user-attachments/assets/3c688a65-cc85-4ac3-ad1f-ed4cf36dd86b)
  
  - Click on **Continue**
  - Copy and save your **admin token**

 ---
 ## Verify with curl

- Run the command on EC2 terminal by MobaXterm

```
curl -i http://<YOUR-EC2-PUBLIC-IP>:8086/health
```

- The response will be similar to

![image](https://github.com/user-attachments/assets/51b7dff2-23bb-4f23-8cfb-42c96059ae96)

---
## Useful Docker Commands

```
# View container logs
docker logs influxdb

# Stop the container
docker stop influxdb

# Start the container
docker start influxdb

# Remove the container
docker rm -f influxdb

# Check status
docker ps -a
```


  


  





