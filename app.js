const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const User = require('./models/user');
const app = express();
const db = require('./models/DB/connect');
require('dotenv').config();
require('./config/passport')(passport);

var indexRoutes = require('./routes/index');
//var userRoutes=require('./routes/user');
var commentRoutes=require('./routes/comment');
var postRoutes = require('./routes/post');

const port = process.env.PORT || 5000;

const viewsPath = path.join(__dirname, "./templates/views");
const cssPath = path.join(__dirname, './public');

app.set('view engine', 'ejs');
app.set('views', viewsPath);

db();
/*mongoose.connect("mongodb://localhost:27017/bloggg", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("connecting..."))
	.catch((err) => console.log(err));*/

app.use(express.static(cssPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
	secret: "itssecret",
	resave: true,
	saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


app.use('/', indexRoutes);
app.use('/', postRoutes);
app.use('/',commentRoutes);


app.listen(port, () => { console.log("listening...") });