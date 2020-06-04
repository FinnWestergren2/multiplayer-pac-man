module.exports = {
    bar: function() {
        const mapGenerator = require('./mapGenerator.ts');
        return mapGenerator.generateMapUsingRandomDFS();
    }
};