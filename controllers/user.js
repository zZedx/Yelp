const User = require('../models/user')

module.exports.registerForm = (req,res)=>{
    res.render('user/register')
}

module.exports.registerUser = async (req,res ,next)=>{
    try{
        const{username , password , email} = req.body
        const user = new User({username, email })
        const registeredUser  = await User.register(user , password);
        req.login(registeredUser,(err)=>{
            if(err) return next(err)
            req.flash('success' , 'Welcome')
            res.redirect('/campgrounds')
        })
    }catch(e){
        if(e.message.includes('E11000')){
            e.message="This email is already associated with an account."
        }
        req.flash('error' , e.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render('user/login')
}

module.exports.loginUser = async(req,res)=>{
    req.flash('success' , 'Welcome')
    // console.log(res.locals.returnTo)
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl) 
}

module.exports.logoutUser = (req,res)=>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
    });
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    req.flash('success' , 'Logged Out')
    res.redirect(redirectUrl)
}