# 🌐 Using NGINX Reverse Proxy to Secure Prometheus, Node Exporter, InfluxDB and Grafana

This document is a step by step guide how to implement NGINX as a reverse proxy to securely expose Prometheus, Node Exporter, InfluxDB and Grafana dashboards on a single public port (80) with basic authentication, ensuring backend ports remain closed and protected.

This guide explains the role of NGINX and how it helps secure and simplify access to your monitoring tools.

**NGINX acts as a security layer and access gateway for monitoring services** by:
- Exposing **only port 80 (HTTP) ** publicly on your EC2 instance.
- Requiring **basic authentication** for all access, protecting sensitive dashboards and metrics.
- **Hiding the actual service ports** (9090 for Prometheus, 9100 for Node Exporter, 3000 for Grafana, 8086 for InfluxDB) from the public internet.
- Forwarding incoming requests from the public IP **to the appropriate backend service internally**.

## 📑 Table of Contents

- [What is NGINX?](#what-is-nginx)
- [What Is a Reverse Proxy?](#what-is-a-reverse-proxy)
- [Why Do You Need NGINX?](#why-do-you-need-nginx)
- [Example Use Case](#example-use-case)
- [NGINX Reverse Proxy Architecture for Performance Monitoring](#nginx-reverse-proxy-architecture-for-performance-monitoring)
- [Access Flow](#access-flow)
- [Security Additions](#security-additions)
- [Pre-requisites](#pre-requisites)
- [Install NGINX and Apache tools](#install-nginx-and-apache-tools)
- [Create Basic Auth Credentials](#create-basic-auth-credentials)
- [Configure NGINX as Reverse Proxy](#configure-nginx-as-reverse-proxy)
- [Enable the Site and Reload NGINX](#enable-the-site-and-reload-nginx)
- [Block Direct Access to Service Ports](#block-direct-access-to-service-ports)
- [Test Access](#test-access)
- [Troubleshooting FAQ](#troubleshooting-faq)
- [Deployment Strategy Note](#deployment-strategy-note)
- [How to disable NGINX](#how-to-disable-nginx)

---
## What is NGINX?

**NGINX** is a high-performance web server that can also act as a:
- **Reverse proxy**
- **Load balancer**
- **Content cache**
- **HTTP server**

It’s **lightweight, fast**, and widely used in both small and large-scale applications.

---
## What Is a Reverse Proxy?

A **reverse proxy** is a server that sits in front of other servers and forwards client requests to the appropriate backend service.

🔄 **Instead of users accessing backend services directly:**

```
User ---> NGINX (Reverse Proxy) ---> Backend Server (like Prometheus)
```

---
## Why Do You Need NGINX?

✅ **1. Security**
- You **hide direct access** to internal services (e.g., Prometheus on port 9090, Node Exporter on 9100).
- NGINX allows **basic authentication**, which Prometheus/Node Exporter do not support natively.

✅ **2. Port Management**
- Prometheus usually runs on port 9090 and Node Exporter on 9100.
- Instead of users accessing http://IP:9090, they can go to http://IP/ (cleaner and safer).

✅ **3. Centralized Access**
- You can access multiple services (Prometheus, Node Exporter, Grafana, etc.) behind one public IP via different paths **(/, /metrics/, /grafana, etc.)**.

✅ **4. Future Scalability**
You can later add **SSL (HTTPS), load balancing, or rate limiting** via NGINX — without changing your backend.

**NGINX helps you**
- Consolidate all services behind one port (usually 80)
- Add authentication (basic auth) to protect these services
- Hide backend ports (security by obscurity + reduce exposed ports)
- Have cleaner URLs like http://EC2_IP/ or /metrics/ instead of ports

---
## Example Use Case

Backend services:
- Prometheus: <EC2's IP>:9090
- Node Exporter: <EC2's IP>:9100
- Grafana: <EC2's IP>:3000
- InfluxDB: <EC2's IP>:8086

Direct access to these service ports is blocked to improve security. Use NGINX to:
- Forward **/ to Prometheus**
- Forward **/metrics/ to Node Exporter**
- Forward **/grafana/ to Grafana**
- Forward **influxdb/ to InfluxDB**
- Add a **login screen (basic auth)**
- Control access through **only one open port (80)**

  ---
  ## NGINX Reverse Proxy Architecture for Performance Monitoring

  <img width="763" height="526" alt="image" src="https://github.com/user-attachments/assets/8fe05b49-4a2a-428b-95ab-36550898f4b6" />

         

---
## Access Flow

| What you access          | What happens internally          |
|-------------------------|---------------------------------|
| http://ec2-ip/          | NGINX forwards to Prometheus (9090)    |
| http://ec2-ip/metrics/  | NGINX forwards to Node Exporter (9100) |
| http://ec2-ip/grafana/  | NGINX forwards to Grafana (3000)        |
| http://ec2-ip/influxdb/  | NGINX forwards to InfluxDB (8086)        |
| 🔐 All require login      | NGINX checks `.htpasswd` credentials      |


- All on **port 80**, no explicit ports in URL.
- **Ports 9090, 9100, 3000 and 8086 are blocked** in firewall and not reachable from outside.

---
## Security Additions

- 🔐 **Basic Authentication** (username/password prompt)
- 🔒 **Direct access to ports 9090, 9100, 3000 and 8086 are blocked**
- ✅ Only **NGINX (port 80)** is open to the public

---
## Pre-requisites

- EC2 instance with Ubuntu
- Prometheus, Node Exporter, and Grafana already installed and running
- Open **port 80** in the EC2 security group
<img width="1187" height="88" alt="image" src="https://github.com/user-attachments/assets/48416a94-1529-48c3-8286-c5874e03c887" />

- You have **sudo** access
- Start InfluxDB docker: **docker start influxdb**

---
## Install NGINX and Apache tools

- Access the EC2 using MobaXterm
- Run the commands one by one in the terminal

```
sudo apt update
sudo apt install nginx apache2-utils -y
```

---
## Create Basic Auth Credentials

- This will create a **.htpasswd** file used by NGINX to require login. Replace **yourusername** with your chosen username
- Run the command in the terminal
```
sudo htpasswd -c /etc/nginx/.htpasswd yourusername
```
🔒 It will ask for a password — choose a strong one and save it.
📝 Use **-c only the first time**. If you want to add more users later, run the same command **without -c**.

---
## Configure NGINX as Reverse Proxy

- Create a new NGINX config file
```
sudo nano /etc/nginx/sites-available/monitoring
```

- Paste the config below
```
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:9090/;
        auth_basic "Restricted Prometheus Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    location /metrics/ {
        proxy_pass http://localhost:9100/;
        auth_basic "Restricted Node Exporter Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    location /grafana/ {
        proxy_pass http://localhost:3000/grafana/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        auth_basic "Restricted Grafana Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }

    location /influxdb/ {
        proxy_pass http://localhost:8086/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        auth_basic "Restricted InfluxDB Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
    }
}

```

----
## Enable the Site and Reload NGINX

- Run the commands one by one in the terminal
```
sudo ln -s /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---
## Block Direct Access to Service Ports

- Go to **EC2 Console > Security Groups**
- Select your instance's security group
- In **Inbound rules, remove or restrict** ports:
  - 9090 (Prometheus)
  - 9100 (Node Exporter)
  - 3000 (Grafana)
  - 8086 (InfluxDB)
- Keep port 80 (HTTP) open to the public
<img width="1648" height="286" alt="image" src="https://github.com/user-attachments/assets/f5f3f6e0-8036-4dcc-9b3c-3ea09c87e098" />

---
## Test Access

- Try in your browser

|Public URL|	What it shows|	Login required?|
|----------|---------------|-----------------|
|http://EC2-IP/	|Prometheus UI	|✅|
|http://EC2-IP/metrics/	|Node Exporter metrics|	✅|
|http://EC2-IP/grafana/|	Grafana dashboard	|✅|
|http://EC2-IP/influxdb/|	InfluxDB UI	|✅|
|http://EC2-IP:9090, :9100, :3000, :8086|	❌ Should be blocked|	✅|

**NOTE**: Accessing any of the URL, it will ask you the username and password setup earlier at **Create Basic Auth Credentials**

- Accessing **Prometheus UI** -> http://EC2-IP/
<img width="1910" height="578" alt="image" src="https://github.com/user-attachments/assets/c6df9e6b-60bf-4934-ad9d-fb242826dead" />

- Accessing **Node Exporter Metrics** -> http://EC2-IP/metrics/
<img width="1031" height="543" alt="image" src="https://github.com/user-attachments/assets/85a51314-3802-48e8-a03a-5647b77b7fa0" />

- Accessing **Grafana** -> http://EC2-IP/grafana/
<img width="1917" height="843" alt="image" src="https://github.com/user-attachments/assets/0f2f6dfc-1308-4640-80c4-59f3c0b87088" />

- Accessing **Influx DB** -> http://EC2-IP/influxdb/
```
The expected result will be a blank page with status 200
```
<img width="1747" height="428" alt="image" src="https://github.com/user-attachments/assets/9b3d0e3c-992f-4ef3-b365-92c7fb2514bc" />

- Verifying http://EC2-IP:9090 is blocked
<img width="469" height="167" alt="image" src="https://github.com/user-attachments/assets/ad67e52b-49e3-4a67-9ff7-0283f32cc05d" />

- Verifying http://EC2-IP:9100 is blocked
<img width="448" height="179" alt="image" src="https://github.com/user-attachments/assets/70c71bf5-d8e3-4e12-80d4-b25de86c935a" />

- Verifying http://EC2-IP:3000 is blocked
<img width="460" height="177" alt="image" src="https://github.com/user-attachments/assets/cd896a3a-af0e-4995-a7d5-190d02b7b911" />

- Verifying http://EC2-IP:8086 is blocked
<img width="456" height="198" alt="image" src="https://github.com/user-attachments/assets/5c71a029-3bab-4870-899a-61f7442016c3" />


---
## Troubleshooting FAQ

**Q1: NGINX configuration test (`nginx -t`) fails with syntax errors. What should I check?**  
- Ensure there are no missing or extra curly braces `{}` in your config file.  
- Check for proper indentation and semicolons `;` at the end of each directive line.  
- Verify the `proxy_pass` URLs are correctly formatted with trailing slashes as needed.  
- Run `sudo nginx -t` after every edit to catch errors before reloading.

---

**Q2: After reloading NGINX, changes don’t seem to take effect. What can I do?**  
- Confirm you reloaded NGINX with `sudo systemctl reload nginx` or `sudo nginx -s reload`.  
- Check if the correct site config is enabled by verifying the symlink in `/etc/nginx/sites-enabled/`.  
- Look at NGINX logs for errors: `sudo journalctl -u nginx` or `/var/log/nginx/error.log`.  
- Clear your browser cache or try accessing in a private/incognito window.

---

**Q3: Unable to access services via NGINX; getting connection refused or timeout errors.**  
- Confirm backend services (Prometheus, Node Exporter, Grafana, InfluxDB) are running and accessible on localhost and correct ports.  
- Make sure firewall or EC2 Security Group rules block direct public access but allow localhost communication.  
- Double-check NGINX `proxy_pass` URLs point to the correct ports on localhost.

---

**Q4: Basic authentication prompt does not appear or login fails.**  
- Verify `.htpasswd` file exists at `/etc/nginx/.htpasswd` and has correct permissions readable by NGINX.  
- Confirm you created users correctly using `htpasswd` and did not accidentally overwrite the file after the first user (use `-c` only once).  
- Check NGINX config has `auth_basic` and `auth_basic_user_file` directives properly set in each `location` block.

---

**Q5: Grafana shows 404 errors or the dashboard doesn’t load properly behind `/grafana/` path.**  
- Ensure Grafana’s root URL is configured to use the `/grafana/` subpath (check Grafana config `root_url`).  
- Add or adjust NGINX proxy headers (`proxy_set_header`) to forward client information properly.  
- Try adding `proxy_redirect off;` inside the Grafana location block if redirects cause issues.

---

**Q6: InfluxDB UI shows a blank page or doesn’t render as expected.**  
- This behavior can be normal since InfluxDB UI might serve API endpoints rather than a traditional dashboard.  
- Confirm InfluxDB is running and accessible on port 8086 locally.  
- Use InfluxDB CLI or API clients for interaction if the UI is not needed.

---
## Deployment Strategy Note

- InfluxDB was installed via Docker to enable a faster and more isolated setup, while Prometheus, Node Exporter, and Grafana were installed directly to practice and demonstrate native Linux configuration and systemd integration.
- This mixed setup was intentional to demonstrate flexibility in managing both containerized and system-level services, as well as to focus on completing all key functionalities and documentation in a timely manner.
- In the next iteration, the full stack will be migrated to **Docker** (or Docker Compose) to improve consistency, portability, and automation — aligning with modern DevOps practices.

---
## How to disable NGINX

If for any reason you want to disable NGINX and access the services directly by port again, follow the steps bellow:

- **Stop the influxdb docker**: docker stop influxdb

- Run the MobaXterm terminal the commands:
  - **To stop NGINX**: sudo systemctl stop nginx
  - **Disable NGINX**: sudo systemctl disable nginx

- In your EC2 that is running, go to security group, inbound rules and add a rule to each of them:
  - **Grafana** port **3000**
  - **Prometheus** port **9090**
  - **InfluxDB** port **8086**
  - **Node Exporter** port **9100**
<img width="1616" height="373" alt="image" src="https://github.com/user-attachments/assets/6830fb79-eee4-457b-9604-943fd4a1a42f" />


-Verify if the services are running and listening in the correct ports
```
sudo systemctl status grafana-server
sudo systemctl status prometheus
sudo systemctl status influxdb **In case of InfluxDB is on Docker run docker start influxdb**
sudo systemctl status node_exporter
```

- Modify grafana.ini
- Run in the ModbaXterm terminal:
```
sudo nano /etc/grafana/grafana.ini
```

- Find and replace on **[server]**
- Find **root_url = http://localhost/grafana/** and replace by **root_url = %(protocol)s://%(domain)s:%(http_port)s/**
- Find **serve_from_sub_path = true** and replace by **serve_from_sub_path = false**
- Press **Ctrl+O**, **ENTER**, **Ctrul+X**

- Restart **Grafana**, run in the MobaXterm terminal: **sudo systemctl restart grafana-server**
<img width="537" height="159" alt="image" src="https://github.com/user-attachments/assets/d13ff099-daf7-4b03-88d0-830698ab4be1" />

- Clean your **brower's cache**

- Try to access in your **browser**

**Grafana**: http://ec2-ip:3000
<img width="1880" height="672" alt="image" src="https://github.com/user-attachments/assets/a5275588-ad0c-477c-9d1c-5caa650ab916" />

**Prometheus**: http://ec2-ip:9090
<img width="1919" height="679" alt="image" src="https://github.com/user-attachments/assets/f9e9d341-9583-4a6a-b85d-ac0e0022e5d9" />

**Node Exporter**: http://ec2-ip:9100
<img width="1175" height="559" alt="image" src="https://github.com/user-attachments/assets/5f4f4c00-a3d2-4ad5-95e4-e7dff4a72ec3" />

**InfluxDB**: http://ec2-ip:8086
<img width="1912" height="844" alt="image" src="https://github.com/user-attachments/assets/91d954e1-63e8-49c5-9bcd-a0b0786d934c" />














