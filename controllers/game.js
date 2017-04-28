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
    }
};