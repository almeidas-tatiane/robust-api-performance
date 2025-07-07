# 📈☁️ JMeter Installation on EC2

This document is a step by step guide how to install JMeter on EC2 injection machine.

## Pre-requistes
- EC2 with Linux
- EC2 configuration: 2GB of RAM and minimum of CPU

- For this example, we are using **t2.micro AWS instance** that has **1vCPU** and **1GB of ram** (**this instance is free eligible**)
- For real performance tests, I advise to use to use a robust configuration as **32GB of ram, 8 vCPUs, Operation System: Ubuntu**. In AWS, an EC2 instance with this configuration is **t2.2xlarge**
- [Check AWS Instance types](https://aws.amazon.com/ec2/instance-types/?trk=a5a8f3c9-c18a-485c-bbdb-52b795178fbe&sc_channel=ps&ef_id=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE:G:s&s_kwcid=AL!4422!3!536323165854!e!!g!!aws%20instance%20types!12028491727!115492233545&gad_campaignid=12028491727&gbraid=0AAAAADjHtp9ManJdWERBk1JBZp5ayMJpp&gclid=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE)

## Installing Java on Linux

- Start your EC2 instance on AWS
- Connect on EC2 terminal using MobaXterm, [check the steps how to configure MobaXterm here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/configuring-mobaxterm.md)
- Verify the Linux version that is running with commad **uname -p**
  
![image](https://github.com/user-attachments/assets/3be0d2e7-f002-404c-932c-cd19ca261bc3)

- Go to Oracle Webpage, [Java Download session](https://www.oracle.com/br/java/technologies/downloads/)
- Copy the link to the latest JDK Compressed Archive to Linux based on the Linux version that is running in EC2 (**based on the screenshot above it's x86_64**)
- In the MobaXterm terminal, create an apps directory with the command **mkdir apps**
- Verify the actual directory with the command **pwd**
```
cmd
/home/ubuntu
```
- It menas the apps directory was created under /home/ubuntu
- List the directory with the command **ls**
```
cmd
apps
```

- The apps directory is displayed
- Go to apps directory with the command **cd apps**
- To download the Java version (**that the link was copied in Oracle page**) to EC2, use the command **wget + URL link** .

For example: **wget https://download.oracle.com/java/24/latest/jdk-24_linux-x64_bin.tar.gz**
![image](https://github.com/user-attachments/assets/54c24b55-c0e9-48ae-8a63-7d192cb7be3d)

- Type **ls** to list the download file

![image](https://github.com/user-attachments/assets/eed100e0-5c09-4607-b35e-adca7b760d9a)












