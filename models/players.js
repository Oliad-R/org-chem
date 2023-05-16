const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    pName: {
        type: String,
        required: true,
    },
    pScore: {
        type: Number,
        required: true
    },
    pTime: {
        type: Decimal128,
        required: true,
    },
    pAttempt: {
        type: Number,
        required: true,
    },
    pW2L: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;
