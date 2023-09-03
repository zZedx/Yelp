const express = require('express')
const router = express.Router({mergeParams:true})
// const Campground = require('../models/campground')
// const Review = require('../models/reviews')
// const ExpressError = require('../utils/ExpressError')
const CatchAsync = require('../utils/CatchAsync')
const {isLoggedIn , validateReview} = require('../utils/Middleware')
const Review = require('../controllers/review')

router.post('/', isLoggedIn,validateReview, CatchAsync(Review.makeNewReview))

router.delete('/:reviewId/delete', isLoggedIn,CatchAsync(Review.delete))

// router.put('/campgrounds/:id/reviews/:reviewId/edit', CatchAsync(async (req, res) => {
//     const { id, reviewId } = req.params
//     const camp = await Campground.findById(id)
//     const review = await Review.findById(reviewId)
//     console.log(camp, review)
//     res.send('o')
// }))

module.exports = router