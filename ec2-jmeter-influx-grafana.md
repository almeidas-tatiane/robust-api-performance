# Create EC2 with JMeter, InfluxDB and Grafana

This document is a step-by-step guide how to create an AWS EC2 with JMeter, InfluxDB and Grafana

## ✅ Goal

Provision an EC2 instance with:
- Static public IP (Elastic IP)
- Static private IP (within a custom VPC)
- Ensure that the instance retains its IPs even after being stopped and restarted
- Perfect for consistent access during performance testing (e.g., JMeter, Grafana, InfluxDB)
---
## 🧰 Prerequisites
- AWS account
- IAM user with EC2, VPC, and Elastic IP permissions
- AWS CLI installed and configured (aws configure)
- SSH key pair created in AWS (e.g., my-key.pem)
- Set a default AWS region (e.g., us-east-1)
---
## 🛠️ STEP-BY-STEP: How to Run These Commands

### ✅ Step 0: Prepare Your Environment

**1. Install AWS CLI**

👉 [Follow the guide:](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

**2. Configure AWS CLI**
```bash
aws configure
```

It will ask for:
```
- AWS Access Key ID
- AWS Secret Access Key
- Region (e.g. us-east-1)
- Output format: you can use json
```

**3. Open a terminal**
If you're on Windows and don't have a Linux terminal, install **Git Bash** or **WSL**

---
### 🧪 Step 1: Manually Run the First Command

Let’s try just the first part of the VPC setup manually in your terminal.

**1.1 Create a VPC (Virtual Private Cloud)**
🧠 **What it does:**
This creates a **virtual private network** in AWS where your EC2 instance will live.
```bash
aws ec2 create-vpc --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=my-vpc}]'
```
