const DetoxInternalsFacade = require('./src/realms/DetoxInternalsFacade');

const facade = require('./index');

module.exports = new DetoxInternalsFacade(facade);
