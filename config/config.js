const path = require('path');

module.exports = {
    development: {
        rootFolder: path.normalize(path.join(__dirname, '/../')),
        connectionString: 'mongodb://127.0.0.1:27017/SpaceBalls'
    },
    production: {}
};