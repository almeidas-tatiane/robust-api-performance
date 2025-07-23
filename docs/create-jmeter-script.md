# Create JMeter script

This document is a step by step how to create jmeter scripts using a Postman Collection and export to JMeter.

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

- It will be saved at **jmeter folder\bin**

<img width="802" height="34" alt="image" src="https://github.com/user-attachments/assets/ebefeb29-6325-4ada-8db9-027d394b0b60" />


---
## Configuring Postman

- Open Postman
- Click on Settings
- Proxy
- Enable **Use Custom Proxy Configuration**
- Set the **Proxy server** to localhost **port** 8888
- Click on Certificate
- Click on Add Certificate
- Add the JMeter certificate generated when we click on HTTP(s) Test Script Recorder Start button

---


