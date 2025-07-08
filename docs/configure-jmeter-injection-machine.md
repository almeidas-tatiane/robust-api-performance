# 📈☁️ Configure JMeter on Injection Machine

This document is a step by step guide how to install **JMeter on EC2 injection machine**.

## 📑 Table of Contents

- [Pre-requisites](#pre-requisites)
- [Installing Java on Ubuntu](#installing-java-on-ubuntu)
- [Adding Java as environment variable](#adding-java-as-environment-variable)
- [Installing JMeter on Ubuntu](#installing-jmeter-on-ubuntu)
- [Adding JMeter as environment variable](#adding-jmeter-as-environment-variable)
- [Stopping MobXterm terminal](#stopping-mobxterm-terminal)
- [Stopping EC2 injection machine](#stopping-ec2-injection-machine)


## Pre-requistes
- EC2 with Ubuntu, check the steps how to create a injection machine [here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/injection-machine-ec2-creation.md)
- EC2 configuration: 2GB of RAM and minimum of CPU

- For this example, we are using **t3.large AWS instance** that has **8vCPU** and **2GB of ram** 
- For real performance tests, I advise to use to use a robust configuration as **32GB of ram, 8 vCPUs, Operation System: Ubuntu**. In AWS, an EC2 instance with this configuration is **t2.2xlarge**
- 🔗 [Check AWS Instance types](https://aws.amazon.com/ec2/instance-types/?trk=a5a8f3c9-c18a-485c-bbdb-52b795178fbe&sc_channel=ps&ef_id=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE:G:s&s_kwcid=AL!4422!3!536323165854!e!!g!!aws%20instance%20types!12028491727!115492233545&gad_campaignid=12028491727&gbraid=0AAAAADjHtp9ManJdWERBk1JBZp5ayMJpp&gclid=CjwKCAjw4K3DBhBqEiwAYtG_9Egnpes7WDzX3R4IfkPsjhIG9NoX-3O3iR-OnYtnXPGYygX_I4naWhoCT5cQAvD_BwE)

---

## Installing Java on Ubuntu

- Start your EC2 instance on AWS
- Connect on EC2 terminal using MobaXterm, [check the steps how to configure MobaXterm here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/configuring-mobaxterm.md)
- Verify the Linux version that is running with commad **uname -p**
  
![image](https://github.com/user-attachments/assets/3be0d2e7-f002-404c-932c-cd19ca261bc3)

- Go to Oracle Webpage, 🔗 [Java Download session](https://www.oracle.com/br/java/technologies/downloads/)
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

### Adding Java as environment variable

- Execute the command **pwd** to verify the path where java is installed and copy the path

![image](https://github.com/user-attachments/assets/3833a3e4-e97d-4049-9fda-b81951ab596e)

- Verify where **bashrc file is (it's used to set environment variables on Ubuntu)** with the command **ls ~/.bashrc**
- Type **vi + ./bashrc path** to edit the file. For example: **vi /home/ubuntu/.bashrc**
- To write in the end of the file with a new line press **ESC** **WO**
- Add this line **export JAVA_HOME=/home/ubuntu/apps/jdk-24.0.1**
- Also add this line **export PATH=$JAVA_HOME/bin:$PATH**  **-->** 📌**NOTE** It's important to add **$PATH** in the end of **JAVA_HOME** in the path, otherwise it will **overwrite** the PATH, then the JAVA_HOME wil be the only command in the PATH and the exists path will be deleted.
- To quit the vi edition, press **ESC**
- To save the changes, press **:wq!**
- To reload **.bashrc** after editing it, type **source /home/ubuntu/.bashrc**
- Execute the command **echo $PATH** to verify the **PATH environment variable**

![image](https://github.com/user-attachments/assets/9d4fede2-f154-4dde-9b23-f953bec4260b)

- Execute the command **echo $JAVA_HOME** to verify the path where java was installed

![image](https://github.com/user-attachments/assets/f3627910-8274-412c-a180-d15f933a54b2)

---

## Installing JMeter on Ubuntu

- Verify if you are in the /home/ubuntu directory with the command **pwd**
- Go to directory apps with the command **cd /home/ubuntu/apps**
- Go to JMeter homepage, session Binaries and cpy the link to tgz file, [JMeter Download page](https://jmeter.apache.org/download_jmeter.cgi)
- Go to EC2 terminal on MobaXterm and type the command to download JMeter: **wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz**
- Press ENTER
![image](https://github.com/user-attachments/assets/02cf4742-4997-45c3-8da7-ac0d855f174c)

- Unzip the file with the command **tar xvf apache-jmeter-5.6.3.tgz**
- Press ENTER
- Go to jmeter directoy with the command **cd apache-jmeter-5.6.3**
- Go to bin directory with the command **cd bin**
- List the files with command **ls**

![image](https://github.com/user-attachments/assets/bad6cc42-8996-476d-8d82-d7b097f7def5)

- Verify the jmeter version with the command **./jmeter --version**
  
![image](https://github.com/user-attachments/assets/96d6f879-a29f-4160-ac3e-fda3ff9214e0)

### Adding JMeter as environment variable

- Type the command **pwd** to verify where the jmeter executable file is

![image](https://github.com/user-attachments/assets/55b076b3-9ad5-4329-9a3f-2c8e0244a1ec)

- Copy the path
- Edit the ./bashrc file with the command **vi /home/ubuntu/.bashrc**
- Press **ESC WO** to add a new line in the end of the file
- Type **export PATH=/home/ubuntu/apps/apache-jmeter-5.6.3/bin:$PATH**

![image](https://github.com/user-attachments/assets/7f15a1f5-5c38-4bf2-b42a-be5632332cc0)

- To quit the edition press **ESC**
- To save the file press **:wq!**
- To relaod the **.bashrc file** after editing it, type **source /home/ubuntu/.bashrc**
- Verify the PATH values with the command **echo $PATH**

![image](https://github.com/user-attachments/assets/786eb13f-65d3-4585-9ba8-9dc458a1891b)


## Stopping MobXterm terminal

- To stop MobXterm terminal to access EC2 instance, just click on **Exit** icon on the top

![image](https://github.com/user-attachments/assets/fd290efd-8764-4ac8-b74f-b1af8e00460b)

## Stopping EC2 injection machine

- To reduce AWS costs, don't forget to stop the EC2 when you finish to use it.
- To stop the EC2, goes to **AWS page -> EC2 -> Instances**
- Verify the running instances

![image](https://github.com/user-attachments/assets/d7defcd7-afea-4a53-9bc2-3362579ab31a)

- Select the instance
- Click on **Instance state**
- Click on **Stop instance**
- Click on **Stop**

![image](https://github.com/user-attachments/assets/1a33abda-1439-413b-acc0-4075ba961f50)





















