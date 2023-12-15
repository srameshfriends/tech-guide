### Create an EC2 instance from AWS Console

* The AWS Console, alternatively called the AWS Management Console, is a GUI to provision and manage resources and deployments on AWS.

* It is a collection of management consoles for the various services that make up the AWS cloud.


1. Select a region
2. Choose the OS
3. Select an instance type
4. Parameters related to the number of instances to launch
5. Configure storage

**Optional**

* Spot Instances, which can be configured to a maximum per-hour cost
* Network (virtual private cloud, subnets, public IP assignment, DNS configuration);
* Permissions (AWS Identity and Access Management roles assigned to the EC2 instance);
* Tenancy (shared, dedicated, host);
* Termination protection;
* Detailed monitoring in one-minute intervals or the five-minute default;
* File systems, where you can attach the instance to an Amazon Elastic File System (EFS) volume;
* Domain directory to join a directory managed by the AWS Directory Service;
* Shutdown behavior (stop or terminate the instance if an OS-level shutdown occurs); and
* User data, where you can add commands executed at launch.

6. Build in security

* Security groups in AWS determine a set of access rules for both incoming and outgoing traffic in the EC2 instance
* The settings include port ranges, IPs or security group IDs assigned to resources trying to access an EC2 instance
* Avoid generic rules that allow open access to a wide range of ports and IP addresses.

7. Enable SSH access with a key

### CONNECT TO AWS EC2 INSTANCE USING MOBAXTERM

**MOBAXTERM**

Download and install MobaXTerm from official MobaXTerm site for Windows 10.

https://mobaxterm.mobatek.net/download-home-edition.html


* Once Installed open the mobaxterm, Go to Sessions Menu , click on New Session as shown below.
* Input your AWS EC2 Instance IP , UserName in Remote Host and Specify UserName field.
* Here I am connecting to Ubuntu Instance (Default user name as ubuntu)
* Click on Advanced SSH Settings tab and give the path of your instance .pem file in field use Private key as shown below
* .pem file automattilcay downloaded whenever create ssh from our AWS console.
* MobaXTerm check the box with **Use Private Key** and choose the .pem file.
* Click OK button Now EC2 instance connected with terminal window.

### Add Inbound Rules

* In the resources, directly visit the Security groups.
* Users can add inbound rules to an existing security group and can also create a new security group and add inbound rules into it. To create a new security group
* To add inbound rules in the security group, scroll down and click on the Add rule option in the Inbound rules area.

































































