const mongoose = require('mongoose')
const Review = require('./reviews')
const User = require('./user')
const Schema = mongoose.Schema
const {cloudinary} = require('../cloudinary/index')


const CampgroundSchema = new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:[{
        path:String,
        name:String,
    }],
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    owner:
    {type:Schema.Types.ObjectId,
        ref:'User'
    }
})

CampgroundSchema.post('findOneAndDelete' , async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
        // console.log(doc)
        for(let img of doc.image){
            try{
                await cloudinary.uploader.destroy(img.name)
            }catch(e){
                console.log(e)
            }
        }
    }
})

const Campground = mongoose.model('Camp' ,CampgroundSchema)

module.exports = Campground