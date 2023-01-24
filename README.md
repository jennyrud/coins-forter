# Forter Coins Compare Assignment 

## API End point and deployment
API endpoint can be accessed from here:
https://coins-compare.onrender.com/api/coins/compare?list[]=BTC&list[]=ETH&list[]=BNB&list[]=DOGE&date=03/28/2022

GET /api/coins/compare
with two query params: list, date
list of coins as an array, for examples: list[]=BTC&list[]=ETH
date with the following format: mm/dd/yyyy

response example:
```json
[
    {
        "BNB": "-29%"
    },
    {
        "DOGE": "-41%"
    },
    {
        "ETH": "-83%"
    },
    {
        "BTC": "-86%"
    }
]
```

The server is deployed using Render.

## Implementation Details
Implemented NodeJs server with express, used celebrate with Joi for query params
quick validation. It can be extended to support different date formats (just
takes time)

CryptoApi return Coins data from external CryptoCompare API. I used two
different end points, to be able to do the calculations I'm using USD as the
currency for comparison. 
 - One end point to gets all coins current date compared to USD 
 - Another end point gets historical date for one specific coin compared to USD

 Using Promise.all to get all the results asynchronously. Once I get all the
 results, data is aggregate acording to the coin and current and previous price.

After that, calculating all the precentages and sorting based on best performing
one and resturing a JSON result. 


## Tests
I added some basic tests and more can be done there...
- Unit testing for precentage calculation 
- testing CryptoAPI results using Nock to mock all HTTP calls to CryptoCompare.