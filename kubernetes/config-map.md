### Create and Use ConfigMap with Kubernetes

ConfigMaps are a useful Kubernetes feature that allows you to maintain light portable images by separating the configuration settings.

ConfigMaps are APIs that store configuration data in key-value pairs. Their primary function is to keep the configuration separate from the container image. It can represent the entire configuration file or individual properties.

If you are working with Kubernetes, you want to keep your image light and portable. To do this, you should keep the configuration settings separate from the application code. Using ConfigMaps you can add different configuration data on pods to suit the environment they are running in.

#### Prerequisites

* Access to a user account with sudo or root privileges
* Access to command-line/terminal window (Ctrl–Alt–T)
* Kubernetes platform installed


#####  Create a ConfigMap

create ConfigMaps from files, directories, and literal values.

```
kubectl create configmap [configmap_name] [attribute] [source]
```

Depending on the source, the attribute will be:

--from file (if the source is a file/directory)
--from-literal (if the source is a key-value pair)

#### Create ConfigMap Using a YAML File

```
kubectl create configmap [configmap_name] --from-file [path/to/yaml/file]
kubectl create example-configmap --from-file /api/v1/namespace/default/configmaps/example-configmap.yaml
```

#### Create ConfigMap From Files
To create a ConfigMap from a file, use the command:

```
kubectl create configmap [configmap_name] --from-file [path/to/file]
kubectl create configmap hello-world --from-file /home/ramesh/file2 --from-file /home/ramesh/file2 --from-file /home/ramesh/file2
```


#### Create ConfigMap From Directories


```
kubectl create configmap hello-world --from-file /home/ramesh
```

#### Create ConfigMap From Literal Values

create ConfigMaps from literal values, using the --from-literal option.
To do so, follow the basic syntax:

```
kubectl create configmap [configmap_name] --from-literal [key1]=[value1] --from-literal [key2]=[value]2
```
See Key-Value Pairs in ConfigMap

```
kubectl get configmaps [configmap_name] -o yaml
```

The output should display information in the yaml format:   


```
apiVersion: v1
data:
  key1: value1
  key2: value2
  ...
kind: ConfigMap
metadata:
  creationTimeStamp: ...
  name: example-configmap
  namespace: default
  resourceVersion: ...
  selfLink: /api/v1/namespace/default/configmaps/example-configmap
  uid: ...
```


#### Configure Pod to Use ConfigMap

There are two ways you can configure a pod to use a specific ConfigMap:

1. Mounting the ConfigMap as a volume
2. Using environment variables

**Note**: You must create the ConfigMap before referencing it to the wanted pod.

#### Mounting ConfigMap as a Volume

Once you have downloaded or created a ConfigMap, you can mount the configuration to the pod by using volumes.

Add a volume section to the yaml file of your pod:

```
volumes:
  - name: config
  configMap
    name: [configmap_name]
    items:
    - key: [key/file_name]
    path: [inside_the_pod]
```

Once you have added the required content, use the kubectl create command to create the pod with the ConfigMap as the volume.


#### Use ConfigMap with EnvFrom

ConfigMaps allows you to introduce multiple values through environment variables.

Add the env section to the yaml file of the pod to pull the specified environment variable(s) from a ConfigMap:

```
env:
        - name: SPECIAL_LEVEL_KEY
          valueFrom:
            configMapKeyRef:
              name: [configmap_name]
              key: [key/file_name]
```

To pull all environment variables from a ConfigMap, add the envFrom section to the yaml file:

```
envFrom:
  - configMapKeyRef
      name: env-config
```

Then, use the kubectl create command to create the pod with the specified configuration settings.