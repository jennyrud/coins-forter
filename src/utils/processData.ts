import { CoinData, CoinPrecentgae } from "../types/types";

/**
 * 
 * @param coinsData Calculating the precentage 
 * @returns sorted array with CoinPrecentgae[]
 */
export const calcPrecentage = (coinsData: CoinData[]): CoinPrecentgae[] => {
    let precentages = coinsData.map(cd => {
        let diff: number = cd.curr - cd.prev;
        let precentage: number = Math.floor((diff / cd.curr) * 100);
        return {
            coinKey: cd.coinKey, precentage
        };
    });

    precentages.sort((p1, p2) => p2.precentage - p1.precentage);

    let result = precentages.map(cd => ({ [cd.coinKey]: `${cd.precentage}%` }));
    return result;
}