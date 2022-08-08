require('dotenv').config();

const bodyParser = require('body-parser');
const express = require('express');

const db = require('./utils/database');

const app = express();

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const frontRoutes = require('./routes/front');
const joinRoutes = require('./routes/join');
const authRoutes = require('./routes/auth');
const zoomSyncRoutes = require('./routes/zoomSync');

app.use(bodyParser.json({ type: "application/json" }));

const errorController = require('./controllers/error');


app.use(frontRoutes);
app.use('/',joinRoutes);
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);
app.use('/zoom-sync',zoomSyncRoutes);


app.use(errorController.get404);

app.listen(8080);