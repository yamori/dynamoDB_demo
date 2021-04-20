# NodejS + DynamoDB + Promises

A demo app demonstrating the three in a stack.

http://localhost:3000/

http://localhost:3000/simple_promise

http://localhost:3000/manufacturer?name_str=Fuji

http://localhost:3000/manufacturers_best_bike?name_str=Fuji

http://localhost:3000/manufacturer_and_bike?name_str=Fuji&bike_str=Roubaix3.0

http://localhost:3000/manufacturers?names_str=Fuji,Specialized&bikes_str=Roubaix3.0,StumpjumperM2

## Requirements

-npm, NodeJS
-valid AWS (SDK) credz for DynamoDB `get` and `batchGet`
-two tables in DynamoDB (table names are hard-coded, sorry)

## Tables

```
 {
  "Responses": {
    "d_bike_model": [
      {
        "model_name": "StumpjumperM2",
        "years": [
          1993,
          1994,
          1995,
          1996,
          1997,
          1998,
          2000
        ]
      },
      {
        "model_name": "Roubaix3.0",
        "years": [
          2010,
          2012
        ]
      }
    ],
    "d_bike_manufacturer": [
      {
        "name": "Fuji",
        "best_bike": "Roubaix3.0"
      },
      {
        "name": "Specialized",
        "best_bike": "StumpjumperM2"
      }
    ]
  },
  "UnprocessedKeys": {}
}
```