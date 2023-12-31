const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary/index')
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN 
const geocoder = mapboxGeocoding({accessToken:mapboxToken})

module.exports.index = async (req, res) => {
    const index = await Campground.find({})
    // console.log(req.query)
    if(req.query.search){
        const index = await Campground.find({title:{$regex : req.query.search , $options:'i'}})
        return res.render('campgrounds/index', {index})
    }
    res.render('campgrounds/index', {index})
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params
    const camp = await Campground.findById(id).populate({path :'reviews',populate:{path:'owner'}}).populate('owner')
    // console.log(camp)
    // console.log(camp)
    if (!camp) {
        req.flash('error', 'Campground Not Found')
        // throw new ExpressError("Camp Not Found", 401)
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', camp)
}

module.exports.makeNewCampground = async (req, res) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data' , 400)
    const newCamp = new Campground(req.body.campground)
    try{
        const locationGeoData = await geocoder.forwardGeocode({
            query: newCamp.location,
            limit: 1
        })
        .send()
        .then(response => {
            const match = response.body.features[0].geometry;
            return match
        });
        newCamp.geometry = locationGeoData
    }catch(e){
        req.flash('error' , "Please Enter A Valid Location")
        return res.redirect('/campgrounds/new')
    }
    
    newCamp.owner = req.user
    const imgarr = []
    for(let file of req.files){
        imgarr.push({path:file.path,name:file.filename})
    }
    newCamp.image = imgarr
    newCamp.save()
    console.log(newCamp)
    req.flash('success', 'SuccessFully Made A New Campground')
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'Campground Deleted')
        return res.redirect('/campgrounds')
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findById(id)
    if (!camp) {
        req.flash('error', 'Campground Not Found')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', camp)
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const input = req.body.campground
    const camp = await Campground.findByIdAndUpdate(id , input)
    if(req.body.deleteImages){
        for(let name of req.body.deleteImages){
            await cloudinary.uploader.destroy(name)
        }
        await camp.updateOne({ $pull: { image:{name:{$in:req.body.deleteImages}}}})
    }
    for(let file of req.files){
        camp.image.push({path:file.path,name:file.filename})
    }
    camp.save()
    req.flash('success', 'Campground Updated')
    res.redirect(`/campgrounds/${id}`)
}