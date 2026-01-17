output "public_ip" {
  description = "Public IP of EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ssh_command" {
  value = "ssh ec2-user@${aws_instance.app_server.public_ip}"
}
