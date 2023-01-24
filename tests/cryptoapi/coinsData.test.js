import getCoinsData, { CRYPTO_COMPARE_URL, MULTIPLE_PRICE_CURR, COMPARE_CURRENCY, API_KEY, DAY_PAIR_HISTORICAL } from "../../src/cryptoapi/coinsData";

import nock from "nock";

describe("Crypto API testing ", () => {
    test("Crypto API for one coin", async () => {
        let coinsList = ["BTC", "ETH"];
        let date = new Date('2022-03-17T00:00:00');
        let ts = Math.floor(date.getTime() / 1000);

        nock(CRYPTO_COMPARE_URL)
            .get(`/${MULTIPLE_PRICE_CURR}?fsyms=${coinsList}&tsyms=${COMPARE_CURRENCY}&api_key=${API_KEY}`)
            .reply(200, {
                "BTC": {
                    "USD": 22926.86,
                },
                "ETH": {
                    "USD": 1629.36,
                },
            });

        nock(CRYPTO_COMPARE_URL)
            .get(`/${DAY_PAIR_HISTORICAL}?fsym=BTC&tsyms=${COMPARE_CURRENCY}&ts=${ts}&api_key=${API_KEY}`)
            .reply(200, {
                "BTC": {
                    "USD": 41133.64,
                }
            });

        nock(CRYPTO_COMPARE_URL)
            .get(`/${DAY_PAIR_HISTORICAL}?fsym=ETH&tsyms=${COMPARE_CURRENCY}&ts=${ts}&api_key=${API_KEY}`)
            .reply(200, {
                "ETH": {
                    "USD": 22996.64,
                }
            });

        let data = await getCoinsData(coinsList, date);
        expect(data[0]).toEqual({ coinKey: "BTC", curr: 22926.86, prev: 41133.64 });
        expect(data[1]).toEqual({ coinKey: "ETH", curr: 1629.36, prev: 22996.64 });
    })
});