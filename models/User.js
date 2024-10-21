const mongoose = require('mongoose');

// Define the User Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: (v) => {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    profile_pic: {
        type: String,
        default: "avatar.jpg" // Fixed typo in the default value
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
