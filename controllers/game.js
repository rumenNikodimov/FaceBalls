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
        res.redirect('/game');

        let score = parseFloat(req.body.score);
        User.findById(req.user.id).then(user => {
            if(score > user.highScore) {
                user.highScore = score;
                user.dateAchieved = Date.now();
                user.save();
            }
        });
        res.redirect('/game');
    }
};