output "app_server_ip" {
  value = aws_instance.app_server.public_ip
}
