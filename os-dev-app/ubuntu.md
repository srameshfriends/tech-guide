## Upgrade from Ubuntu 20.04 LTS to Ubuntu 22.04 LTS

Ubuntu 22.04, codenamed Jammy Jellyfish, was released by Canonical on April 21 2022. It is the latest long-term support (LTS) release after its predecessor, Ubuntu 20.04 LTS.

Ubuntu 22.04 provides major enhancements, new capabilities, and a number of new software packages such as:

* PHP 8.1.2
* OpenSSL 3.0
* Ruby 3.0
* Python 3.10.4
* MySQL 8.0.28
* PostgreSQL 14.2
* Linux kernel v5.15.0-25 & MESA 22



#### Prerequisites

1. At least 20 GB of free disk space. You can check the available disk space using the df -Th command.
2. Ensure you have a regular user configured with sudo privileges with access to SSH or the terminal app. This is the user you will use to perform the upgrade process.
3. In addition, ensure you have a fast and stable internet connection. Do not cancel the operation once it’s begun.
4. Sudo User with admin privileges
5. Ensure your UPS or battery are fully charged and working.
6. Close all open applications.

* Backup all your data
* Upgrade all the system packages

#### Upgrade all the system packages

```
sudo apt list –upgradable
```

Next, refresh the local package index and upgrade the packages in one single command as follows:

```
sudo apt update && sudo apt upgrade -y
```
This might take a while depending on the number of installed packages with pending upgrades. Once the upgrade is complete, reboot your system to take advantage of the latest kernel that will come with the upgrade.

```
sudo reboot
```

Then log back into the system and confirm it has been upgraded to the latest release, which, at the time of publishing this guide, is Ubuntu 20.04.4 LTS.

```
lsb_release -a
```

#### Open TCP port 1022


```
sudo ufw allow 1022/tcp
sudo ufw reload
sudo ufw status
```

#### Upgrade to Ubuntu 22.04 Jammy Jellyfish


```
sudo apt install update-manager-core
sudo do-release-upgrade
```

During the upgrade, the upgrade tool will probe for the latest LTS release and walk you through a series of prompts.

First and foremost, it will detect your SSH connection and notify you that an additional SSH service will be started on port 1022. Simply type “Y” to proceed.

It will ask decision Y or N  to accept for installation.

#### Verify the upgrade to Ubuntu 22.04



```
lsb_release -a
```
checks the version of Linux, while the command


```
uname -mrs
```

Delete the firewall rule you created



```
ufw delete allow 1022/tcp
```

Enable third-party repositories


```
/etc/apt/sources.list.d

```

To display these repositories, run the command:


```
ls -l etc/apt/sources.list.d/
```
Finally, free up the disk space by removing all the unnecessary packages as follows:

```
sudo apt autoremove –purge
```

Conclusion
As you have seen, upgrading Ubuntu 20.04 to Ubuntu 22.04 is a simple process that requires just a few commands.


## Setting Up and Securing SSH on Ubuntu 22.04: A Comprehensive Guide

Setting Up and Securing SSH on Ubuntu 22.04: A Comprehensive Guide  

In this tutorial we will guide you through the process of enabling SSH on your Ubuntu 22.04 system, configuring the appropriate firewall rules to allow inbound connections, and changing the default SSH port for enhanced security.

1. **Update the System**

```
sudo apt update
sudo apt upgrade
```
2. **Install the OpenSSH Server**

To enable SSH on your Ubuntu system, you'll need to install the OpenSSH server. Run the following command in the terminal window:

```
sudo apt install openssh-server
```

3. **Configure Firewall Rules for SSH**


```
sudo ufw status
sudo ufw enable
sudo ufw allow ssh
```

4. **Change the Default SSH Port**

In this example, we'll change the default SSH port from 22 to 33556. You can choose a different port number if you prefer, but make sure it's not already in use by another service.

First, create a backup of the original SSH configuration file:

```
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
```
Next, open the SSH configuration file using a text editor like nano:


```
sudo nano /etc/ssh/sshd_config
```
Find the line that starts with #Port 22 and change it to the desired port number. Remove the # at the beginning of the line to uncomment it. For example:
**Port 33556**

5. Configure Firewall Rules for the Custom SSH Port

Update the firewall rules to allow inbound connections on the custom SSH port. First, delete the previous SSH rule:

```
sudo ufw delete allow ssh
```
Then, add a new rule for the custom SSH port:


```
sudo ufw allow 33556/tcp
```

6. **Restart the SSH Service**

Restart the SSH service to apply the changes:

```
sudo systemctl restart ssh
```
7. **Verify the Configuration**

```
sudo systemctl status ssh
```
If the configuration was successful, you should see information about the SSH service running with the new port number.

8. **Connect to the Custom SSH Port**

```
ssh -p 33556 yourusername@10.20.30.40
```
You've successfully enabled SSH, configured the necessary firewall rules, and changed the default SSH port on your Ubuntu 22.04 system. Remember to use the custom port when connecting to your system via SSH in the future.


# Ubuntu Command

add user for **devops** 

```
sudo useradd -m -d /home/devops devops
```

To change a password for user named **devops**


```
sudo passwd devops
```
Login with **devops**

```
su devops
```

##### ssh-key generate under the user 

```
ssh-keygen -t rsa -b 4096 -m PEM
```
You should see following two files:
#authorized_keys - private 
#authorized_keys.pub - public 



```
cat authorized_keys.pub > authorized_keys
```

move the files into the .ssh folder if not created 

```
mkdir .ssh
cd .ssh
mv authorized_keys /home/devops/.ssh
mv authorized_keys.pub /home/devops/.ssh
```

change access rights

```
chown -R devops /home/devops/.ssh
chmod 600 /home/devops/.ssh/authorized_keys
chmod 600 /home/devops/.ssh/authorized_keys.pub
chmod 700 /home/devops/.ssh
```



#   Ubuntu update to fix "The following signatures were invalid: EXPKEYSIG xxx Ubuntu

* Note that downloading a key from a keyserver or any similar insecure activity is not an answer, it is the problem itself.
* So a proper acceptable answer must include a way to (cryptographically) verify that it is legit and that the originator of the failing (and then fixed) repositories indeed is Canonical and not somebody else who is able to act as a fake Ubuntu mirror, keyserver or MitM (possibly with a legit SSL certificate from some compromized CA).
* It must be able to reproduce the solution on an unmodified, authentic and offlined Ubuntu 20.04 LTS which only has access to some local unverified Ubuntu mirror (so it must verify the authenticity of the mirror, too).
* The solution must not include time distortion (the machine must be NTP synchronized) nor switching off some security features on a global scale (like disabling apt checking for expired keys).
* However the solution can include local modifications which allow to continue to use the expired key, as long as this does not affect any other key on the machine, like manually extending the lifetime of key C8CAB6595FDFF622, but only of this lonely key.


```
sudo apt-get install ubuntu-dbgsym-keyring 

sudo apt remove --purge ubuntu-dbgsym-keyring
sudo apt-key del 0xC8CAB6595FDFF622
sudo apt install ubuntu-dbgsym-keyring

```
