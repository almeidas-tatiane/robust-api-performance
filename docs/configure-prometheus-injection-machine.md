# 📊 Configure Prometheus on Injection Machine

This document is a step by step guide how to configure Prometheus on Injection Machine at EC2

## Pre-requisites

- An EC2 instance running Ubuntu 
- SSH access to the instance
- Open port **9090** in your EC2 Security Group for web access
  - To add inbound roule, go to **EC2-> click on Instances** and select your instance
  - Scroll down to the **Security** section and click on the **Security Group** link
  - In the **Inbound Rules** tab, click **Edit Inbound Rules**
  - Click **Add Rule**

  - **NOTE**: Source Anywhere/IPv4
 
  ![image](https://github.com/user-attachments/assets/ac144186-54e1-4ef9-917c-ce5033f5ba1a)

  - Click on **Save Rules**
 
  ![image](https://github.com/user-attachments/assets/6ddd3eb9-de32-4615-ab00-1e6de9c7e662)

--
## Create Prometheus User

- Connect to EC2 using MobaXterm
- Run the command
```
sudo useradd --no-create-home --shell /bin/false prometheus
```

---
## Create Required Directories

- Run the commands on MobaXterm **one by one**

```
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
```

---
## Download and Extract Prometheus

- Run the commands on MobaXterm **one by one**

```
cd /tmp
wget wget https://github.com/prometheus/prometheus/releases/download/v2.52.0/prometheus-2.52.0.linux-amd64.tar.gz
tar -xvf prometheus-2.52.0.linux-amd64.tar.gz
cd prometheus-2.52.0.linux-amd64
```

---
## Move Binaries

- Run the commands on MobaXterm **one by one**

```
sudo cp prometheus /usr/local/bin/
sudo cp promtool /usr/local/bin/
```

--- 
## Set Ownership for Binaries

- Run the commands on MobaXterm **one by one**

```
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
```

---
## Move Configuration Files

- Run the commands on MobaXterm **one by one**

```
sudo cp -r consoles /etc/prometheus
sudo cp -r console_libraries /etc/prometheus
sudo cp prometheus.yml /etc/prometheus
```

--- 
## Set Ownership for Config Files

- Run the commands on MobaXterm **one by one**

```
sudo chown -R prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /var/lib/prometheus
```

---
## Create Systemd Service File

- Run the commands on MobaXterm **one by one**

```
sudo nano /etc/systemd/system/prometheus.service
```
- Paste the following:

```
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=default.target
```

- Press **CRTRL+O** to save the file
- Press **ENTER**
- Press **CRL+X** to close nano editor

---
## Reload Systemd & Start Prometheus

- Run the commands on MobaXterm **one by one**

```
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl start prometheus
sudo systemctl enable prometheus
```

---
## Verify Status

- Run the command on MobaXterm 

```
sudo systemctl status prometheus
```

- The result will be similar to

![image](https://github.com/user-attachments/assets/6450e1d3-1eee-4708-806e-af30332667f4)

---
## Access Prometheus Web UI

- Open your browser and go to:
```
http://<EC2-PUBLIC-IP>:9090
```

![image](https://github.com/user-attachments/assets/95752439-2356-434b-9c3a-e9d523dc5b47)

