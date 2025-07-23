# Create JMeter Script

This document is a step by step how to create jmeter scripts using a Postman Collection and export to JMeter.

## 📑 Table of Contents

- [Pre-requisites](#pre-requisites)
- [Configuring JMeter](#configuring-jmeter)
- [Configuring Postman](#configuring-postman)
- [Executing the Postman collection while JMeter is recording](#executing-the-postman-collection-while-jmeter-is-recording)
- [Generating scripts with openAPI](#generating-scripts-with-openapi)
- [Download the final version of JMeter file](#download-the-final-version-of-jmeter-file)

---
## Pre-requisites
- Application running locally or at Cloud
- A Postman collection already tested and working

---
## Configuring JMeter

- Open JMeter
- Click on Test Plan -> Add -> Threads (Users) ->Thread Group
- Click on Thread Group and change the name as desired, for example **Flow**
- Click on Test Plan -> Add -> Non Test Elements-> HTTP(s) Test Script Recorder
- At Target Controller select the Thread Group **Flow**
- Click on Start
- It will generated a certificate that will be used in Postman in the next step, this certificate

<img width="731" height="317" alt="image" src="https://github.com/user-attachments/assets/cb1b4fdb-5285-45f6-b97a-44865ec89641" />

Indicating the tests are recording

<img width="516" height="176" alt="image" src="https://github.com/user-attachments/assets/8eaa2a9e-2d07-4d0c-a280-85dd90ccae01" />


- The certificate will be saved at **jmeter folder\bin**

<img width="802" height="34" alt="image" src="https://github.com/user-attachments/assets/ebefeb29-6325-4ada-8db9-027d394b0b60" />


---
## Configuring Postman

- Open Postman
- Click on Settings -> Settings
- Proxy
- Enable **Use Custom Proxy Configuration**
- Set the **Proxy server** to localhost **port** 8888

<img width="702" height="652" alt="image" src="https://github.com/user-attachments/assets/6d564dd5-11de-41da-bc47-bb6e28683d89" />

- Click on Certificates
- Click on Add Certificate
- On **CRT file** click on Select File
- Select the certificate saved at **jmeter folder\bin**

<img width="735" height="594" alt="image" src="https://github.com/user-attachments/assets/17dfb3db-2b2a-4203-bd9a-3db1d1d85fe3" />

- Close the Settings window

---
## Executing the Postman collection while JMeter is recording

- Go to Postman and execute each request of your collection
- When execution is done, back to JMeter and **stop** the recorder
- Verify the Postman's transactions are in **Flow** Thread Group at JMeter

<img width="465" height="265" alt="image" src="https://github.com/user-attachments/assets/a20ac0ef-4c00-46ec-8ad9-d40afab34425" />

- Now you can adjust the script in the JMeter as necessary, adding post processor, variables etc

---
## Generating scripts with openAPI

This is a different approach if you need to create JMeter tests to API and don't want to import from Postman.

- Install the JAR from openAPI, [CLI installation](https://openapi-generator.tech/docs/installation/#jar)
- Run this command in the **same location where JAR from openAPI was installed**: **java -jar openapi-generator-cli.jar generate -i http://localhost:3001/swagger.yaml -g jmeter**
- The result will be similar to
<img width="1902" height="579" alt="image" src="https://github.com/user-attachments/assets/2a8808ee-064e-4a42-b4b3-7e246ad3dc82" />

- Go to directly where you run the command and verify the files: **DefaultApi.jmx** and **DefaultApi.csv**
<img width="1074" height="80" alt="image" src="https://github.com/user-attachments/assets/d4eae38d-1c96-49c2-a95b-c99c3aa31be8" />

- Now you can adjust the script in the JMeter as necessary, adding post processor, variables etc

<img width="1909" height="547" alt="image" src="https://github.com/user-attachments/assets/a9e286ea-0959-4688-b5e2-36b493ce9b9f" />

---
## Download the final version of JMeter file

- You can download the file here [robust-api-performance.jmx](https://github.com/almeidas-tatiane/robust-api-performance/tree/main/tests)


