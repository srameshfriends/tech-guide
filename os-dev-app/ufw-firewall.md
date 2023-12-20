### Firewall with UFW on Ubuntu 22.04

UFW, or Uncomplicated Firewall, is a simplified firewall management interface that hides the complexity of lower-level packet filtering technologies such as iptables and nftables. If you’re looking to get started securing the network.

##### Prerequisites

One Ubuntu 22.04 server with a sudo non-root user access rights.

UFW is installed by default on Ubuntu. If it has been uninstalled for some reason, you can install it.


```
sudo apt install ufw
```

This is for IPv4 only, but will work for IPv6 as well as long as you enable it. If your Ubuntu server has IPv6 enabled, ensure that UFW is configured to support IPv6 so that it will manage firewall rules for IPv6 in addition to IPv4. To do this, open the UFW configuration with nano or your favorite editor.
Then make sure the value of IPV6 is yes. It should look like this:
```
sudo nano /etc/default/ufw
```

##### Setting Up Default Policies

UFW is set to deny all incoming connections and allow all outgoing connections. This means anyone trying to reach your server would not be able to connect, while any application within the server would be able to reach the outside world.

To set the defaults used by UFW, use these commands:

**Allowing SSH Connections**


```
sudo ufw allow ssh

sudo ufw allow 22
```

You will receive a warning that says the command may disrupt existing SSH connections. You already set up a firewall rule that allows SSH connections, so it should be fine to continue. Respond to the prompt with y and hit ENTER.

**Enabling UFW**

```
sudo ufw enable

sudo ufw default deny incoming
sudo ufw default allow outgoing
```

**Allowing Other Connections**

```
sudo ufw allow http
sudo ufw allow https
```
or equivalent command as follows

```
sudo ufw allow 80
sudo ufw allow 443
```

#### Delete a UFW firewall rule

```
sudo ufw status numbered
```

Sample outputs shows list of all my UFW rules and their numbers in first column:


```
Status: active
 
     To                         Action      From
     --                         ------      ----
[ 1] 22/tcp                     ALLOW IN    Anywhere                  
[ 2] 25/tcp                     ALLOW IN    Anywhere                   # accept email
[ 3] 80/tcp                     ALLOW IN    Anywhere                  
[ 4] 443/tcp                    ALLOW IN    Anywhere                  
[ 5] 22/tcp (v6)                ALLOW IN    Anywhere (v6)             
[ 6] 25/tcp (v6)                ALLOW IN    Anywhere (v6)              # accept email
[ 7] 80/tcp (v6)                ALLOW IN    Anywhere (v6)             
[ 8] 443/tcp (v6)               ALLOW IN    Anywhere (v6)
```

Say you need to delete rule number 2 that opens tcp port 25 (email server), run:
for example you want to delete port number 25

```
sudo ufw delete {rule-number-here}
sudo ufw delete 6
```

You can delete those two rules using the following syntax (just prefix orignal rule with delete):

```
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw delete deny 23/tcp
```

**Specific Port Ranges**

To allow X11 connections, which use ports 6000-6007, use these commands:

When specifying port ranges with UFW, you must specify the protocol (tcp or udp) that the rules should apply to. We haven’t mentioned this before because not specifying the protocol automatically allows both protocols

```
sudo ufw allow 6000:6007/tcp
sudo ufw allow 6000:6007/udp
```

if you want to allow connections from a **specific IP address**, such as a work or home IP address of 203.0.113.4, you need to specify from, then the IP address:

```
sudo ufw allow from 203.0.113.4
```

You can also specify a specific port that the IP address is allowed to connect to by adding to any port followed by the port number. For example, If you want to allow 203.0.113.4 to connect to port 22 (SSH), use this command:

```
sudo ufw allow from 203.0.113.4 to any port 22
```
**Subnets**

If you want to allow a subnet of IP addresses, you can do so using CIDR notation to specify a netmask. For example, if you want to allow all of the IP addresses ranging from 203.0.113.1 to 203.0.113.254 you could use this command:

```
sudo ufw allow from 203.0.113.0/24
```


Likewise, you may also specify the destination port that the subnet 203.0.113.0/24 is allowed to connect to. Again, we’ll use port 22 (SSH) as an example:


```
sudo ufw allow from 203.0.113.0/24 to any port 22
```
**Connections to a Specific Network Interface**

If you want to create a firewall rule that only applies to a specific network interface, you can do so by specifying “allow in on” followed by the name of the network interface.

```
ip addr
```

**Output Excerpt**
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state
3: enp0s4: <BROADCAST,MULTICAST> mtu 1500 qdisc noop state DOWN group default


The highlighted output indicates the network interface names. They are typically named something like eth0, ens1 or enp3s2.


```
sudo ufw allow in on ens3 to any port 80
```


Doing so would allow your server to receive HTTP requests from the public internet.

Or, if you want your MySQL database server (port 3306) to listen for connections on the private network interface eth1, for example, you could use this command:


This would allow other servers on your private network to connect to your MySQL database.

```
sudo ufw allow in on eth1 to any port 3306
```


#### Denying Connections

If you haven’t changed the default policy for incoming connections, UFW is configured to deny all incoming connections.

However, sometimes you will want to deny specific connections based on the source IP address or subnet, perhaps because you know that your server is being attacked from there. Also, if you want to change your default incoming policy to allow (which is not recommended), you would need to create deny rules for any services or IP addresses that you don’t want to allow connections for.

To write deny rules, you can use the commands described above, replacing allow with deny.

For example, to deny HTTP connections, you could use this command:


```
sudo ufw deny http
```

if you want to deny all connections from 203.0.113.4 you could use this command:


```
sudo ufw deny from 203.0.113.4
```

#### Deleting Rules

Knowing how to delete firewall rules is just as important as knowing how to create them. There are two different ways to specify which rules to delete: by rule number or by the actual rule (similar to how the rules were specified when they were created). We’ll start with the delete by rule number method because it is easier.


```
sudo ufw status numbered
```

If you decide that you want to delete rule 2, the one that allows port 80 (HTTP) connections, you can specify it in a UFW delete command like this:



```
sudo ufw delete 2
```

This would show a confirmation prompt then delete rule 2, which allows HTTP connections. Note that if you have IPv6 enabled, you would want to delete the corresponding IPv6 rule as well.

**By Actual Rule**

The alternative to rule numbers is to specify the actual rule to delete. For example, if you want to remove the allow http rule, you could write it like this:


```
sudo ufw delete allow http
sudo ufw delete allow 80
```

**Checking UFW Status and Rules**

```
sudo ufw status verbose
```

**Disabling or Resetting UFW (optional)**

```
sudo ufw disable
```

If you already have UFW rules configured but you decide that you want to start over, you can use the reset command:

This will disable UFW and delete any rules that were previously defined. Keep in mind that the default policies won’t change to their original settings, if you modified them at any point. This should give you a fresh start with UFW.


```
 Disabling or Resetting UFW (optional)
```

