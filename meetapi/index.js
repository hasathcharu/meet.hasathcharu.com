require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');


const app = express();
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const zoomSyncRoutes = require('./routes/zoomSync');
const corsOptions  = {
    origin: process.env.CLIENT,
    credentials:true
}
app.use(cors(corsOptions));
app.options('*', cors());
app.use(bodyParser.json({ type: "application/json" }));

const errorController = require('./controllers/error');


app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);
app.use('/zoom-sync',zoomSyncRoutes);


app.use(errorController.get404);

app.listen(process.env.PORT);