## 🚀 Application Deployment on AWS using Docker, Terraform, and EKS

This section provides a high-level guide to deploy the Node.js API application to AWS using container-based infrastructure and Infrastructure as Code.

---

## Architecture Decision Summary

This project intentionally provides two deployment strategies:
- Enterprise-grade Kubernetes (EKS) for scalability and realism
- Low-cost EC2-based deployment for performance testing labs

The goal is to balance realism, cost awareness, and learning value.

---

## ☁️ Cloud Deployment Technologies

| Technology    | Application in the Project                                               | Benefits                                                                 |
|---------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Docker**    | Containerizes the Node.js API to ensure portability                      | Consistent environments, easy deployment across cloud or local systems   |
| **Kubernetes (K8s)** | Manages deployment, scaling, and orchestration of Docker containers   | High scalability, automated deployments, and load balancing              |
| **Terraform** | Provisions all infrastructure as code on AWS                             | Automates infrastructure setup, version control, and reproducibility     |
| **EKS (Elastic Kubernetes Service)** | Runs the Kubernetes cluster on AWS                            | Fully managed K8s, integrates with AWS networking, IAM, and monitoring   |

---
## Table of Contents

- [Containerize the Application with Docker](#containerize-the-application-with-docker)
- [Set Up Terraform for AWS Infrastructure](#set-up-terraform-for-aws-infrastructure)
	- [Create a infra folder inside your project](#create-a-infra-folder-inside-your-project)
	- [Create a main.tf file](#create-a-maintf-file)
	- [Create a variables.tf file](#create-a-variablestf-file)
	- [Create outputs.tf file](#create-outputstf-file)
	- [Configure the Terraform locally](#configure-the-terraform-locally)
	- [Configure aws configure on Terraform](#configure-aws-configure-on-terraform)
		- [Get your credentials](#get-your-credentials)
		- [Install and configure aws configure locally](#install-and-configure-aws-configure-locally)
		- [Configure your credentials](#configure-your-credentials)
		- [Set up a not root USER at IAM](#set-up-a-not-root-user-at-iam)
			- [Create a specific policy to performance user](#create-a-specific-policy-to-performance-user)
			- [Apply the AllowEKSRoleManagement to performance user](#apply-the-alloweksrolemanagement-to-performance-user)
		- [Initialize and apply](#initialize-and-apply)
- [Deploy Application to Kubernetes](#deploy-application-to-kubernetes)
	- [Update your kubeconfig](#update-your-kubeconfig)
	- [Connection test](#connection-test)
	- [PRE-REQUISITES](#pre-requisites)
	- [Create api-secrets on cluster with mongo-uri and jwt_secret keys](#create-api-secrets-on-cluster-with-mongo-uri-and-jwt_secret-keys)
	- [Create a Kubernetes Deployment](#create-a-kubernetes-deployment)
	- [Additional commands on docker to run](#additional-commands-on-docker-to-run)
	- [Applying the deployment.yaml](#applying-the-deploymentyaml)
	- [Checking if the deployment.yaml worked](#checking-if-the-deploymentyaml-worked)
	- [Create a Kubernetes Service](#create-a-kubernetes-service)
	- [Apply the resources](#apply-the-resources)
	- [Access the Application](#access-the-application)
 - [Low-cost Deployment (EC2 + Docker)](#low-cost-deployment-ec2-docker)
---

## 🧱 Step-by-Step Deployment Guide

### 🐳Containerize the Application with Docker
Create a `Dockerfile` in your project root:

```dockerfile
# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the application port
EXPOSE 3001

# Start the application
CMD ["node", "server.js"]
```
---
***📌 Note:*** Open your Docker Desktop and make sure it's running.

Then, build and test the Docker image locally:
```
docker build -t dockerfile .
docker run -p 3001:3001 dockerfile
```

---
### Enterprise Deployment with Kubernetes (EKS)

⚠️ Cost Note:
EKS has a fixed control plane cost (~$72/month), independent of workload size.
This setup is for learning and enterprise simulation purposes.


## Set Up Terraform for AWS Infrastructure

Example folder structure:
```css
infra/
	eks-reference/
		├── main.tf
		├── variables.tf
		├── outputs.tf

```
---
### Create a infra folder inside your project

📌**Note:** : If you don't have   key_name = "performance-key" and public_key = file("~/.ssh/id_rsa.pub") created yet, follow the steps bellow:
- Open your terminal (GitBash or PowerShell) and execute:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

- When asked where to save, use the default path and press Enter key
```bash
Enter file in which to save the key (/c/Users/YourUser/.ssh/id_rsa):
```

- It will create 2 files:
  - ~/.ssh/id_rsa -> **private key**
  - ~/.ssh/id_rsa.pub -> **public key**

- Verify if the file exists in this path
```bash
cat ~/.ssh/id_rsa.pub
```
---
### Create a main.tf file

It will be used to create the main resources (EC2, VPC, etc)

```h 
provider "aws" {
  region = "us-east-1"
}

resource "aws_key_pair" "deployer" {
  key_name   = "performance-key"
  public_key = file("~/.ssh/id_ed25519.pub")
}

resource "aws_security_group" "allow_ssh_http" {
  name        = "allow_ssh_http"
  description = "Allow SSH and HTTP"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # SSH
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # App port
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2 (us-east-1)
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.allow_ssh_http.name]

  tags = {
    Name = "app-server"
  }
}


# VPC with 2 public subnets (for simplicity)
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "4.0.2"

  name = "performance-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]

  enable_dns_hostnames = true
  enable_dns_support   = true
  map_public_ip_on_launch = true

  tags = {
    Name = "performance-vpc"
  }
}


# IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "performance-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

resource "aws_iam_role_policy_attachment" "eks_cluster_AmazonEKSServicePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# IAM Role for EKS Worker Nodes (Managed Node Group)
resource "aws_iam_role" "eks_nodegroup_role" {
  name = "performance-eks-nodegroup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_worker_AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_nodegroup_role.name
}

resource "aws_iam_role_policy_attachment" "eks_worker_AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_nodegroup_role.name
}

resource "aws_iam_role_policy_attachment" "eks_worker_AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_nodegroup_role.name
}

# EKS Cluster
resource "aws_eks_cluster" "performance" {
  name     = "performance"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids = module.vpc.public_subnets
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.eks_cluster_AmazonEKSServicePolicy,
  ]
}


# EKS Managed Node Group
resource "aws_eks_node_group" "performance_nodes" {
  cluster_name    = aws_eks_cluster.performance.name
  node_group_name = "performance-node-group"
  node_role_arn   = aws_iam_role.eks_nodegroup_role.arn
  subnet_ids      = module.vpc.public_subnets

  scaling_config {
    desired_size = 2
    max_size     = 3
    min_size     = 1
  }

  instance_types = ["t2.micro"]

  depends_on = [
    aws_eks_cluster.performance,
    aws_iam_role_policy_attachment.eks_worker_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.eks_worker_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.eks_worker_AmazonEKS_CNI_Policy,
  ]
}

# Outputs for convenience
output "cluster_endpoint" {
  value = aws_eks_cluster.performance.endpoint
}

output "cluster_name" {
  value = aws_eks_cluster.performance.name
}

output "cluster_certificate_authority_data" {
  value = aws_eks_cluster.performance.certificate_authority[0].data
}

output "node_group_role_arn" {
  value = aws_iam_role.eks_nodegroup_role.arn
}

```
---
### Create a variables.tf file
```'hcl
variable "region" {
  default = "us-east-1"
}
```
---
### Create outputs.tf file

It will show IPs after creation
```h
output "app_server_ip" {
  value = aws_instance.app_server.public_ip
}

```
---
### Configure the Terraform locally
- Download Terraform: **This is for Windows**(https://developer.hashicorp.com/terraform/install#windows)
- Extract it in your computer and after that add the path in Environment Variables
- Verify the version installed: 
```cmd
terraform -v
```
---
### Configure aws configure on Terraform

**✅ What do you need**
- Access Key ID
- Secret Access Key
- Default region (ex: us-east-1)
- (Optional) Output format (blank or json)
---
### 🔐Get your credentials
To get the Access Key ID and Secret Access Key you need a AWS user that isn't root.
After that, go to IAM -> Users -> Select your non user root and verify the Access Key ID


📌**Note:** 
```
The Secret Access Key is only displayed when you create a non root user, so when you do it for the first time, don't forget to save the Secret Access Key.
```
---
### Install and configure aws configure locally
- Download the aws configure: **This is for Windows**(https://awscli.amazonaws.com/AWSCLIV2.msi)
- Install the aws.
- Verify the installation
```bash
aws --version
```
It will display something similar to
```
aws-cli/2.15.35 Python/3.11.5 Windows/10 exe/x86_64
```
---
### Configure your credentials

Run
```bash
aws configure
```
Fill in your aws information
```pqsql
AWS Access Key ID [None]: AKIAxxxxxxxxxxxxxxxx <your access key id>
AWS Secret Access Key [None]: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <your secret access key>
Default region name [None]: us-east-1     <can be any other region, but us-east-1 is free>
Default output format [None]: json
```
---
### Set up a not root USER at IAM

To execute the plan on Terraform, you'll need a USER not ROOT on AWS, to do that, follow the steps below:

- Access AWS Console: (https://console.aws.amazon.com/iam/home#/users)
- Click on IAM
- Click on Users
- Add users
- Type the name performance
- Add the following policies directly:
  - AmazonEC2FullAccess

---
 ### Create a specific policy to performance user
 - Access AWS Console and use a highly privileged administrative account (root access required only for policy creation in this lab scenario).
 - Click on IAM
 - Click on Policies
 - Click on Create policy
 - Click on JSON
 - Type the name: **AllowEKSRoleManagement**
 - Paste the policy
```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"eks:CreateCluster",
				"eks:DescribeCluster",
				"eks:DeleteCluster",
				"eks:ListClusters",
				"eks:UpdateClusterConfig",
				"eks:CreateNodegroup",
				"eks:DescribeNodegroup",
				"eks:UpdateNodegroupConfig",
				"eks:DeleteNodegroup",
				"eks:ListNodegroups",
				"iam:CreateRole",
				"iam:GetRole",
				"iam:AttachRolePolicy",
				"iam:PutRolePolicy",
				"iam:ListRolePolicies",
				"iam:ListAttachedRolePolicies",
				"iam:DeleteRole",
				"iam:DetachRolePolicy",
				"iam:CreateInstanceProfile",
				"iam:AddRoleToInstanceProfile",
				"iam:RemoveRoleFromInstanceProfile",
				"iam:DeleteInstanceProfile",
				"iam:PassRole",
				"iam:CreateServiceLinkedRole",
				"ec2:DescribeSubnets",
				"ec2:DescribeVpcs",
				"ec2:DescribeSecurityGroups",
				"ec2:CreateSecurityGroup",
				"ec2:AuthorizeSecurityGroupIngress",
				"ec2:AuthorizeSecurityGroupEgress",
				"ec2:RevokeSecurityGroupIngress",
				"ec2:RevokeSecurityGroupEgress",
				"ec2:DeleteSecurityGroup",
				"ec2:DescribeRouteTables"
			],
			"Resource": "*"
		}
	]
}
```
- Click on Next
- Click on Save
---
### Apply the AllowEKSRoleManagement to performance user
 - Access AWS Console with a ROOT user
 - Click on IAM
 - Click on Users
 - Click on Performance
 - Click on Add permissions -> Add permissions
 - Select Attach policies directly
 - Search **AllowEKSRoleManagement**
 - Select the policy **AllowEKSRoleManagement**
 - Click on Next
 - Click on Add permissions
---
### Initialize and apply
```bash
terraform init
terraform plan
terraform apply
```
---
### Deploy Application to Kubernetes

After Terraform finishes, use kubectl to interact with the cluster.

### Update your kubeconfig
```bash
aws eks --region <your-region> update-kubeconfig --name <your-cluster-name>
Ex: aws eks --region us-east-1 update-kubeconfig --name performance
```
---
### Connection test
```bash
kubectl get nodes
```
If the node group is ready and running, you'll see something like:
```pgsql
NAME                                           STATUS   ROLES    AGE   VERSION
ip-10-0-1-xxx.us-east-1.compute.internal       Ready    <none>   5m    v1.29.x
```
---
📌**Note:** 
### PRE-REQUISITES
```
Before the next step **Create a Kubernetes Deployment and Service**, verify your dockerhub-username
- Access (https://hub.docker.com)
- Login
- Your dockerhub-username is next to your profile icon or in the profile URL
```
```
In the root project, create a k8s folder, inside it, will be the files: deployment.yaml and services.yaml
```

#### Create api-secrets on cluster with mongo-uri and jwt_secret keys

📌**IMPORTANT:**

You just need to do it only once before apply the deployment.yaml
```
kubectl create secret generic api-secrets \
  --from-literal=mongo_uri='your-MongoAtlas-URI' \
  --from-literal=jwt_secret='your-JWT-password'
```
If the api-secrets were created successfully the message will be displayed:
```
secret/api-secrets created
```

### Create a Kubernetes Deployment
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: robust-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: robust-api
  template:
    metadata:
      labels:
        app: robust-api
    spec:
      containers:
        - name: robust-api
          image: <your-dockerhub-username>/robust-api:latest
          ports:
            - containerPort: 3001
          env:
            - name: MONGO_URI
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: mongo_uri
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: api-secrets
                  key: jwt_secret
```
### Additional commands on docker to run

Run in the terminal(in the same path location where application's dockerfile is)

```bash
# Build the image on the deployment.yaml
docker build -t robust-api .

#Tag with correct user
docker tag robust-api <your dockerhub-username>/robust-api:latest

# Docker Hub login
docker login

# Docker Hub push
docker push <your dockerhub-username>/robust-api:latest
```
---
### Applying the deployment.yaml

Inside k8s folder, execute:
```
kubectl apply -f deployment.yaml
````
If deployment.yaml was executed successfully the message will be displayed:
```
deployment.apps/robust-api created
```
---
### Checking if the deployment.yaml worked
```bash
kubectl get deployments
```

**You should see something similar to:**
Show how many pods are ready.
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
robust-api   0/2     2            0           3m28s
```

```bash
kubectl get pods -l app=robust-api
```

**You should see the pods name and other related information about it**
```
NAME                         READY   STATUS             RESTARTS   AGE
robust-api-687f59957-kzmd5   0/1     ImagePullBackOff   0          5m4s
robust-api-687f59957-z8526   0/1     ImagePullBackOff   0          5m4s
```

**To verify the logs**
```bash
kubectl logs <pod-name>
Ex: kubectl logs robust-api-687f59957-kzmd5
```

---
### Create a Kubernetes Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: robust-api-service
spec:
  type: LoadBalancer
  selector:
    app: robust-api
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
```
---
### Apply the resources
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
---
### ✅Access the Application
Once deployed, the LoadBalancer service will expose an external IP address:
```bash
kubectl get svc
```
📌**IMPORTANT:**
- Use this external IP to test your API in Postman or browser.
- Pay attention to Kubernetes costs at AWS, usually the daily costs are expensive.

---
## Low-cost Deployment (EC2 + Docker)

Low-Cost Application Deployment on AWS (EC2 + Docker + Terraform)


***📌 Note:*** Dockerfile is the same as described in the Containerization section.


# Start the application
CMD ["node", "server.js"]
```
---
### Set Up Terraform for AWS Infrastructure

Example folder structure:
```css
infra/
	ec2-docker/
	├── main.tf
	├── variables.tf
	├── outputs.tf

```
---
### Create an infra folder inside your project

📌**Note:** : If you don't have   key_name = "performance-key" and public_key = file("~/.ssh/id_rsa.pub") created yet, follow the steps bellow:
- Open your terminal (GitBash or PowerShell) and execute:
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

- When asked where to save, use the default path and press Enter key
```bash
Enter file in which to save the key (/c/Users/YourUser/.ssh/id_rsa):
```

- It will create 2 files:
  - ~/.ssh/id_rsa -> **private key**
  - ~/.ssh/id_rsa.pub -> **public key**

- Verify if the file exists in this path
```bash
cat ~/.ssh/id_rsa.pub
```
---
### Create a main.tf file

It will be used to create the main resources 

```h 
provider "aws" {
  region = var.region
}

# Key pair (SSH)
resource "aws_key_pair" "deployer" {
  key_name   = "performance-key"
  public_key = file("~/.ssh/id_ed25519.pub")
}

# Security Group
resource "aws_security_group" "app_sg" {
  name        = "performance-app-sg"
  description = "Allow SSH and application port"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Application port"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "performance-app-sg"
  }
}

# EC2 Instance
resource "aws_instance" "app_server" {
  ami           = var.ami_id
  instance_type = var.instance_type
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.app_sg.name]

  tags = {
    Name = "performance-app-server"
  }
}

```
⚠️ Security Note:
For learning purposes, SSH and application ports are open to 0.0.0.0/0.
In real environments, this should be restricted to specific IP ranges.

---
### Create a variables.tf file
```'hcl
variable "region" {
  default = "us-east-1"
}

variable "instance_type" {
  default = "t3.micro"
}

variable "ami_id" {
  description = "Amazon Linux 2 AMI (us-east-1)"
  default     = "ami-0c02fb55956c7d316"
}
```
---
### Create outputs.tf file

It will show IPs after creation
```h
output "public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ssh_command" {
  value = "ssh ec2-user@${aws_instance.app_server.public_ip}"
}

```
---
### Import the existed aws_key_pair

```h
terraform import aws_key_pair.deployer performance-key
```
---
### Initialize and apply
```bash
terraform init
terraform plan
terraform apply
```
---


