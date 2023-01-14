import express from 'express';
import { generateRegularTemplate } from '../services/renderService';

export async function getRegularTemplate(req: express.Request, res: express.Response) {
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
}
