const adminController = require('./../controllers/admin/admin');
const userController = require('./../controllers/user');
const articleController = require('./../controllers/article');
const homeController = require('./../controllers/forum');
const gameController = require('./../controllers/game');

module.exports = (app) => {
    app.get('/', homeController.index);
    app.get('/forum', homeController.indexForum);

    app.get('/highscores', homeController.highscores);

    app.get('/user/register', userController.registerGet);
    app.post('/user/register', userController.registerPost);

    app.get('/user/login', userController.loginGet);
    app.post('/user/login', userController.loginPost);

    app.get('/user/logout', userController.logout);

    app.get('/user/profile', userController.profileGet);

    app.get('/forum/article/create', articleController.createGet);
    app.post('/forum/article/create', articleController.createPost);+

    app.get('/forum/article/edit/:id', articleController.editGet);
    app.post('/forum/article/edit/:id', articleController.editPost);

    app.get('/forum/article/delete/:id', articleController.deleteGet);
    app.post('/forum/article/delete/:id', articleController.deletePost);
    app.get('/forum/article/details/:id', articleController.details);

    app.get('/game', gameController.gameGet);
    app.post('/game', gameController.gamePost);

    app.use((req, res, next) => {
        if(req.isAuthenticated()){
            req.user.isInRole('Admin').then(isAdmin => {
                if(isAdmin)
                    next();
                else
                    res.redirect('/');
            })
        }
        else
            res.redirect('/user/login');
    });

    app.get('/admin/user/all', adminController.user.all);
    app.get('/admin/user/edit/:id', adminController.user.editGet);
    app.post('/admin/user/edit/:id', adminController.user.editPost);
    app.get('/admin/user/delete/:id', adminController.user.deleteGet);
    app.post('/admin/user/delete/:id', adminController.user.deletePost);
};