const Article = require('mongoose').model('Article');
const User = require('mongoose').model('User');

module.exports = {
    index: (req, res) => {
        res.render('index');
    },
    indexForum: (req, res) => {
        Article.find({}).limit(6).populate('author').then(articles => {
            res.render('forum/index', {articles: articles});
        })
    },

    highscores: (req, res) => {
        User.find({}).limit(10).then(users => {
            let usersWithHighScore = users.filter(u => {return u.highScore != 0});
            usersWithHighScore.sort(function (a,b) {return b.highScore - a.highScore});
            res.render('highscores', {users: usersWithHighScore});
        })
    }
};