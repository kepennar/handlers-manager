var HandlersManager = require('./src/HandlersManager');

var globalHandlersManager = new HandlersManager('global');
module.exports = {
  create: function(name) {
    return new HandlersManager(name);
  },
  global: globalHandlersManager
};
