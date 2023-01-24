import { calcPrecentage } from '../../src/utils/processData';

describe('Calculate precentage Testing', () => {
    test('Calculate precentage empty coins data', () => {
        let coinsData = [];
        let results = calcPrecentage(coinsData);
        expect(results.length).toBe(0);
    })

    test('Calculate precentage coins data for two coins', () => {
        let coinsData = [{ coinKey: "BTC", curr: 23000, prev: 47128 }, { coinKey: "ETH", curr: 13000, prev: 22000 }];
        let results = calcPrecentage(coinsData);
        expect(results[0]).toEqual({ "ETH": "-70%" });
        expect(results[1]).toEqual({ "BTC": "-105%" });
    })
});

