# 📊 Configure Prometheus on Injection Machine

This document is a step by step guide how to configure Prometheus on Injection Machine at EC2

## 📑 Table of Contents

- [Pre-requisites](#pre-requisites)
- [Create Prometheus User](#create-prometheus-user)
- [Create Required Directories](#create-required-directories)
- [Download and Extract Prometheus](#download-and-extract-prometheus)
- [Move Binaries](#move-binaries)
- [Set Ownership for Binaries](#set-ownership-for-binaries)
- [Move Configuration Files](#move-configuration-files)
- [Set Ownership for Config Files](#set-ownership-for-config-files)
- [Create Systemd Service File](#create-systemd-service-file)
- [Reload Systemd and Start Prometheus](#reload-systemd-and-start-prometheus)
- [Verify Status](#verify-status)
- [Access Prometheus Web UI](#access-prometheus-web-ui)
- [Add Node Exporter in the Prometheus yml](#add-node-exporter-in-the-prometheus-yml)
- [Add JMeter in the Prometheus yml](#add-jmeter-in-the-prometheus-yml)
- [Reload Prometheus Configuration](#reload-prometheus-configuration)
- [Verify in Web UI after Node Exporter configuration](#verify-in-web-ui-after-node-exporter-configuration)
- [Add JVM ARGS Prometheus configuration as environment variable](#add-jvm-args-prometheus-configuration-as-environment-variable)


---

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

  - Also create an **Inbound Rule** to port **9270** that will allow **JMeter with Prometheus**
  <img width="1327" height="97" alt="image" src="https://github.com/user-attachments/assets/f1ee3405-4d19-430f-a0b9-8e2bb51058c0" />


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
## Reload Systemd and Start Prometheus

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

---
## Add Node Exporter in the Prometheus yml

- Open the file in an editor
```bash
sudo nano /etc/prometheus/prometheus.yml
```

- Scroll to the section called **scrape_configs**. Add this block:
```yaml
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['<ec2 ip>:9100']
```

- Make sure the indentation is correct (spaces, **not tabs**). Example:
```yaml
scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['<ec2 ip>:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['<ec2 ip>:9100']
```

---
## Add JMeter in the Prometheus yml

- Open the file in an editor
```bash
sudo nano /etc/prometheus/prometheus.yml
```

- Scroll to the section called **scrape_configs**. Add this block:
```yaml
  - job_name: 'jmeter'
    static_configs:
      - targets: ['<ec2 ip>:9270']
```

---
## Reload Prometheus Configuration

- Restart Prometheus to apply the new configuration
```bash
sudo systemctl restart prometheus
```

---
## Verify in Web UI after Node Exporter configuration

- Open Prometheus in your browser:
```
http://<your-ec2-ip>:9090/targets
```

<img width="1916" height="511" alt="image" src="https://github.com/user-attachments/assets/77f43ec5-a38c-48f5-907f-4f98d92f65ee" />

---
## Add JVM ARGS Prometheus configuration as environment variable

- In the MobaXterm, run the command: **nano ~/.bashrc**
- Add thsi line in the end: **export JVM_ARGS="-Dprometheus.ip=0.0.0.0 -Dprometheus.port=9270"**
- Save (CTRL+O, ENTER) and quit (CTRL+X)
- Apply the changes: **source ~/.bashrc**
- Also edit the global file to all users's system: **sudo nano /etc/environment**
- Add this line in the end: **JVM_ARGS="-Dprometheus.ip=0.0.0.0 -Dprometheus.port=9270"**
- **CTRL+O , ENTER, CTRL+X**; to save and exit
- Restart the injection machine to apply the changes
- In the MobaXterm terminal, open a new terminal
- Run to verify if the changes worked: **echo $JVM_ARGS**
- It should display: **-Dprometheus.ip=0.0.0.0 -Dprometheus.port=9270**

**NOTE: This change will allow metrics will be displayed at http://ec2-ip:9270 when JMeter script is running**
<img width="1180" height="751" alt="image" src="https://github.com/user-attachments/assets/7e844373-f654-4959-b83b-f98f83e2e7b8" />

The metrics defined in **Prometheus listener** in jmx file will be displayed at http://ec2-ip:9270

<img width="1632" height="270" alt="image" src="https://github.com/user-attachments/assets/c6e3b7eb-0f16-47ca-b9aa-8fdd65619532" />



**NOTE: This metrics will be directed to Grafana, and then displayed in the JMeter with Prometheus Dashboard**












