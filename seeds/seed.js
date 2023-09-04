const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedhelper')

mongoose.connect('mongodb://127.0.0.1:27017/YelpCamp',)
    .then(() => {
        console.log('Mongoose Running')
    })
    .catch((e) => {
        console.log(e);
    })

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const randomdes = Math.floor(Math.random() * descriptors.length)
        const randompPlaces = Math.floor(Math.random() * places.length)
        const price = Math.floor(Math.random() * 100)
        const camp = new Campground({
            title: `${descriptors[randomdes]} ${places[randompPlaces]}`,
            location: `${cities[random1000].city} , ${cities[random1000].state}`,
            image: {path:'https://source.unsplash.com/collection/483251',filename:''},
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias magni, pariatur eligendi delectus facere iusto culpa nemo porro excepturi odit quam, alias dolor earum voluptatem ex sint! Libero, quas vero',
            price: price,
            geometry:{
                type:'Point',
                coordinates:[cities[random1000].longitude, cities[random1000].latitude]
            },
            owner:'64f1a6f32046944814841272'
        })
        await camp.save()
    }
}
seedDB().then(() => {
    mongoose.connection.close()
})