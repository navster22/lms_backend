const mongoose = require('mongoose')

const mongoConnection = (dbURI) => {
    mongoose.connect(dbURI)
    .then((res) => {
        console.log('Connected to DB')
    })
    .catch(err => console.log(err))
}

module.exports = mongoConnection