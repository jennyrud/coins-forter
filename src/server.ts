import express from 'express'
import { celebrate, Joi, Segments, errors } from 'celebrate';
import CryptoApi from './cryptoapi/cryptoapi';
import { calcPrecentage } from './utils/processData';
import { CoinData } from './types/types';

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get("/api/coins/compare",
    celebrate({
        [Segments.QUERY]: {
            list: Joi.array().items(Joi.string()).required(),
            date: Joi.date().required()
        }
    }),
    async (request, response) => {
        let list: string[] = request.query.list as string[];
        let date: Date = request.query.date as unknown as Date;

        const coinsData: CoinData[] = await CryptoApi(list, date);
        let result = calcPrecentage(coinsData);
        response.json(result);
    });

app.use(errors());

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})