
### Java LocalTime format example

```
Map<Long, String> ampmStrings = Map.of(0L, "a", 1L, "p");
    DateTimeFormatter timeFormatter = new DateTimeFormatterBuilder()
            .appendPattern("hh:mm")
            .appendText(ChronoField.AMPM_OF_DAY, ampmStrings)
            .toFormatter();
            
    String sourceLine = "09:40a";
    LocalTime time = LocalTime.parse(sourceLine, timeFormatter);
    System.out.println("Parsed time: " + time);
```