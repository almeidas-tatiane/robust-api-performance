# Configuring MobaXterm

This document is a step by step guide how to configure MobaXterm to access and use the terminal in EC2 at AWS.

## ✅ Pre-requisites

- Mobaxterm installed in your machine, [download here](https://mobaxterm.mobatek.net/download-home-edition.html)
- EC2 public IP
- .pem file of EC2 key pair
- EC2 already created at AWS and in running status, [check the steps here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/ec2-creation.md)

## 🛠️ How to configure MobaXterm

- After installing MobaXterm in your computer, open it
![image](https://github.com/user-attachments/assets/3fa74518-56b9-4c09-9b0f-a4298098dc85)

- Click on New session
![image](https://github.com/user-attachments/assets/7824f149-8037-42d2-a56c-b7b581c8f22f)

- Click on SSH
- Configure the fields:
  - **Remote host**: Use the EC2 public IPv4 address
  - Click on **Specify username** check box and type the EC2 username, for Ubuntu operation System, it's **ubuntu**
  - **Port** default is 22
  - Click on Advanced SSH settings
  - Select the User private check box and select the private key created to EC2
  - Click on OK
- A message will be displayed to accept the connection, click on **Accept**


**It's done, after it, you should be able to access the EC2 terminal with public IP**

![image](https://github.com/user-attachments/assets/84daed2f-725f-4654-b526-46a723096d15)

