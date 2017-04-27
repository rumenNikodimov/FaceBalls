const mongoose = require('mongoose');
const encryption = require('./../utilities/encryption');
const Role = require('mongoose').model('Role');

let userSchema = mongoose.Schema({
        email: {type: String, required: true, unique: true},
        passwordHash: {type: String, require: true},
        fullName: {type: String, required: true},
        articles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
        highScores: [{type: mongoose.Schema.Types.ObjectId, ref: 'HighScore'}],
        roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'Role'}],
        salt: {type: String, required: true}
    });

userSchema.method ({
    authenticate: function(password) {
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        return inputPasswordHash === this.passwordHash;
    },
    isAuthor: function(article){
        if(!article)
            return false;

        return article.author.equals(this.id);
    },
    isInRole: function(roleName){
        return Role.findOne({name: roleName}).then(role => {
            if(!role)
                return false;

            return this.roles.indexOf(role.id) !== -1;
        })
    },
    prepareDelete: function() {
        for(let role of this.roles){
            Role.findById(role).then(role => {
                role.users.remove(this.id);
                role.save();
            })
        }

        let Article = mongoose.model('Article');
        for(let article of this.articles) {
            Article.findById(article).then(article => {
                article.prepareDelete();
                article.remove();
            })
        }

        let HighScore = mongoose.model('HighScore');
        for(let highScore of this.highScores) {
            HighScore.findById(highScore).then(highScore => {
                highScore.prepareDelete();
                highScore.remove();
            })
        }
    },
    prepareInsert: function() {
        for(let role of this.roles){
            Role.findById(role).then(role => {
                role.users.push(this.id);
                role.save();
            });
        }
    }
});

module.exports = mongoose.model('User', userSchema);

const User = require('mongoose').model('User');

module.exports.seedAdmin = () => {
    User.findOne({email: 'admin'}).then(admin => {
        if(!admin){
            Role.findOne({name: 'Admin'}).then(role => {
                let salt = encryption.generateSalt();
                let passwordHash = encryption.hashPassword('admin', salt);

                let roles = [];
                roles.push(role.id);

                let user = {
                    email: 'admin',
                    passwordHash: passwordHash,
                    fullName: 'Admin',
                    articles: [],
                    highScores: [],
                    salt: salt,
                    roles: roles
                };

                User.create(user).then(user => {
                    role.users.push(user.id);
                    role.save(err => {
                        if(err)
                            console.log(err.message);
                        else
                            console.log('Admin seeded successfully!');
                    });
                })
            })
        }
    })
};