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

👉 [Installing or updating to the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

**2. Configure AWS CLI**
```bash
aws configure
```

It will ask for:

See the details how to get AWS Access KeyID and how to configure AWS Secret Access Key in the following link: [https://github.com/almeidas-tatiane/robust-api-performance/blob/main/application-cloud-deployment.md#get-your-credentials]
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
📎 **What you need to do after running it:**
You’ll get a JSON output like this:

```bash
{
    "Vpc": {
        "OwnerId": "<your ownerId at AWS>",
        "InstanceTenancy": "default",
        "Ipv6CidrBlockAssociationSet": [],
        "CidrBlockAssociationSet": [
            {
                "AssociationId": "vpc-cidr-assoc-00e6828e118c27c1c",
                "CidrBlock": "10.0.0.0/16",
                "CidrBlockState": {
                    "State": "associated"
                }
            }
        ],
        "IsDefault": false,
        "Tags": [
            {
                "Key": "Name",
                "Value": "my-vpc"
            }
        ],
        "VpcId": "vpc-0c1f7a706bb9e6ee1",
        "State": "pending",
        "CidrBlock": "10.0.0.0/16",
        "DhcpOptionsId": "dopt-0367d7612c2310e5d"
    }
}
```
Copy the **VpcId** — you'll need it in the next steps.


