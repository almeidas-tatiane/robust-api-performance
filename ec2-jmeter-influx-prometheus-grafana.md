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

## ✅ Step 0: Prepare Your Environment

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
## ✅ Step 1: Manually Run the First Commands

Let’s try just the first part of the VPC setup manually in your terminal.

### 1.1 Create a VPC (Virtual Private Cloud)

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

### 1.2 Create a public subnet

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

### 1.3 Create and attach an Internet Gateway

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

### 1.4 Create a route table and add an Internet route

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

### 1.5 Enable automatic public IP assignment (optional)

This makes any new EC2 you launch in that subnet automatically get a public IP. Since we are using an Elastic IP, this step is optional.

```bash
aws ec2 modify-subnet-attribute \
  --subnet-id <YOUR_SUBNET_ID> \
  --map-public-ip-on-launch
```
Press Enter. There will be no output if successful.

---
## ✅ Step 2: Allocate and Prepare a Static Public IP (Elastic IP)

In AWS, Elastic IPs (EIPs) are public IPv4 addresses that:
- Are **static** (don’t change over time)
- Can be associated with or moved between EC2 instances
- Stay the same even if you stop and start the instance
- Must be allocated manually

**This is perfect for performance testing with JMeter, where you want to always access the same IP address.**

### 🧰 Prerequisites (before starting this step)

Make sure you have:
- Completed Step 1 (especially the VPC and subnet setup)
- A working AWS CLI session (**aws sts get-caller-identity** must work)
- Your default region set (e.g. us-east-1)

### 🔧 2.1: Allocate a New Elastic IP

In your terminal, run:
```bash
aws ec2 allocate-address --domain vpc
```
The output should look like this
```json
{
    "PublicIp": "3.86.120.45",
    "AllocationId": "eipalloc-0123456789abcdef0",
    "Domain": "vpc"
}
```
**👉 Copy both values**
- **PublicIp:** this is the actual IP you’ll access from your browser or JMeter
- **AllocationId:** used to associate the IP to an EC2 instance later

### 📘 2.2. Optional: Tag your Elastic IP (for organization)

Use this command, replacing **<ALLOCATION_ID>** with yours:
```bash
aws ec2 create-tags \
  --resources <ALLOCATION_ID> \
  --tags Key=Name,Value=my-elastic-ip
```

**This helps you find the Elastic IP in the AWS Console under a friendly name**

---

## ✅ Step 3: Launch an EC2 Instance with a Fixed Private IP

This step creates a **virtual machine (EC2 instance)** inside the VPC and subnet you created earlier, and assigns it a **fixed internal (private) IP address**, so it doesn't change even after stopping and restarting the instance.


###  🔧3.1 What You Need Before This Step

Make sure you have

|**Resource**|	**Description** |	**Example value**|
|--------|--------------|--------------|
|VPC ID|	From Step 1	|vpc-0a1b2c3d4e5f6g7h
|Subnet ID|	Public subnet inside the VPC |	subnet-1234abcd
|Private IP|	An IP inside the subnet CIDR range	|10.0.1.100
|Key Pair |	For SSH access to the EC2 instance |	my-key
|Security Group|	Allows SSH (port 22) and other access	|sg-0123456789abcdef0
|AMI ID| An Amazon Machine Image (OS template) | ami-0c55b159cbfafe1f0 (Ubuntu)


