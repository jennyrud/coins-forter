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