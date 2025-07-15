# 🌐 Using NGINX Reverse Proxy to Secure Prometheus, Node Exporter, and Grafana

This document is a step by step guide how to implement NGINX as a reverse proxy to securely expose Prometheus, Node Exporter, and Grafana dashboards on a single public port (80) with basic authentication, ensuring backend ports remain closed and protected.

This guide explains the role of NGINX and how it helps secure and simplify access to your monitoring tools.

**NGINX acts as a security layer and access gateway for monitoring services** by:
- Exposing **only port 80 (HTTP) or 443 (HTTPS)** publicly on your EC2 instance.
- Requiring **basic authentication** for all access, protecting sensitive dashboards and metrics.
- **Hiding the actual service ports** (9090 for Prometheus, 9100 for Node Exporter, 3000 for Grafana) from the public internet.
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

Direct access to these service ports is blocked to improve security. Use NGINX to:
- Forward **/ to Prometheus**
- Forward **/metrics/ to Node Exporter**
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
| 🔐 All require login      | NGINX checks `.htpasswd` credentials      |


- All on **port 80**, no explicit ports in URL.
- **Ports 9090, 9100, 3000 are blocked** in firewall and not reachable from outside.

---
## Security Additions

- 🔐 **Basic Authentication** (username/password prompt)
- 🔒 **Direct access to ports 9090 and 9100 is blocked**
- ✅ Only **NGINX (port 80)** is open to the public

