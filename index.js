const mongoose= require('mongoose');
const Player = require('./models/players');

const dbURI = "mongodb+srv://runol_OR:2006password@cluster0.c991gce.mongodb.net/leaderboard?retryWrites=true&w=majority";

mongoose.connect(dbURI, {useNewURLParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

// const p2 = new Player({
//     pName: "James",
//     pScore: 1,
//     pTime: 100.4,
// });

// p2.save()
//     .then((result) => {
//     })
//     .catch((err) => {
//         console.log(err);
//     });
// ;

Player.find()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
    });

for (i = 0; i <= players.length; i++) {
    var newDiv = document.createElement('div');
    newDiv.innerHTML = players.pName + " "+ players.pScore + " "+players.pTime;
};