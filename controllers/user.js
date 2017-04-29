const User = require('mongoose').model('User');
const encryption = require('./../utilities/encryption');
const Role = require('mongoose').model('Role');

module.exports = {
    registerGet: (req, res) => {
        res.render('user/register');
    },

    registerPost: (req, res) => {
        let registerArgs = req.body;

        User.findOne({email: registerArgs.email}).then(user => {
            let errorMsg = '';
            if(user) {
                errorMsg = 'An user with the same username already exists!';
            }
            else if (registerArgs.password !== registerArgs.repeatedPassword){
                errorMsg = 'Passwords do not match!';
            }

            if(errorMsg) {
                registerArgs.error = errorMsg;
                res.render('user/register', registerArgs);
            }
            else {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword(registerArgs.password, salt);

                let userObject = {
                    email: registerArgs.email,
                    passwordHash: passwordHash,
                    fullName: registerArgs.fullName,
                    salt: salt
                };

                let roles = [];
                Role.findOne({name: 'User'}).then(role => {
                    roles.push(role.id);

                    userObject.roles = roles;
                    User.create(userObject).then(user => {
                        user.prepareInsert();
                        req.logIn(user, (err) => {
                            if(err) {
                                registerArgs.error = err.message;
                                res.render('user/register', registerArgs);
                                return;
                            }

                            res.redirect('/');
                        })
                    });
                });
            }
        });
    },

    loginGet: (req, res) => {
        res.render('user/login');
    },

    loginPost: (req, res) => {
        let loginArgs = req.body;

        User.findOne({email: loginArgs.email}).then(user => {
            if(!user || !user.authenticate(loginArgs.password)) {
                loginArgs.error = 'Invalid username/password!';
                res.render('user/login', loginArgs);
                return;
            }
            req.logIn(user, (err) => {
                if(err){
                    res.redirect('/user/login', {error: err.message});
                    return;
                }

                let returnUrl = '/';
                if(req.session.returnUrl){
                    returnUrl = req.session.returnUrl;
                    delete req.session.returnUrl;
                }

                res.redirect(returnUrl);
            });
        });
    },

    logout: (req, res) => {
        req.logOut();
        res.redirect('/');
    },

    profileGet: (req, res) => {

        let id = req.user.id;

        if(id === undefined) {
            res.redirect('/');
        }

        User.findById(id).then(user => {
            res.render('user/profile', user);
        });
    },

    profilePost: (req, res) => {
        let userid = req.user.id;
        let image = req.files.image;

        if (image) {
            let filenameAndExt = image.name;
            let filename = filenameAndExt.substring(0, filenameAndExt.lastIndexOf('.'));
            let ext = filenameAndExt.substring(filenameAndExt.lastIndexOf('.'));
            let randomPart = encryption.generateSalt().substring(0, 5).replace(/\//g, 'x');
            let randomFileName = filename + randomPart + ext;
            image.mv(`../public/images/userPics/${randomFileName}`, err => {
                if (err) {
                    console.log(err.message);
                }
            });

            User.findById(userid).then(u => {
                u.imagePath = `/images/userPics/${randomFileName}`;
                u.save();
                res.render('user/profile', u);
            });


        }


    }
};