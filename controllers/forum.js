const Article = require('mongoose').model('Article');

module.exports = {
    index: (req, res) => {
        res.render('index');
    },
    indexForum: (req, res) => {
        Article.find({}).limit(6).populate('author').then(articles => {
            res.render('forum/index', {articles: articles});
        })
    }
};