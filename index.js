var HandlersManager = require('./src/HandlersManager');

var globalHandlersManager = new HandlersManager('global');
var storedHandlersManager = {};
module.exports = {
  create: function(name) {
    var hm = new HandlersManager(name);
    if (hm.name !== 'noName') {
      storedHandlersManager[hm.name] = hm;
    }
    return hm;
  },
  get: function(name) {
    if (!name) {
      throw 'You have to give a name for retrieve an handlersManager';
    }
    return storedHandlersManager[name];
  },
  delete: function(name) {
    if (!name) {
      throw 'You have to give a name for delete an handlersManager';
    }
    storedHandlersManager[name].handlers = {};
    delete storedHandlersManager[name];
  },
  global: globalHandlersManager
};
