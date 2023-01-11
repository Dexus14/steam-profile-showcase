import express from 'express'
import bodyParser from "body-parser";
import {getPlayerSummary} from "./services/steamApiService";
require('dotenv').config()

const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/test', async (req, res) => {
    const steamid = req.query.steamid
    if (!steamid || typeof steamid !== "string") {
        return res.send('No steamid provided').status(500)
    }

    const response = await getPlayerSummary(steamid)

    res.send(response.data)
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send('Not found');
});
