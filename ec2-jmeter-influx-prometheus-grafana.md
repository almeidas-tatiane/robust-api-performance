# Create EC2 with JMeter, InfluxDB, Prometheus and Grafana

This document is a step-by-step guide how to create an AWS EC2 with JMeter, InfluxDB, Prometheus and Grafana

## ✅ Goal

Provision an EC2 instance with:
- Static public IP (Elastic IP)
- Static private IP (within a custom VPC)
- Ensure that the instance retains its IPs even after being stopped and restarted
- Perfect for consistent access during performance testing (e.g., JMeter, Grafana, InfluxDB, Prometheus)
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

```
- AWS Access Key ID
- AWS Secret Access Key
- Region (e.g. us-east-1)
- Output format: you can use json
```

See the details how to get AWS Access KeyID and how to configure AWS Secret Access Key in the following link: [Get your credentials](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/application-cloud-deployment.md#get-your-credentials)

**3. Open a terminal**
If you're on Windows and don't have a Linux terminal, install **Git Bash** or **WSL**

---
### 🧪 Step 1: Manually Run the First Commands

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

**1.2 Create a public subnet**

A **subnet** is a sub-division of your VPC. We’ll make one in Availability Zone us-east-1a with the range **10.0.1.0/24**.

Replace **<YOUR_VPC_ID>** with the VPC ID you saved.

Run:
```bash
aws ec2 create-subnet \
  --vpc-id <YOUR_VPC_ID> \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-subnet}]'
```

In the JSON output, find
```json
"SubnetId": "subnet-1a2b3c4d"
```

Copy that **SubnetId (for example, subnet-1a2b3c4d)**.

**1.3 Create and attach an Internet Gateway**

An **Internet Gateway** (IGW) lets resources in your VPC talk to the Internet

**Create the IGW**
```bash
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=my-igw}]'
```
Press Enter and copy the returned **"InternetGatewayId" (e.g., igw-11aa22bb)**

**Attach** the IGW to your VPC
```bash
aws ec2 attach-internet-gateway \
  --internet-gateway-id <YOUR_IGW_ID> \
  --vpc-id <YOUR_VPC_ID>
```

Press Enter. There will be no output if successful.

**1.4 Create a route table and add an Internet route**

**Create the route table** for your VPC
```bash
aws ec2 create-route-table \
  --vpc-id <YOUR_VPC_ID> \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=public-rt}]'
```
Press Enter and copy the **"RouteTableId" (e.g., rtb-1234abcd)**

**Add a route** that sends all outbound traffic (0.0.0.0/0) to your IGW
```bash
aws ec2 create-route \
  --route-table-id <YOUR_ROUTE_TABLE_ID> \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id <YOUR_IGW_ID>
```

**Associate** the route table with your subnet
```bash
aws ec2 associate-route-table \
  --subnet-id <YOUR_SUBNET_ID> \
  --route-table-id <YOUR_ROUTE_TABLE_ID>
```
Press Enter the **AssociateID** will be displayed if successful.

**1.5 Enable automatic public IP assignment (optional)**

This makes any new EC2 you launch in that subnet automatically get a public IP. Since we are using an Elastic IP, this step is optional.

```bash
aws ec2 modify-subnet-attribute \
  --subnet-id <YOUR_SUBNET_ID> \
  --map-public-ip-on-launch
```
Press Enter. There will be no output if successful.

