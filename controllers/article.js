const Article = require('mongoose').model('Article');

module.exports = {
    createGet: (req, res) => {
        res.render('forum/article/create');
    },
    createPost: (req, res) => {
        let articleArgs = req.body;

        let errorMsg = '';

        if (!req.isAuthenticated())
            errorMsg = 'You should be logged in to create articles!';
        else if (!articleArgs.title)
            errorMsg = 'Invalid title!';
        else if (!articleArgs.content)
            errorMsg = 'Invalid content!';

        if (errorMsg) {
            res.render('forum/article/create', {error: errorMsg});
        }

        let image = req.files.image;
        if (image) {
            let filenameAndExtension = image.name;
            let filename=filenameAndExtension.substring(0,filenameAndExtension.lastIndexOf('.'));
            let extension=filenameAndExtension.substring(filenameAndExtension.lastIndexOf('.')+1);

            let randomChars= require('./../utilities/encryption').generateSalt().substring(0,5).replace(/\//g,'x');
            let finalFilename=`${filename}_${randomChars}.${extension}`;
            image.mv(`./public/images/articleImages/${finalFilename}`, err => {
                if(err){
                    console.log(err.message);
                }

            });
            articleArgs.imagePath=`./public/images/articleImages/${finalFilename}`;
        }

        articleArgs.author = req.user.id;

        Article.create(articleArgs).then(article => {
            article.prepareInsert();
            res.redirect('/forum');
        });
    },

    editGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            req.session.returnUrl = `forum//article/edit/${id}`;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/forum');
                    return;
                }

                res.render('forum/article/edit', article);
            });
        });
    },

    editPost: (req, res) => {
        let id = req.params.id;

        let articleArgs = req.body;

        let errorMsg = '';

        if (!articleArgs.title)
            errorMsg = 'Article title cannot be empty!';
        else if (!articleArgs.content)
            errorMsg = 'Article content cannot be empty!';

        if (errorMsg)
            res.render('forum/article/edit', {error: errorMsg});
        else {
            Article.update({_id: id}, {
                $set: {
                    title: articleArgs.title,
                    content: articleArgs.content
                }
            }).then(updateStatus => {
                res.redirect(`/forum/article/details/${id}`);
            });
        }
    },

    deleteGet: (req, res) => {
        let id = req.params.id;

        if (!req.isAuthenticated()) {
            req.session.returnUrl = `/forum/article/delete/${id}`;

            res.redirect('/user/login');
            return;
        }

        Article.findById(id).then(article => {
            req.user.isInRole('Admin').then(isAdmin => {
                if (!isAdmin && !req.user.isAuthor(article)) {
                    res.redirect('/forum');
                    return;
                }

                res.render('forum/article/delete', article);
            });
        });
    },

    deletePost: (req, res) => {
        let id = req.params.id;

        Article.findOneAndRemove({_id: id}).populate('author').then(article => {
            article.prepareDelete();
            res.redirect('/forum');
        });
    },

    details: (req, res) => {
        let id = req.params.id;

        Article.findById(id).populate('author').then(article => {
            if (!req.user) {
                res.render('forum/article/details', {article: article, isUserAuthorized: false});
                return;
            }

            req.user.isInRole('Admin').then(isAdmin => {
                let isUserAuthorized = isAdmin || req.user.isAuthor(article);

                res.render('forum/article/details', {article: article, isUserAuthorized: isUserAuthorized});
            });
        });
    }
};