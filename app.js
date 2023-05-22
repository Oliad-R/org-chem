const express = require('express');
const path = require('path');
const mongoose= require('mongoose');
const Player = require('./models/players');
const Question = require('./models/questions');
const ejs = require('ejs');
const app = express();

app.use(express.static(path.join(__dirname)));

const dbURI1 = "mongodb+srv://runol_OR:2006password@cluster0.c991gce.mongodb.net/leaderboard?retryWrites=true&w=majority"

const dbURI2 = "mongodb+srv://runol_OR:2006password@cluster0.c991gce.mongodb.net/quiz?retryWrites=true&w=majority"

const playerSchema = new mongoose.Schema({
  pName: {
    type: String,
    required: true,
  },
  pScore: {
    type: Number,
    required: true,
  },
  pTime: {
    type: mongoose.Decimal128,
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
}, { timestamps: true });

const questionSchema = new mongoose.Schema({
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

// Update your startServer function as follows
async function startServer() {
  try {
    // Connect to the first database
    const connection1 = await mongoose.createConnection(dbURI1, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false // Disable command buffering for this connection
          });
      console.log('Connected to db #1');
      
      const PlayerModel = connection1.model('Player', playerSchema);
      
      const connection2 = await mongoose.createConnection(dbURI2, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false // Disable command buffering for this connection
      });
      console.log('Connected to db #2');
      
    const QuestionModel = connection2.model('Question', questionSchema);
    app.use(express.static('public'));

    app.use(express.json());
    
    app.set('view engine', 'ejs');
    
    app.set('views', path.join(__dirname, 'views')); // Set the views directory
    app.get('/battle-start', async (req, res) => {
      try {
        const questions = await QuestionModel.find();
        var i = Math.floor(Math.random() * questions.length);
        res.render('battleStart', { questions, randInt: i});
      } catch (err) {
        console.log(err);
        res.sendStatus(500);
      }
    });

    app.get('/leaderboard', async (req, res) => {
      try {
        const players = await PlayerModel.find().sort({pScore: -1}).maxTimeMS(20000); // Retrieve players from the database
        res.render('leaderboard', { players, showLeaderboard: true });
      } catch (err) {
        console.log(err);
        res.sendStatus(500); // Send an error status code
      }
    });
    
    app.post('/leaderboard', async (req, res) => {
      const { pName, pScore, pTime, pAttempt, pW2L } = req.body;
    
      try {
        const player = new PlayerModel({
          pName,
          pScore,
          pTime,
          pAttempt,
          pW2L,
        });
    
        const savedPlayer = await player.save();
        console.log("Player saved:", savedPlayer);
    
        // Trigger the leaderboard refresh
        const players = await PlayerModel.find().sort({pScore: -1}).maxTimeMS(20000);
        res.json({ players });
      } catch (err) {
        console.log("Error saving player:", err);
        res.sendStatus(500); // Send an error status code
      }
    });
    // Start the server
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
}

startServer();