import { Query } from 'express-serve-static-core';
export interface TypedRequestQuery<T extends Query> extends Express.Request {
    query: T
}

export type CoinResponse = {
    [fCoinKey: string]: {
        [tCoinKey: string]: number
    }
}

export type CoinData = {
    coinKey: string,
    curr: number
    prev: number
}

export type CoinPrecentgae = {
    [coinKey: string]: string,
}