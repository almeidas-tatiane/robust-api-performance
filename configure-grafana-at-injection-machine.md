# 🧭 Configure Grafana on injection machine

This document is a step by step guide how to configure Grafana on injection machine at EC2

## 📑 Table of Contents

- [Pre-requisite](#pre-requisites)
- [Installing Grafana on Ubuntu EC2](installing-grafana-on-ubuntu-ec2)
- [Install Dependencies](install-dependencies)
- [Add Grafana GPG Key and Repo](add-grafana-gpg-key-and-repo)
- [Install Grafana OSS](install-grafana-oss)
- [Start and Enable Grafana](start-and-enable-grafana)
- [Access Grafana Web UI](access-grafana-web-ui)

---
## Pre-requisites

- An **Ubuntu EC2** instance running (e.g., **t3.micro or larger**)

![image](https://github.com/user-attachments/assets/989acfce-2ece-482a-9773-94a46d26cd61)

- Security Group with **ports 22 (SSH), 3000 (Grafana Web UI)** open
- To see how to configure security groups,[check here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/configure-injection-machine-with-influxdb.md#pre-requisites)

![image](https://github.com/user-attachments/assets/bd4ead6c-803c-48bf-97c3-b3a2a047096d)


- SSH access to your instance using **.pem** file. You can access using MobaXterm terminal
  
---
## Installing Grafana on Ubuntu EC2

- Connect on EC2 by SSH using MobaXterm
- Update the system

```
sudo apt-get update && sudo apt-get upgrade -y
```

---
## Install Dependencies

- Run the command at MobaXterm

```
sudo apt-get install -y software-properties-common apt-transport-https curl
```

---
## Add Grafana GPG Key and Repo

- Run the command at MobaXterm

```
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee /etc/apt/sources.list.d/grafana.list > /dev/null
```

---
## Install Grafana OSS

- Run the command at MobaXterm **one by one**

```
sudo apt-get update
sudo apt-get install grafana -y
```

---
## Start and Enable Grafana

- Run the command at MobaXterm **one by one**

```
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

- Verify status

```
sudo systemctl status grafana-server
```

- The result will be similar to

![image](https://github.com/user-attachments/assets/05dc0592-44d6-4e5a-8b9b-cd73ce204eab)

---
## Access Grafana Web UI

- Open your browser
- Go to: **http://<EC2_PUBLIC_IP>:3000**

![image](https://github.com/user-attachments/assets/bb396cdc-3fd7-40a1-ace4-cec8394338bc)

- Default credentials:
  - **Username**: admin
  - **Password**: admin (you’ll be asked to change it on first login)

 ![image](https://github.com/user-attachments/assets/846dafcf-39d2-4072-80d0-b245560093cb)





