## 🚀 Application Deployment on AWS using Docker, Terraform, and EKS

This section provides a high-level guide to deploy the Node.js API application to AWS using container-based infrastructure and Infrastructure as Code.

---

## ☁️ Cloud Deployment Technologies

| Technology    | Application in the Project                                               | Benefits                                                                 |
|---------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **Docker**    | Containerizes the Node.js API to ensure portability                      | Consistent environments, easy deployment across cloud or local systems   |
| **Kubernetes (K8s)** | Manages deployment, scaling, and orchestration of Docker containers   | High scalability, automated deployments, and load balancing              |
| **Terraform** | Provisions all infrastructure as code on AWS                             | Automates infrastructure setup, version control, and reproducibility     |
| **EKS (Elastic Kubernetes Service)** | Runs the Kubernetes cluster on AWS                            | Fully managed K8s, integrates with AWS networking, IAM, and monitoring   |

---
### 🧱 Step-by-Step Deployment Guide

#### 1. 🐳 Containerize the Application with Docker
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
***📌 Note:*** Open your Docker Desktop and make sure it's running.

Then, build and test the Docker image locally:
```
docker build -t dockerfile .
docker run -p 3001:3001 dockerfile
```

---
2. 🛠️ Set Up Terraform for AWS Infrastructure

Example folder structure:
```css
infra/
├── main.tf
├── variables.tf
├── outputs.tf

```

**Create a infra folder inside your project**

**Create a main.tf file** - It will be used to create the main resources (EC2, VPC, etc)
```h 
provider "aws" {
  region = "us-east-1"
}

resource "aws_key_pair" "deployer" {
  key_name   = "performance-key"
  public_key = file("~/.ssh/id_rsa.pub")
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
```
**Create a variables.tf file**
```'hcl
variable "region" {
  default = "us-east-1"
}
```
**Create outputs.tf file** - It will show IPs after creation
```h
output "app_server_ip" {
  value = aws_instance.app_server.public_ip
}

```
---
**Configure the Terraform locally**
- Download Terraform: **This is for Windows**(https://developer.hashicorp.com/terraform/install#windows)
- Extract it in your computer and after that add the path in Environment Variables
- Verify the version installed: 
```cmd
terraform -v
```
---
**Configure aws configure on Terraform**

**✅ What do you need**
- Access Key ID
- Secret Access Key
- Default region (ex: us-east-1)
- (Optional) Output format (blank or json)

##### 🔐 Step 1: Get your credentials
To get the Access Key ID and Secret Access Key you need a AWS user that isn't root.
After that, goes to IAM -> Users -> Select your non user root and verify the Access Key ID

📌**Note:** The Secret Access Key is only displayed when you create a non root user, so when you do it for the first time, don't forget to save the Secret Access Key.

##### Install and configure aws configure locally
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

**Configure your credentials**
Run
```bash
aws configure
```
Fill in your aws information
```pqsql
AWS Access Key ID [None]: AKIAxxxxxxxxxxxxxxxx <your access key id>
AWS Secret Access Key [None]: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx <yoour secret access key>
Default region name [None]: us-east-1     <can be any other reagion, but us-east-1 is free>
Default output format [None]: json
```

**Initialize and apply:**
```bash
terraform init
terraform apply
```
---
3. ☸️ Deploy Application to EKS (Kubernetes)
After Terraform finishes, use kubectl to interact with the cluster.

***Update your kubeconfig:***
```bash
aws eks --region <your-region> update-kubeconfig --name <your-cluster-name>
```

***Create a Kubernetes Deployment and Service:***
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
***Apply the resources:***
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
***🔐 Store Secrets (Optional)***
Use Kubernetes Secrets or AWS Secrets Manager to store sensitive data:
```bash
kubectl create secret generic api-secrets \
  --from-literal=mongo_uri='your-mongo-uri' \
  --from-literal=jwt_secret='your-secret-key'
```
***✅ Access the Application***
Once deployed, the LoadBalancer service will expose an external IP address:
```bash
kubectl get svc
```
Use this external IP to test your API in Postman or browser.




