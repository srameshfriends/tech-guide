### Springframework Annotations

The major difference between these stereotypes is that they are used for different classifications. When we annotate a class for auto-detection, we should use the respective stereotype.



**@Component** is a generic stereotype for any Spring-managed component.

```
@Indexed
public @interface Component {
}
```

**@Service** annotates classes at the service layer.

```
@Component
public @interface Service {
}
```

**@Repository** annotates classes at the persistence layer, which will act as a database repository.

```
@Component
public @interface Repository {
}
```