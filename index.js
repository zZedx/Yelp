const express = require('express')
const app = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const flash = require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')
const MongoStore = require('connect-mongo');


const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')
const campgroundRoutes = require('./routes/camground')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')

const dbUrl = process.env.DB_URL
// 'mongodb://127.0.0.1:27017/YelpCamp'
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongoose Running')
    })
    .catch((e) => {
        console.log(e);
    })

const path = require('path')
// const {isLoggedIn} = require('./utils/passportMiddleware')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate)
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
})

const sessionConfig = {
    store,
    name: 'localsession',
    secret: 'this is secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user
    next()
})
app.use('', userRoutes)


app.get('/', (req, res) => {
    res.render('home')
})
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.use('*', (req, res, next) => {
    next(new ExpressError("Page Not Found", 401))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) err.message = "Oh No, Something Went Wrong!"
    res.status(status).render('error', { err })
})

app.listen(3000, () => {
    console.log('Listening')
})
