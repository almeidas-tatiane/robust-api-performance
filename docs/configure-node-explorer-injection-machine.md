# 📊 Monitoring Linux Server with Node Exporter

This guide shows how to install and configure **Node Exporter** to monitor system metrics on a Linux server.

---

## What is Node Exporter?

**Node Exporter** is an **open-source monitoring agent** developed by Prometheus. It collects **hardware and operating system metrics** from a Linux system and exposes them via an HTTP endpoint, usually at http://localhost:9100/metrics. It helps to collect:

- CPU, memory, disk usage
- Network interfaces
- System load
- Filesystems
- And more...

## Why use Node Exporter?

- To **monitor system health and performance**
- To **create alerts** (e.g., high CPU or low disk space)
- To **visualize server metrics in Grafana**
- To **establish baselines and detect anomalies** in infrastructure

In short: **Node Exporter = system metrics → Prometheus → Grafana dashboards**

---
## Pre-requisites

- EC2 with Linux
- Add 9100 port in the EC2 security group
<img width="1576" height="60" alt="image" src="https://github.com/user-attachments/assets/31578b2e-307f-49ad-8f6b-28149238e77f" />

- MobaXterm configured

---

## Install Node Exporter

- Run the commands on MobaXterm terminal

```bash
# Download the latest version
cd ~/apps
wget https://github.com/prometheus/node_exporter/releases/download/v1.9.1/node_exporter-1.9.1.linux-amd64.tar.gz
tar xvf node_exporter-1.9.1.linux-amd64.tar.gz
```
---

## Create a systemd Service

- Run the command

```bash
sudo nano /etc/systemd/system/node_exporter.service
```
- This opens the file in the nano text editor with superuser permissions.
- Paste the following contents into the file:

```ini
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=ubuntu
ExecStart=/home/ubuntu/apps/node_exporter-1.9.1.linux-amd64/node_exporter

[Install]
WantedBy=default.target
```

- ✅ ExecStart path must match where your node_exporter binary is. By default, it's in /usr/local/bin/.

- Reload systemd to detect the new service
```bash
sudo systemctl daemon-reload
```

- Start the service
```bash
sudo systemctl start node_exporter
```

- Enable service on boot
```bash
sudo systemctl enable node_exporter
```

- Check the service status
```bash
sudo systemctl status node_exporter
```

- The result will be similar to
<img width="1585" height="424" alt="image" src="https://github.com/user-attachments/assets/ad02ac6b-5dde-496c-a4a7-4d4c30f37865" />


- Confirm it's running
```
http://<your-ec2-ip>:9100/metrics
```

<img width="979" height="495" alt="image" src="https://github.com/user-attachments/assets/811ff30e-6483-4aba-b030-4b880f659b65" />




