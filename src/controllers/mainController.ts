import express from 'express';

export function getIndex(req: express.Request, res: express.Response) {
    res.sendFile('index.html', { root: 'src/public' });
}

export function getHealth(req: express.Request, res: express.Response) {
    res.sendStatus(200);
}
