const { Decimal128 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    qQuestion: {
        type: String,
        required: true,
    },
    qRightAnswer: {
        type: String,
        required: true
    },
    qAnswers: {
        type:Array,
        required: true,
    },
    qPoints: {
        type: Number,
        required: true,
    },
}, {timestamps: true});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
