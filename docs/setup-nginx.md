# 🌐 Using NGINX Reverse Proxy to Secure Prometheus, Node Exporter, InfluxDB and Grafana

This document is a step by step guide how to implement NGINX as a reverse proxy to securely expose Prometheus, Node Exporter, InfluxDB and Grafana dashboards on a single public port (80) with basic authentication, ensuring backend ports remain closed and protected.

This guide explains the role of NGINX and how it helps secure and simplify access to your monitoring tools.

**NGINX acts as a security layer and access gateway for monitoring services** by:
- Exposing **only port 80 (HTTP) or 443 (HTTPS)** publicly on your EC2 instance.
- Requiring **basic authentication** for all access, protecting sensitive dashboards and metrics.
- **Hiding the actual service ports** (9090 for Prometheus, 9100 for Node Exporter, 3000 for Grafana, 8086 for InfluxDB) from the public internet.
- Forwarding incoming requests from the public IP **to the appropriate backend service internally**.

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
- Consolidate all services behind one port (usually 80 or 443)
- Add authentication (basic auth) to protect these services
- Hide backend ports (security by obscurity + reduce exposed ports)
- Have cleaner URLs like http://EC2_IP/ or /metrics/ instead of ports
- Easily add HTTPS later (SSL/TLS encryption)

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
| http://ec2-ip/influxDB/  | NGINX forwards to InfluxDB (8086)        |
| 🔐 All require login      | NGINX checks `.htpasswd` credentials      |


- All on **port 80**, no explicit ports in URL.
- **Ports 9090, 9100, 3000 are blocked** in firewall and not reachable from outside.

---
## Security Additions

- 🔐 **Basic Authentication** (username/password prompt)
- 🔒 **Direct access to ports 9090 and 9100 is blocked**
- ✅ Only **NGINX (port 80)** is open to the public

---
## Pre-requisites

- EC2 instance with Ubuntu
- Prometheus, Node Exporter, and Grafana already installed and running
- Open **port 80** in the EC2 security group
<img width="1187" height="88" alt="image" src="https://github.com/user-attachments/assets/48416a94-1529-48c3-8286-c5874e03c887" />

- You have **sudo** access

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
        proxy_pass http://localhost:8086/influxdb;
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
|http://EC2-IP/influxDB/|	InfluxDB UI	|✅|
|http://EC2-IP:9090, :9100, :3000, :8086|	❌ Should be blocked|	✅|

**NOTE**: Accessing any of the URL, it will ask you the username and password setup earlier at **Create Basic Auth Credentials**

- Accessing **Prometheus UI** -> http://EC2-IP/
<img width="1910" height="578" alt="image" src="https://github.com/user-attachments/assets/c6df9e6b-60bf-4934-ad9d-fb242826dead" />

- Accessing **Node Exporter Metrics** -> http://EC2-IP/metrics/
<img width="1031" height="543" alt="image" src="https://github.com/user-attachments/assets/85a51314-3802-48e8-a03a-5647b77b7fa0" />

- Accessing **Grafana** -> http://EC2-IP/grafana/
<img width="1917" height="843" alt="image" src="https://github.com/user-attachments/assets/0f2f6dfc-1308-4640-80c4-59f3c0b87088" />

- Accessing **Influx DB** -> http://EC2-IP/influxdb/










