### SQL

Create runners table

```
CREATE TABLE runners (
    ID int NOT NULL,
    name varchar(255), 
    PRIMARY KEY (ID)
); 

CREATE TABLE races (
    ID int NOT NULL,
    event varchar(255),
    winner_id int, 
    FOREIGN KEY (winner_id) REFERENCES runners(ID)
); 
```

```
INSERT INTO runners (id, name) values (5, 'Lisa Romero');
INSERT INTO races (id, event, winner_id) values (1, '100 meter dash', 2);
```

