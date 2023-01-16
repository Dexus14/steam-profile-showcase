import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import templateRoutes from './routes/templateRoutes';
import mainRoutes from './routes/mainRoutes';
config();

const app = express();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.use('/api/templates', templateRoutes);
app.use('/', mainRoutes);

app.use(express.static('src/public'));

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res) => {
    res.status(404).send('Not found');
});
