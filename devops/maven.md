#### Overriding Dependency Versions and Using Version Ranges in Maven


Like most languages, Java only allows a single version of a dependency to be included in a final compiled program. For smaller programs, this is not an issue. But as programs grow larger and larger, they include more and more dependencies, each of which includes its own dependencies. Eventually, picking dependency versions that satisfy the constraints imposed by both the original program and every transitive dependency becomes a tedious and error-prone task. Welcome to dependency hell.


Declaring Dependencies in Maven

Maven projects are defined in their top-level “pom.xml” file. This file describes a project’s name, version, plugins, build steps, and more. This file also includes the project’s dependencies:


```
 <dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0-jre</version>
</dependency>
```


In this example, our project is declaring that it needs guava library, version 31.0-jre, from the group com.google.guava.

During the build process, Maven will search for this artifact in its configured repositories, download it to the local machine, and use it to compile the code. The default repository is Maven Central, although Maven can also use other repositories for alternative distributions or private dependencies.


Maven dependencies are also Maven projects, so they also have their own “pom.xml” file. This is how dependencies declare their own dependencies, which we call the “transitive dependencies” (as opposed to “direct dependencies”) of your program.

You can check all imported libraries running the command mvn dependency:tree. This command will show all project dependencies in a tree format, revealing what other dependencies have been imported to the project.

```
mvn dependency:tree
```

out put 

```
[INFO] org.example:maven_dependecy_desmystified:jar:1.0-SNAPSHOT
[INFO] \- com.google.guava:guava:jar:31.0-jre:compile
[INFO]    +- com.google.guava:failureaccess:jar:1.0.1:compile
[INFO]    +- com.google.guava:listenablefuture:jar:9999.0-empty-to-avoid-conflict-with-guava:compile
[INFO]    +- com.google.code.findbugs:jsr305:jar:3.0.2:compile
[INFO]    +- org.checkerframework:checker-qual:jar:3.12.0:compile
[INFO]    +- com.google.errorprone:error_prone_annotations:jar:2.7.1:compile
[INFO]    \- com.google.j2objc:j2objc-annotations:jar:1.3:compile
```

The above is an example of a Maven dependency tree for a project with a single dependency. Here, a single dependency (guava) included six more. Notice that the application developer did not explicitly declare a dependency on these other six libraries! Instead, this dependency was brought in implicitly and automatically.

You may be wondering: What if two different libraries require different versions? Or, perhaps, what happens if the application and a library require two different versions of the same library? In that case, Maven uses the nearest definition strategy, which means it will choose the version closer to the root of your dependency tree. In other words, if you declare a dependency in your project, Maven will use this version even if another library declares another version.

#### Overriding Solved Dependency Versions

Sometimes, Maven’s automatic version selection picks the wrong version.

For example, you might want to force your program to use an updated version that fixes a known security vulnerability or contains a bug fix. How do you do this if the wrong dependency is a transitive dependency?

By taking advantage of Maven’s nearest definition logic, developers can override the version of a dependency by declaring it on the root pom.xml file. The example below shows an overridden version for checker-qual and how it was managed by Maven.


```
 <dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0-jre</version>
</dependency>
<dependency>
    <groupId>org.checkerframework</groupId>
    <artifactId>checker-qual</artifactId>
    <version>3.21.1</version>
</dependency>
```

out put 

```
[INFO] +- com.google.guava:guava:jar:31.0-jre:compile
[INFO] |  +- com.google.guava:failureaccess:jar:1.0.1:compile
[INFO] |  +- com.google.guava:listenablefuture:jar:9999.0-empty-to-avoid-conflict-with-guava:compile
[INFO] |  +- com.google.code.findbugs:jsr305:jar:3.0.2:compile
[INFO] |  +- com.google.errorprone:error_prone_annotations:jar:2.7.1:compile
[INFO] |  \- com.google.j2objc:j2objc-annotations:jar:1.3:compile
[INFO] \- org.checkerframework:checker-qual:jar:3.21.1:compile

```


The above is an example of overriding dependency versions.

Developers may also need to exclude a transitive dependency in some scenarios. Usually, it does not make sense to remove a library included by one of the application dependencies, but there are at least two cases in which this is a necessity:

  - Java libraries that use classpath scanning to discover which services should be loaded. For example, Spring Framework chooses between different logging frameworks based on what library is loaded on the classpath.
  - Libraries sometimes change their group or artifact id’s to new names. If two different libraries demand the same library with different names, Maven will be unable to understand they are the same dependency. So, the developer must exclude one of them manually to avoid classes with the same full name in the classpath.

The example below shows how to exclude a transitive dependency and how Maven controlled the change.

The example below shows how to exclude a transitive dependency and how Maven controlled the change.


```
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0-jre</version>
    <exclusions>
        <exclusion>
            <groupId>org.checkerframework</groupId>
            <artifactId>checker-qual</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

out put


```
[INFO] org.example:maven_dependecy_desmystified:jar:1.0-SNAPSHOT
[INFO] \- com.google.guava:guava:jar:31.0-jre:compile
[INFO]    +- com.google.guava:failureaccess:jar:1.0.1:compile
[INFO]    +- com.google.guava:listenablefuture:jar:9999.0-empty-to-avoid-conflict-with-guava:compile
[INFO]    +- com.google.code.findbugs:jsr305:jar:3.0.2:compile
[INFO]    +- com.google.errorprone:error_prone_annotations:jar:2.7.1:compile
[INFO]    \- com.google.j2objc:j2objc-annotations:jar:1.3:compile
```
### Using Version Ranges in Maven

Maven also allows you to specify a version range of each dependency. Using ranges, you can guarantee your project is always using the library's most recent version; you can also make it easier for other libraries to use a correct version of another dependency.

To specify version ranges, you can use the symbols [ and ] for inclusive version and ( and ) for exclusive version.

Some examples:

```
<dependency>
    <groupId>org.checkerframework</groupId>
    <artifactId>checker-qual</artifactId>
    <version>[3,4]</version>
</dependency>
```

The above guarantees that the selected version will be anything between version 3 and 4, inclusive.

```
<dependency>
    <groupId>org.checkerframework</groupId>
    <artifactId>checker-qual</artifactId>
    <version>[3,4)</version>
</dependency>
```

In this example, the selected version will be anything between version 3 and 4, excluding version 4.

In case of a library asking the same dependency, but specifying a strict version number, Maven will try to find an intersection between the range and the number. If it does not exist, Maven will use the nearest definition strategy, as before.

















