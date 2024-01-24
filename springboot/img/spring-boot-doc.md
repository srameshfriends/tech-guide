### Spring Boot

Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run"

**Features**

* Create stand-alone Spring applications
* Embed Tomcat, Jetty or Undertow directly (no need to deploy WAR files)
* Provide opinionated 'starter' dependencies to simplify your build configuration
* Automatically configure Spring and 3rd party libraries whenever possible
* Provide production-ready features such as metrics, health checks, and externalized configuration
* Absolutely no code generation and no requirement for XML configuration


#### Spring Boot Dependency Management

Spring Boot manages dependencies and configuration automatically. Each release of Spring Boot provides a list of dependencies that it supports. The list of dependencies is available as a part of the Bills of Materials (spring-boot-dependencies) that can be used with Maven. So, we need not to specify the version of the dependencies in our configuration. Spring Boot manages itself. Spring Boot upgrades all dependencies automatically in a consistent way when we update the Spring Boot version.

```
<parent>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-parent</artifactId>  
    <version>3.2.0</version>   
    <relativePath/>   
</parent>  

```

##### Graceful Shutdown in Spring Boot: Ensuring Smooth Application Termination

In the world of modern application development, ensuring a smooth and reliable shutdown process is crucial.

Graceful shutdown refers to the process of terminating an application in a controlled manner, allowing it to complete any ongoing tasks, release resources, and ensure data integrity.

**Enabling Graceful Shutdown in Spring Boot**

By default, the server will shut down immediately

Just need to add one line to your application.properties file:

```
server.shutdown=graceful
```

With this setting, when you stop the server, it won’t accept new requests, ensuring a smooth shutdown process.

control this grace period using the spring.lifecycle.timeout-per-shutdown-phase property. For example:

```
server.shutdown=graceful
```

With this setting, when you stop the server, it won’t accept new requests, ensuring a smooth shutdown process.
However, during graceful shutdown, the server can wait for a specified time for ongoing requests to complete their work.


control this grace period using the spring.lifecycle.timeout-per-shutdown-phase property. For example:


```
spring.lifecycle.timeout-per-shutdown-phase=2m
```

### 1. Spring Boot Actuator Shutdown Endpoint

pom.xml

```
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```


### 2. Update Application Properties

application.properties

```
# Properties to enable graceful shutdown and to configure grace period
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=2m

# Properties to enable and expose actuator shutdown endpoint
management.endpoint.shutdown.enabled=true
management.endpoints.web.exposure.include=info,health,shutdown
```

### 3. Run and Test

The http request method should be **POST**

```
 http://localhost:8080/actuator/shutdown
```

After the request, your application will start the graceful shutdown process. It will stop accepting new requests, but it will give ongoing requests a grace period to finish their work before the application shuts down completely.

