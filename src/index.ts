import express from 'express';
import bodyParser from 'body-parser';
import { generateRegularTemplate } from './services/renderService';
import { config } from 'dotenv';
config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/templates/regular', async (req, res) => {
    const steamid = req.query.steamid;
    if (!steamid || typeof steamid !== 'string') {
        return res.send('No steamid provided').status(500);
    }

    const start = Date.now();

    try {
        const image = await generateRegularTemplate(steamid);
        console.log('sending image: ', Date.now() - start);
        res.contentType('image/png').send(image);

        console.log('finish: ', Date.now() - start);
    } catch (e) {
        console.error(e);
        res.send('Error occurred').status(500);
    }
});

app.get('/health', (req, res) => res.sendStatus(200));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send('Not found');
});
