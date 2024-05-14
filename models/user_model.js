const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url)
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message)
    });

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    id_credencial: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
