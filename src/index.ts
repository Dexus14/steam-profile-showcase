import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import templateRoutes from './routes/templateRoutes';
config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/templates', templateRoutes);

app.get('/health', (req, res) => res.sendStatus(200));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send('Not found');
});
