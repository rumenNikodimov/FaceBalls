const User = require("mongoose").model("User");

module.exports = {
    gameGet: (req, res) => {
        if(!req.isAuthenticated()) {
            res.redirect('/user/login');
            return;
        }
        res.render('game');
    },

    gamePost: (req, res) => {
        if(!req.isAuthenticated()) {
            res.redirect('/user/login');
            return;
        }

        let score = parseFloat(req.body.score);
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
        let hours = d.getHours();
        let min = d.getMinutes();
        let date = day + "/" + month + "/" + year + " " + hours + ":" + min;

        User.findById(req.user.id).then(user => {
            if(score > user.highScore) {
                user.highScore = score;
                user.dateAchieved = date;
                user.save();
            }
        });
        res.redirect('/game');
    }
};