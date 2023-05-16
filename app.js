const express = require('express');
const path = require('path');
const mongoose= require('mongoose');
const Player = require('./models/players');
const Question = require('./models/questions');
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
  qWrongAnswers: {
      type:Array,
      required: true,
  },
  qPoints: {
      type: Number,
      required: true,
  },
}, {timestamps: true});

// const connection1 = mongoose.createConnection(dbURI1, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   bufferCommands: false, // Disable command buffering for this connection
// });

// connection1.on('connected', () => {
//   console.log('Connected to db #1');
// });

// connection1.on('error', (err) => {
//   console.log('Error connecting to db #1:', err);
// });

// const connection2 = mongoose.createConnection(dbURI2, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   bufferCommands: false, // Disable command buffering for this connection
// });

// connection2.on('connected', () => {
//   console.log('Connected to db #2');
// });

// connection2.on('error', (err) => {
//   console.log('Error connecting to db #2:', err);
// });

// const PlayerModel1 = connection1.model('Player', playerSchema);
// const QuestionModel2 = connection2.model('Question', questionSchema);


// // const M1 = connection1.model('Player', playerSchema);
// // const M2 = connection2.model('Question', questionSchema);

// app.use(express.static('public'));
// app.use(express.json());

// app.set('view engine', 'ejs');

// app.get('/leaderboard', (req, res) => {
//   Player.find().maxTimeMS(20000).then((result) => {
//       res.render('leaderboard', { players: result });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.sendStatus(500); // Send an error status code
//     });
// });

// app.post('/leaderboard', (req, res) => {
//   const { pName, pScore, pTime, pAttempt, pW2L } = req.body;

//   const p2 = new Player({
//     pName,
//     pScore,
//     pTime,
//     pAttempt,
//     pW2L,
//   });

//   p2.save()
//     .then((result) => {
//       console.log("Player saved:", result);
//       res.sendStatus(200); // Send a success status code
//     })
//     .catch((err) => {
//       console.log("Error saving player:", err);
//       res.sendStatus(500); // Send an error status code
//     });
// });

// app.get('/quest', (req, res) => {
//   // Fetch data from MongoDB and render the question template
//   console.log("Test");
//   Question.find()
//     .then((result) => {
//       res.render('quiz', { questions: result });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });

async function startServer() {
  try {
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

    app.get('/leaderboard', async (req, res) => {
      try {
        const players = await PlayerModel.find().maxTimeMS(20000);
        res.render('leaderboard', { players });
      } catch (err) {
        console.log(err);
        res.sendStatus(500); // Send an error status code
      }
    });

    app.post('/leaderboard', async (req, res) => {
      const { pName, pScore, pTime, pAttempt, pW2L } = req.body;

      const player = new PlayerModel({
        pName,
        pScore,
        pTime,
        pAttempt,
        pW2L,
      });

      try {
        const savedPlayer = await player.save();
        console.log("Player saved:", savedPlayer);
        res.sendStatus(200); // Send a success status code
      } catch (err) {
        console.log("Error saving player:", err);
        res.sendStatus(500); // Send an error status code
      }
    });

    app.get('/quest', async (req, res) => {
      try {
        const questions = await QuestionModel.find();
        res.render('questions', { questions });
      } catch (err) {
        console.log(err);
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