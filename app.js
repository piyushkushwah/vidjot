const express = require("express");
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();



//load ideas routes
const ideas = require('./routes/ideas');
//load user routes
const user = require('./routes/user');

//Load Passport Config File
require('./config/passport')(passport);

//Load Database Config File
const db = require('./config/database');
//connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true
})
    .then(() => {
        console.log("MongoDb connected...");
    }).catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


//Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//method-overriding Middleware
app.use(methodOverride('_method'))

//express-session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//index route
app.get('/', (req, res) => {
    const titleName = "WelCome"
    res.render("index", {
        title: titleName
    });
});

//about route
app.get('/about', (req, res) => {
    res.render("about");
    
});

//Use Ideas route 
app.use('/ideas', ideas);

//Use User Route
app.use('/user', user);


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port} xD :P`);
});