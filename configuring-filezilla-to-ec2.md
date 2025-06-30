## 🖥️ Accessing EC2 via FileZilla (SFTP)

This section shows how to use **FileZilla** to connect to your EC2 instance using **SFTP**, with the `.pem` SSH key created when launching the instance.

---

### ✅ Pre-requisites

Before starting, make sure you have:

- A **running EC2 instance** with an **Elastic IP** associated
![image](https://github.com/user-attachments/assets/8e673d91-a310-4170-b772-48239f1d0eb2)

- The `.pem` private key file (e.g., `my-key.pem`)
![image](https://github.com/user-attachments/assets/c09d8774-8164-4be1-ae30-7da4a2129268)

**NOTE**
If you don't know how to create a private key file, check the [step-by-step guide here](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html).

- **Port 22** open in the **Security Group**

![image](https://github.com/user-attachments/assets/1b47fdc4-18e1-4427-95c7-898adccbe96a)

**NOTE**
If you don't know how to create a private key file, check the [step-by-step guide here](https://github.com/almeidas-tatiane/robust-api-performance/blob/main/ec2-creation.md#31-what-you-need-before-this-step).

- [FileZilla Client](https://filezilla-project.org/download.php) installed

---

### 🔁 Step 1: Convert `.pem` to `.ppk` (Windows only)

If you're using Windows, you must convert your `.pem` key to `.ppk` using **PuTTYgen**, because FileZilla requires `.ppk` format.

1. Download [PuTTYgen](https://www.puttygen.com/) or open it from the PuTTY installation.
2. Click **Load**.
3. Change the file filter to `All Files (*.*)` to see your `.pem` file.
4. Select and open your `.pem` file.
5. Click **Save private key**.
6. Save it as `my-key.ppk`.

> ⚠️ You can skip setting a passphrase unless extra security is needed.

---

### 🔐 Step 2: Add the private key to FileZilla

1. Open **FileZilla**.
2. Go to **Edit > Settings** (or **File > Settings**).
3. In the left menu, go to **Connection > SFTP**.
4. Click **Add key file...**.
5. Browse and select the `.ppk` file you saved earlier.
6. Click **OK** to confirm.

---

### 🌐 Step 3: Connect to EC2 via FileZilla

Use the Quickconnect bar or Site Manager to establish the connection:

| Field       | Value                                                                   |
|-------------|-------------------------------------------------------------------------|
| **Host**    | `sftp://<YOUR_ELASTIC_IP>` (e.g., `sftp://3.86.120.45`)                 |
| **Username**| `ubuntu` (for Ubuntu AMIs) or `ec2-user` (for Amazon Linux)             |
| **Password**| Leave it empty                                                          |
| **Port**    | `22`                                                                    |

1. Click **Quickconnect**.
2. Accept any host key prompt that appears (optional on first connection).

---

### 📂 You’re In!

Once connected, you’ll see:

- **Left pane**: your local machine files
- **Right pane**: your EC2 instance file system

You can now:
- **Upload** files by dragging them from left to right
- **Download** files by dragging them from right to left
- **Edit** remote files by right-clicking and selecting “Edit”

---

### 🔐 Security Tips

- Always keep your `.pem` and `.ppk` files secure
- Restrict **port 22** access to your **IP only** in the security group
- Do **not** share your private key with others
- Avoid using the `root` user

---

### 🧪 Optional: Test SSH CLI Access (for troubleshooting)

```bash
ssh -i my-key.pem ubuntu@<YOUR_ELASTIC_IP>
