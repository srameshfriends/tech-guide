
### About Jenkins

* Jenkins is a self-contained, leading open source automation server
* Jenkins provides hundreds of plugins to support building, deploying, and automating any project.
* It helps speed up the software delivery pipeline using the continuous integration, continuous delivery, and continuous deployment methodology

**Jenkins Architecture** : is a Build Orchestration Tool - Master/Slave Architecture

**Continous Development** : Improve the productivity of Developers

**Build** : It is a process of compiling the source code and create artifacts(Binaries - *.war / *.jar /*.exec / *.dll

Unit Testing by developers

**Promote to higher environment for further Testing**

Notify the testing result team through email

**DevOps Tools** ::: GIT, Jenkins, Build tools Maven,Gradle, JUnit/TestNG, Ansible, and Docker

**Load Balancing** : Master/Slave Architecture

**Jenkins_Master (VM)** : It is used to create Jenkins Jobs/Project and Schedule to slave Nodes

**Slave_Nodes(VM)**	: Used to perform the actual build and create artifacts.

Example

**Jenkins_Slave1**  (VM)	Java appln. 	-- jdk, git, mavan/gradle

**Jenkins_Slave2**  (VM)    Python appln.	-- git, python

**Developers Perspective** : Developers are just the consumers of Jenkins.

**DevOps Perspective** :

Jenkins Administrators

* Installation of Jenkins
* Plugins Management
* Upgrade
* User Management
* Credential Management 
* Tools Managements
* Slave_Nodes Management 
* Security Management
* Onboard Applications to Jenkins 
* Jenkins Jobs/Project/Pipeline Creation and management 
* Create CI/CD Pipeline for automated build & Deployment
* Troubleshooting
* Backup and Recovery 




**Jenkins Projects**

**Freestyle projects** : Done through manual configurations

**pipeline projects** :

one through automated scripts - groovy

Onboard Applications to Jenkins

Jenkins: Jobs/Project/Pipeline Creation and management
Create CI/CD Pipeline for automated build & Deployment

**Slave Node Configuration**

**Use Cases**

* Automated build and deployments 
* Automate the Testing 
* Automate the Monitoring and Alerts 
* Automate the Backup process 
* Automate the volume management.
* Automate the start and stop of various environments/servers - through scheduling....
* CLI : awscli, azcli

Create  and configure. 

Build Steps

**Variables** : Environment Variables, User-Defined Variables 

Execute and Check the status/console
					
scm checkout - build - create artifacts - deploy&test in qa - deploy&test in uat - deploy to prod 

scm checkout - build - create artifacts - deploy&test in qa - deploy&test in uat - Prod_Approval - deploy to prod

**Pipeline Projects**  Groovy Scripts : Scripted Pipeline, Declarative Pipeline



#### install Debian/Ubuntu

On Debian and Debian-based distributions like Ubuntu you can install Jenkins through apt

```

sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key



--2023-12-07 16:34:54--  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
Resolving pkg.jenkins.io (pkg.jenkins.io)... 199.232.46.133, 2a04:4e42:48::645
Connecting to pkg.jenkins.io (pkg.jenkins.io)|199.232.46.133|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 3175 (3.1K) [application/pgp-keys]
Saving to: ‘/usr/share/keyrings/jenkins-keyring.asc’

/usr/share/keyrings/jenkins-keyring.asc    100%[========================================================================================>]   3.10K  --.-KB/s    in 0s

2023-12-07 16:34:54 (35.6 MB/s) - ‘/usr/share/keyrings/jenkins-keyring.asc’ saved [3175/3175]

```

```
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

```



```
sudo apt-get update
sudo apt-get install jenkins
```

#### Remove Jenkins Completely From Debian/Ubuntu

**Stop the Jenkins Service**

```
sudo systemctl stop jenkins
```

Remove Jenkins Packages

```
sudo apt-get purge jenkins
```

Remove Jenkins Repository

```
sudo rm /etc/apt/sources.list.d/jenkins.list
```

Clean Up Additional Directories

```
sudo rm -rf /var/lib/jenkins/
sudo rm -rf /var/cache/jenkins
```

Update the Package Database

```
sudo apt-get update
```
