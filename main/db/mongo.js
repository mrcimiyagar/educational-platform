
const mongoose = require('mongoose');
const {ObjectId} = require("bson");

let setup = (callback) => {
/*    mongoose.connect('mongodb://aseman:3x2fG1b65sg4hN68sr4yj8j6k5Bstul4yi56l453tsK5346u5s4R648j@localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log(`we're connected!`);
        module.exports.mongodb = db;
        const OptionSchema = new mongoose.Schema({
            caption: String
        });
        const QuestionSchema = new mongoose.Schema({
            text: String,
            options: [OptionSchema]
        });
        const SurveySchema = new mongoose.Schema({
            title: String,
            details: String,
            creatorId: Number,
            labelId: Number,
            categoryId: Number,
            questions: [QuestionSchema]
        });
        let survey = mongoose.model('Survey', SurveySchema);
        const QuestAnswerSchema = new mongoose.Schema({
            text: String,
            questionId: Number,
            answerId: Number
        });
        const AnswerSchema = new mongoose.Schema({
            responder: Number,
            answers: [QuestAnswerSchema]
        });
        let answer = mongoose.model('Answer', AnswerSchema);
        const RealAnswerSchema = new mongoose.Schema({
            responder: Number,
            answers: [QuestAnswerSchema]
        });
        let realAnswer = mongoose.model('RealAnswer', RealAnswerSchema);
        console.log('created mongo models');
        callback(survey, answer, realAnswer);
    });*/
callback();
};

module.exports.setup = setup;
