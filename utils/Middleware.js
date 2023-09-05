const Campground = require('../models/campground')
const { campgroundSchema ,reviewsSchema } = require('../validator')
const ExpressError = require('../utils/ExpressError')

module.exports.lastpage = (req,res,next)=>{
        const lastUrl = (req.get('referer'))
        req.session.returnTo = lastUrl
        next()
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){

        const lastUrl = (req.get('referer'))
        if(req.method ==='GET'){
            req.session.returnTo = req.originalUrl
        }
        else{
            req.session.returnTo = lastUrl
        }
        req.flash('error', 'Login Required !')
        return res.redirect('/login')
    }
    next()
}
module.exports.storeReturnTo =(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewsSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(message, 400)
    }
    else {
        next()
    }
}

module.exports.isOwner = async (req,res,next)=>{
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp.owner.equals(req.user.id)) {
        req.flash('error', "You don't have permission to do that")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}