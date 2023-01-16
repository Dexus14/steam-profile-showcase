import express from 'express';
import { generateRegularTemplate } from '../services/renderService';

export async function getRegularTemplate(req: express.Request, res: express.Response) {
    const steamid = req.query.steamid;
    if (!steamid || typeof steamid !== 'string') {
        return res.send('No steamid provided').status(500);
    }

    try {
        const image = await generateRegularTemplate(steamid);
        res.contentType('image/png').setHeader('Cache-Control', 'max-age=300').send(image);
    } catch (e) {
        console.error(e);
        res.send('Error occurred').status(500);
    }
}
