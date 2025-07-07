# 📈☁️ JMeter Installation on EC2

This document is a step by step guide how to install JMeter on EC2 injection machine.

## Pre-requistes
- EC2 with Linux
- EC2 configuration: 2GB of RAM and minimum of CPU

- For this example, we are using t2.micro AWS instance that has 1vCPU and 1GB of memory (**this instance is free eligible**)
- For real performance tests, I advise to use to use a robust configuration as 32GB of ram, 8 vCPUs, Operation System: Ubuntu. In AWS, an EC2 instance with this configuration is **m8g.2xlarge**
- [Check AWS Instance types](https://aws.amazon.com/ec2/instance-types/?trk=a5a8f3c9-c18a-485c-bbdb-52b795178fbe&sc_channel=ps&ef_id=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE:G:s&s_kwcid=AL!4422!3!536323165854!e!!g!!aws%20instance%20types!12028491727!115492233545&gad_campaignid=12028491727&gbraid=0AAAAADjHtp9ManJdWERBk1JBZp5ayMJpp&gclid=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE)

## Installing Java on Linux


