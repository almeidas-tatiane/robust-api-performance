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
