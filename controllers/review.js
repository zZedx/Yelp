const Campground = require('../models/campground')
const Review = require('../models/reviews')

module.exports.makeNewReview = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review)
    review.owner = req.user
    campground.reviews.unshift(review)
    await review.save()
    await campground.save()
    req.flash('success' , 'Review Added')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.delete = async (req, res) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if(!review.owner.equals(req.user.id)){
        req.flash('error' , 'Only Owner Can delete')
        return res.redirect(`/campgrounds/${id}`)
    }
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Review.findByIdAndDelete(reviewId)
        req.flash('success' , 'Review Deleted')
        res.redirect(`/campgrounds/${id}`)
}