import express, { Request, Response } from 'express'
import { celebrate, Joi, Segments, errors } from 'celebrate';
import getCoinsData from './cryptoapi/coinsData';
import { calcPrecentage } from './utils/processData';
import { CoinData, TypedRequestQuery } from './types/types';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get("/api/coins/compare",
    celebrate({
        [Segments.QUERY]: {
            symbols: Joi.array().items(Joi.string()).required(),
            date: Joi.date().required()
        }
    }),
    async (request: TypedRequestQuery<{ symbols: string[], date: string }>, response: Response) => {
        let symbols: string[] = request.query.symbols;
        let date: Date = request.query.date as unknown as Date; //we know it's a date after Joi validation

        try {
            const coinsData: CoinData[] = await getCoinsData(symbols, date);
            let result = calcPrecentage(coinsData);
            response.json(result);
        } catch (e) {
            console.error("Error getting coins data and calculating precentage", e);
            response.status(500).json({ message: 'Failed getting coins compare data, contact Jenny!' });
        }

    });

app.use(errors());

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})