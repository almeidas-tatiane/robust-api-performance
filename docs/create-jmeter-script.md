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
- It will generated a certificate that will be used in Postman in the next step, this certificate will be saved at **jmeter folder\bin**


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


