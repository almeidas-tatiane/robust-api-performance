# 📈☁️ JMeter Installation on EC2

This document is a step by step guide how to install JMeter on EC2 injection machine.

## Pre-requistes
- EC2 with Ubuntu
- EC2 configuration: 2GB of RAM and minimum of CPU

- For this example, we are using **t2.micro AWS instance** that has **1vCPU** and **1GB of ram** (**this instance is free eligible**)
- For real performance tests, I advise to use to use a robust configuration as **32GB of ram, 8 vCPUs, Operation System: Ubuntu**. In AWS, an EC2 instance with this configuration is **t2.2xlarge**
- [Check AWS Instance types](https://aws.amazon.com/ec2/instance-types/?trk=a5a8f3c9-c18a-485c-bbdb-52b795178fbe&sc_channel=ps&ef_id=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE:G:s&s_kwcid=AL!4422!3!536323165854!e!!g!!aws%20instance%20types!12028491727!115492233545&gad_campaignid=12028491727&gbraid=0AAAAADjHtp9ManJdWERBk1JBZp5ayMJpp&gclid=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE)

## Installing Java on Ubuntu

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

- Type **ls** to list the downloaded zip file

![image](https://github.com/user-attachments/assets/eed100e0-5c09-4607-b35e-adca7b760d9a)


- To unzip the file, type: **tar xvf + file-nme**. For exampe: **tar xvf jdk-24_linux-x64_bin.tar.gz**
- Press ENTER
- Type **ls** to list the jdk directory unzipped

![image](https://github.com/user-attachments/assets/3e2b4761-d6ea-48ad-8954-c9e6754fd66b)

- Go to jdk directory with command **cd jdk-24.0.1**
- Verify the files with command **ls**

![image](https://github.com/user-attachments/assets/a33d1a56-b6cd-4b51-b4fa-44e49d18f3a6)

- Go to bin directory and verify all files with command **ls-la**

![image](https://github.com/user-attachments/assets/8d78b49c-43ef-404c-b27f-4ea5267efdcd)

- Execute the command **./java --version** to verify the java version installed

![image](https://github.com/user-attachments/assets/a4adf501-b53c-4c54-be59-db693fbb042e)

- Execute the command **pwd** to verify the path where java is installed and copy the path

![image](https://github.com/user-attachments/assets/3833a3e4-e97d-4049-9fda-b81951ab596e)

- Verify where **bashrc file is (it's used to set environment variables on Ubuntu)** with the command **ls ~/.bashrc**
- Type **vi + ./bashrc path** to edit the file. For example: **vi /home/ubuntu/.bashrc**
- To write in the end of the file with a new line press **ESC** **WO**
- Add this line **export JAVA_HOME=/home/ubuntu/apps/jdk-24.0.1**
- Also add this line **export PATH=$JAVA_HOME/bin:$PATH**  **-->** **NOTE** It's important to add **$PATH** in the end of **JAVA_HOME** in the path, otherwise it will **overwrite** the PATH, then the JAVA_HOME wil be the only command in the PATH and the exists path will be deleted.
- To quit the vi edition, press **ESC**
- To save the changes, press **:wq!**
- To reload **.bashrc** after editing it, type **source /home/ubuntu/.bashrc**
- Execute the command **echo $PATH** to verify the **PATH environment variable**

![image](https://github.com/user-attachments/assets/9d4fede2-f154-4dde-9b23-f953bec4260b)

- Execute the command **echo $JAVA_HOME** to verify the path where java was installed

![image](https://github.com/user-attachments/assets/f3627910-8274-412c-a180-d15f933a54b2)

---

## Installing JMeter on Ubuntu

















