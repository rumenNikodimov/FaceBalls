const mongoose = require('mongoose');

let roleSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Role', roleSchema);

const Role = require('mongoose').model('Role');

module.exports.initialize = () => {
    Role.findOne({name: 'User'}).then(role => {
        if(!role)
            Role.create({name: 'User'});
    });

    Role.findOne({name: 'Admin'}).then(role => {
        if(!role)
            Role.create({name: 'Admin'});
    });
};