if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express')
const router = express.Router()
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})
const CatchAsync = require('../utils/CatchAsync')
const { isLoggedIn , validateCampground , isOwner} = require('../utils/Middleware')
const campground = require('../controllers/campground')


router.get('/', CatchAsync(campground.index))

router.get('/new', isLoggedIn, campground.renderNewForm)

router.get('/:id', CatchAsync(campground.showCampground))
    
router.post('/', upload.array('campground[image]'),validateCampground, isLoggedIn,CatchAsync(campground.makeNewCampground))
    
router.delete('/:id/delete',isLoggedIn,isOwner,campground.delete)

router.get('/:id/edit', isLoggedIn, isOwner,CatchAsync(campground.renderEditForm))

router.put('/:id', isLoggedIn, isOwner, upload.array('campground[image]'),validateCampground, CatchAsync(campground.edit))

module.exports = router
