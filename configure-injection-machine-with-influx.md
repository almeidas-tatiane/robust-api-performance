# Configure injection machine with InfluxDB

This document is a step by step guide how to configure injection machine at EC2 with InfluxDB

## Pre-requisites

- Start your EC2 at AWS
- Access EC2 terminal by MobaXterm
- Docker installed
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

- Run the following commands **one by one** on EC2 terminal by MobaXterm

```
sudo usermod -aG docker $USER
```

- Then **log out and log back in** to apply the group change



  


  





