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
