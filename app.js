require('dotenv').config();
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const errorController = require('./controllers/error');

const db = require('./utils/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const frontRoutes = require('./routes/front');
const joinRoutes = require('./routes/join');
const authRoutes = require('./routes/auth');
const zoomSyncRoutes = require('./routes/zoomSync');


const sessionStore = new MySQLStore({},db);

if(process.env.NODE_ENV == 'development'){
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
    }));
}else{
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
        secure:true
    }));
}

app.use(function(req,res,next){
    if(process.env.NODE_ENV != 'development' && !req.secure){
        return res.redirect("https://" + request.headers.host + request.url);
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(frontRoutes);
app.use('/',joinRoutes);
app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/admin',adminRoutes);
app.use('/zoom-sync',zoomSyncRoutes);


app.use(errorController.get404);


app.listen(3000);






