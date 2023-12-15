## Install Kubernetes(K8s) and Docker on Ubuntu 20.04

**Kubernetes** is an open-source platform for managing containers such as Docker

* Kubernetes, you can freely make use of the hybrid, on-premise, and public cloud infrastructure to run deployment tasks of your project.
* Docker lets you create containers for a pre-configured image and application
* Kubernetes provides the next step, allowing you to balance loads between containers and run multiple containers across multiple systems.


**Install Kubernetes on Ubuntu 20.04**

**Prerequisites**
* 2 or more Linux servers running Ubuntu 20.04
* root privileges
* 3.75 GB or more of Ram - for better performance, use 6 GB
* 2 CPUs or more
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node.
* Certain ports are open on your machines.
* Swap disabled. You MUST disable swap for the kubelet to work properly.

1. Update Ubuntu

```
sudo apt update
sudo apt upgrade
```

2. Install Docker, Kubernetes requires an existing Docker installation.


```
sudo apt install docker.io
docker –v
```

3. Start and Enable Docker, Should start the server

```
sudo systemctl enable docker
sudo systemctl start docker
sudo systemctl status docker
```

## Install Kubernetes

As we are downloading Kubernetes from a non-standard repository, it is essential to ensure that the software is authentic. This is done by adding a subscription key.

Enter the following to add a signing key in you on Ubuntu:

#### Download Kubernetes

**kubectl**

The Kubernetes command-line tool, kubectl, allows you to run commands against Kubernetes clusters.

kubectl is installable on a variety of Linux platforms, macOS and Windows. Here only we look ubuntu system.


#### Install and Set Up kubectl on Linux
<span style="color:grey">
Created on : Dec, 2023
</span>


Install kubectl binary with curl on Linux



```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

```

Note:
To download a specific version, replace the $(curl -L -s https://dl.k8s.io/release/stable.txt) portion of the command with the specific version.

For example, to download version 1.29.0 on Linux x86-64, type:
x86-64

```
curl -LO https://dl.k8s.io/release/v1.29.0/bin/linux/amd64/kubectl
```


```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
```

Validate the binary (optional)

Download the kubectl checksum file:
Validate the kubectl binary against the checksum file:

```
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
```
output should be **kubectl: OK**

Install kubectl

```
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
chmod +x kubectl
```
Test to ensure the version you installed is up-to-date:
Or use this for detailed view of version:

```
kubectl version --client
kubectl version --client --output=yaml
```

#### Install using native package management

Update the apt package index and install packages needed to use the Kubernetes apt repository:

```
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl

```

Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:



```
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
```
Download the public signing key for the Kubernetes package repositories. The same signing key is used for all repositories so you can disregard the version in the URL:



```

```



```

```




```

```




## Uninstall Minikube on Ubuntu
Minikube is a popular tool that allows developers to run Kubernetes clusters locally on their machines.

It’s an excellent way to get started with Kubernetes without the need for a full-scale cluster.

1. Stop the Minikube Cluster

```
minikube stop
```
2. Delete the Minikube Cluster

```
minikube delete
```
3. Uninstall Minikube Binary

```
sudo rm -rf /usr/local/bin/minikube
```
4. Remove Minikube Configuration and Files

```
rm -rf ~/.minikube
```

5. Uninstall Kubectl (Optional)

```
sudo rm -rf /usr/local/bin/kubectl
```


```

```



```

```