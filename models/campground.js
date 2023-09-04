const mongoose = require('mongoose')
const Review = require('./reviews')
const User = require('./user')
const Schema = mongoose.Schema
const {cloudinary} = require('../cloudinary/index')
const { required } = require('joi')

const options = {toJSON : {virtuals:true}}
const CampgroundSchema = new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
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
},options)

CampgroundSchema.virtual('properties.popupText').get(function(){
    return `<strong><a href="/campgrounds/${this.id}">${this.title}</a></strong>`
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