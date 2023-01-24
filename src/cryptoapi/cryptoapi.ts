import axios, { AxiosResponse } from 'axios';
import { CoinData, CoinResponse } from '../types/types';
import { calcPrecentage } from '../utils/processData';

export const CRYPTO_COMPARE_URL = "https://min-api.cryptocompare.com/data";
//TODO This should be part of an enviroment variable
export const API_KEY = "703a3ac0829e3c1443c0b741473a522bbb331ab9aa47b41aaacf87db0bf60d56";

export const MULTIPLE_PRICE_CURR = "pricemulti";
export const DAY_PAIR_HISTORICAL = "pricehistorical";
export const COMPARE_CURRENCY = "USD"

/**
 * Using CryptoCompare to get all coins comapred to USD for current date
 * @param coins 
 * @returns 
 */
const getCurrentPriceAll = (coins: string[]) => {
    return axios.get(`${CRYPTO_COMPARE_URL}/${MULTIPLE_PRICE_CURR}?fsyms=${coins}&tsyms=${COMPARE_CURRENCY}&api_key=${API_KEY}`)
}

/**
 * Using CryptoCompare to get one coin comapred to USD for a spesific ts (unix
 * timestamp in seconds)
 * @param coin 
 * @param date 
 * @returns 
 */
const getHistoryCryptoOne = (coin: string, date: number) => {
    return axios.get(`${CRYPTO_COMPARE_URL}/${DAY_PAIR_HISTORICAL}?fsym=${coin}&tsyms=${COMPARE_CURRENCY}&ts=${date}&api_key=${API_KEY}`)
}

/**
 * Getting all responses and building unified array 
 * @param responses 
 * @returns CoinData[] 
 */
const parseResponse = (responses: [AxiosResponse<any, any>, ...AxiosResponse<any, any>[]]): CoinData[] => {
    let data: CoinData[] = [];
    //First promise is resolved with all coins data for current date and it is
    //mandatory for all other to be able to calculate precentage
    if (responses[0].status === 200) {
        let currData: CoinResponse = responses[0].data;
        //parse all other responses where each promise response is a prev date
        //coin data
        for (let i = 1; i < responses.length; i++) {
            const response = responses[i];
            if (response.status === 200) {
                let prevCoin: CoinResponse = response.data;
                let keys = Object.keys(prevCoin);
                let coinKey = keys.length > 0 ? keys[0] : "";
                if (currData[coinKey]) {
                    data.push({
                        coinKey,
                        curr: currData[coinKey][COMPARE_CURRENCY],
                        prev: prevCoin[coinKey][COMPARE_CURRENCY],

                    })
                }
            } // TODO some other status code error handling
        }
    } // TODO some other status code error handling
    return data;
}

/**
 * CryptoApi return Coins data from external CryptoCompare API 
 * @param coins 
 * @param date 
 * @returns 
 */
const CryptoApi = async (coins: string[], date: Date): Promise<CoinData[]> => {
    let ts = Math.floor(date.getTime() / 1000);
    // In real scenerio most likely there will be caching to test if we have
    // data saved for spesific date
    let historyPromises: Promise<AxiosResponse<any, any>>[] = coins.map(coin => getHistoryCryptoOne(coin, ts));
    let data: CoinData[] = [];
    try {
        const responses = await Promise.all([getCurrentPriceAll(coins), ...historyPromises]);
        data = parseResponse(responses);
    } catch (e) {
        console.error("Crypto API failed", e);
    }
    return data;
}

export default CryptoApi;

