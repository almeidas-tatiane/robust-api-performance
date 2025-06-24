# Create EC2 with JMeter, InfluxDB and Grafana

This document is a step-by-step guide how to create an AWS EC2 with JMeter, InfluxDB and Grafana

✅ **Goal**

Provision an EC2 instance with:
- Static public IP (Elastic IP)
- Static private IP (within a custom VPC)
- Ensure that the instance retains its IPs even after being stopped and restarted
- Perfect for consistent access during performance testing (e.g., JMeter, Grafana, InfluxDB)

🧰 **Prerequisites**
- AWS account
- IAM user with EC2, VPC, and Elastic IP permissions
- AWS CLI installed and configured (aws configure)
- SSH key pair created in AWS (e.g., my-key.pem)
- Set a default AWS region (e.g., us-east-1)

🔧 **Steps**
1. Create a VPC, Subnet, and Internet Gateway