**🧠 Tip: How to find these in the Console (if unsure)**
- **AMI ID:** go to EC2 > AMIs and search for Ubuntu 22.04 in your region.
  ![image](https://github.com/user-attachments/assets/4a7181c6-84fa-4e97-8bcc-eaa72299d002)


- **Key Pair:** go to EC2 > Key Pairs.
- **Security Group:** create one that allows SSH (port 22) from your IP.
  - **Create a new security group (via CLI)**
    ```bash
    aws ec2 create-security-group \
  --group-name allow-ssh \
  --description "Allow SSH access" \
  --vpc-id <YOUR-VPC-ID>
  ```

  - Press ENTER and copy the **group-id**

  - Then allow SSH access
  ```bash
    aws ec2 authorize-security-group-ingress \
    --group-id sg-<YOUR-GROUP-ID> \
    --protocol tcp \
    --port 22 \
    --cidr <YOUR-PUBLIC-IP-ADDRESS>/32
    ```

  - Press ENTER, it will return the **SecurityGroupRuleId** and **GroupId**
  - Verify at **EC2->Security Group**
  ![image](https://github.com/user-attachments/assets/c200a89c-aa16-4008-8992-6790062c2222)

### 🚀 3.2 Launch the EC2 Instance via AWS CLI

```bash
aws ec2 run-instances \
  --image-id <GET-A-FREE-ELIGIBLE-IMAGE,AS ami-020cba7c55df1f615> \
  --instance-type <GET-A-FREE-ELIGIBLE-INSTANCE-TYPE, as t2.micro or t3.micro> \
  --key-name <YOUR-KEY> \
  --subnet-id <YOUR-SUBNET> \
  --private-ip-address 10.0.1.100 \
  --security-group-ids sg-<YOUR-SECURITY-GROUP> \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=jmeter-ec2}]' \
  --associate-public-ip-address \
  --count 1
```
### 🔍 Explanation of each parameter

|**Parameter**	|**Meaning**|
|-----------|---------|
|--image-id|	OS image to use (Ubuntu, Amazon Linux, etc.)|
|--instance-type|	Machine size; t3.micro is free tier–eligible|
|--key-name|	SSH key pair name you created in AWS|
|--subnet-id|	Public subnet created in Step 1|
|--private-ip-address|	The static internal IP (must be within subnet range, e.g. 10.0.1.100)|
|--security-group-ids|	The firewall rules for the instance|
|--associate-public-ip-address|	Automatically assigns a public IP temporarily (we’ll override with Elastic IP in Step 4)|
|--count|	Number of EC2s to create (we want 1)|
|--tag-specifications|	Helpful tag so your instance has a name|

### ✅ What Happens Next

After you run the command, AWS returns a **JSON response** like this
```json
{
    "Instances": [
        {
            "InstanceId": "i-0123456789abcdef0",
            ...
        }
    ]
}
```
👉 Copy the value of **"InstanceId" (e.g., i-0123456789abcdef0)**. You'll need it to attach the Elastic IP.

### 📘 3.3 Check Your Instance Status

To check if the instance is running
```bash
aws ec2 describe-instances --instance-ids <YOUR-INSTANCE-ID>
```

Look for:

- "State": { "Name": "running" }
- "PrivateIpAddress": "10.0.1.100" ✅
- "PublicIpAddress": "X.X.X.X" 

-----
## ✅ Step 4: Associate the Elastic IP to the EC2 instance

Now that:
- You’ve launched your EC2 instance with a **fixed private IP** (e.g. 10.0.1.100)
- You’ve allocated an **Elastic IP** (Step 2.1)
- You have the **Instance ID** (Step 3.1)
- And the Elastic **IP Allocation ID** (Step 2.1)
- It’s time to **bind the static public IP (Elastic IP)** to your EC2 instance.

### 🎯 Goal
After step 4, your EC2 instance will have:

|**IP Type**|	**Address Example**|	**Stays the Same After Restart?**|
|-----------|--------------------|-----------------------------------|
|Private IP|	10.0.1.100|	✅ Yes|
|Elastic (Public) IP|	3.86.120.45|	✅ Yes|

### 🛠️ 4.1 Associate the Elastic IP via AWS CLI

Run this command (replace with your actual values):
```bash
aws ec2 associate-address \
  --instance-id <YOUR-INSTANCE-ID> \
  --allocation-id <YOUR-ALLOCATION-ID>
```

A short JSON output confirming the association, like:
```json
{
    "AssociationId": "eipassoc-0a1b2c3d4e5f6g7h"
}
```

### 4.2 Confirm the IP assignment

Use this command to double-check the result:
```bash
aws ec2 describe-instances --instance-ids i-0123456789abcdef0
```
Look for this in the output:
```json
"PrivateIpAddress": "10.0.1.100",
"PublicIpAddress": "3.86.120.45"
```

**This means your setup is complete!**

### 📌 4.3 What to expect now

|**Action**	|**Will the IP change?**|
|-----------|-----------------------|
|**Stop EC2 instance**|	❌ No|
|**Start EC2 instance**|	❌ No|
|**Terminate EC2**|	⚠️ Yes — all lost unless backed up|
|**Disassociate EIP**|	⚠️ Yes — IP becomes unbound|




