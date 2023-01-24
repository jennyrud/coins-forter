import axios, { AxiosResponse } from 'axios';
import { CoinData, CoinResponse } from '../types/types';

export const CRYPTO_COMPARE_URL = 'https://min-api.cryptocompare.com/data';
export const API_KEY = process.env.CRYPTO_API_KEY;

export const MULTIPLE_PRICE_CURR = 'pricemulti';
export const DAY_PAIR_HISTORICAL = 'pricehistorical';
export const COMPARE_CURRENCY = 'USD';

const getCurrentPriceAll = (coins: string[]) => {
    return axios.get(`${CRYPTO_COMPARE_URL}/${MULTIPLE_PRICE_CURR}?fsyms=${coins}&tsyms=${COMPARE_CURRENCY}&api_key=${API_KEY}`);
}

const getHistoryCryptoOne = (coin: string, date: number) => {
    return axios.get(`${CRYPTO_COMPARE_URL}/${DAY_PAIR_HISTORICAL}?fsym=${coin}&tsyms=${COMPARE_CURRENCY}&ts=${date}&api_key=${API_KEY}`);
}

const parseResponse = (currentCoinsResponse: AxiosResponse<any, any>, historyCoinsresponses: [...AxiosResponse<any, any>[]]): CoinData[] => {
    let data: CoinData[] = [];
    //First promise is resolved with all coins data for current date and it is
    //mandatory for all other to be able to calculate precentage
    if (currentCoinsResponse.status === 200) {
        let currData: CoinResponse = currentCoinsResponse.data;
        //parse all other responses where each promise response is a prev date
        //coin data
        for (let i = 0; i < historyCoinsresponses.length; i++) {
            const response = historyCoinsresponses[i];
            if (response.status === 200) {
                let prevCoin: CoinResponse = response.data;
                let keys = Object.keys(prevCoin);
                let coinKey = keys.length > 0 ? keys[0] : "";
                if (currData[coinKey]) {
                    data.push({
                        coinKey,
                        curr: currData[coinKey][COMPARE_CURRENCY],
                        prev: prevCoin[coinKey][COMPARE_CURRENCY],

                    });
                }
            } // TODO some other status code error handling
        }
    } // TODO some other status code error handling
    return data;
}

const getCoinsData = async (coins: string[], date: Date): Promise<CoinData[]> => {
    let ts = Math.floor(date.getTime() / 1000);
    // In real scenerio most likely there will be caching to test if we have
    // data saved for spesific date
    let historyPromises: Promise<AxiosResponse<any, any>>[] = coins.map(coin => getHistoryCryptoOne(coin, ts));
    let data: CoinData[] = [];
    const responses = await Promise.all([getCurrentPriceAll(coins), ...historyPromises]);
    data = parseResponse(responses[0], responses.slice(1, responses.length));
    return data;
}

export default getCoinsData;

