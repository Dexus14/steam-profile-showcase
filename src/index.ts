import express from 'express'
import bodyParser from "body-parser";
import {generateRegularTemplate} from "./services/renderService";
require('dotenv').config()

const app = express()

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/templates/regular', async (req, res) => {
    const steamid = req.query.steamid
    if (!steamid || typeof steamid !== "string") {
        return res.send('No steamid provided').status(500)
    }

    try {
        const image = await generateRegularTemplate(steamid)
        res.contentType('image/png')
            .setHeader("Content-Disposition", "inline; filename=signature.png")
            .send(image)
    } catch(e) {
        console.error(e)
        res.send('Error occurred').status(500)
    }
})

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send('Not found');
});
