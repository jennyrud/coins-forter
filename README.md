# Forter Coins Compare Assignment

## API and deployment

API endpoint can be accessed from here:

```
https://coins-compare.onrender.com/api/coins/compare?symbols[]=BTC&symbols[]=ETH&symbols[]=BNB&symbols[]=DOGE&date=03/28/2022
```

```
GET /api/coins/compare
with two query params: symbols, date
```

**symbols** of coins is an **array** quey param, for examples:
symbols[]=BTC&symbols[]=ETH

date with the following format: mm/dd/yyyy

JSON response example:

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

NodeJs server with express and tyepscript.
Used celebrate with Joi for query params quick validation.
It can be extended to support different date formats (not doing it now)

getCoinsData return Coins data from external CryptoCompare API. I used two
different end points, to be able to do the calculations I'm using USD as the
currency for comparison.

- One gets all coins current date compared to USD
- Another gets historical date for one specific coin compared to USD

Using Promise.all to get all the results asynchronously. Once I get all the
results, data is aggregate according to the coin and current and previous price.

After that, calculating all the precentages and sorting based on best performing
one and returning a JSON result.

## Tests

Running tests could be done locally:

> npm run test

- Unit testing for precentage calculation
- testing getCoinsData results using [Nock](https://github.com/nock/nock) to mock
  all HTTP calls to CryptoCompare.
  I added some basic tests and more can be done here... end to end tests that
  tests the API for example.

## Deployment

Render is used to run the web service. package.json includes build step for
building in Render.
package.json scripts are super basics for the puspose of this assignment
