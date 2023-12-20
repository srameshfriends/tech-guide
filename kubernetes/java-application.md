### Deploying Java Application

Deploying Java Application using Docker and Kubernetes- DevOps Project



Deploy a Java Application using Docker and Kubernetes.

The workflow of the project is going to be like this in the below image

![Cache Topology](img/java-app-workflow.avif)


##### Prerequisites

1. Docker
2. Git
3. Kubernetes 
4. Maven 

Start the minikube cluster to up the k8s cluster

```
minkube start
```

Information of the cluster

```                         
kubectl cluster-info
```

To confirm maven version to our system.                                                   

```
maven --version
```

Kubernetes setup is working by running a command like kubectl get nodes, which lists all connected Kubelets.

```
kubectl get nodes
```

Pods are simply the smallest unit of execution in Kubernetes, consisting of one or more containers, each with one or more application and its binaries. Nodes are the physical servers or VMs that comprise a Kubernetes Cluster.


```
kubectl get pods
```