(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  global: globalHandlersManager
};

},{"./src/HandlersManager":3}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
var _ = require('lodash');

module.exports = function HandlersManager(name) {
  var TOPIC_SEPARATOR = ':';

  function getAndSetIfNot(key, container) {
    var node = container[key];
    if (!node) {
      node = {};
      container[key] = node;
    }
    var retrievedHandlers = node.handlers;
    if (!retrievedHandlers) {
      retrievedHandlers = [];
      container[key].handlers = retrievedHandlers;
    }
    return node;
  }

  function getNode(topicKey, container) {
    var keys = topicKey.split(TOPIC_SEPARATOR);
    var node = container;
    keys.forEach(function(key) {
      node = getAndSetIfNot(key, node);
    });
    return node;
  }

  function getFirstNode(topicKey, container) {
    var keys = topicKey.split(TOPIC_SEPARATOR);
  }

  function flattenHandlers(container) {
    var actualHandlers = container.handlers;
    _.forIn(container, function(value) {
      if (_.isPlainObject(value)) {
        actualHandlers = _.union(actualHandlers, flattenHandlers(value));
      }
    });
    return actualHandlers;
  }

  return {
    name: name ? name : 'noName',
    handlers: {},

    handle: function(event, data) {
      this.getHandlers(event)
      .forEach(function(handler) {
        handler(event, data);
      });
    },
    handleChilds: function(event, data) {
      this.getHandlersDeep(event)
      .forEach(function(handler) {
        handler(event, data);
      });
    },
    handleFirst: function(event, data) {
      var node = getFirstNode(event, this.handlers);

      flattenHandlers(node)
      .forEach(function(handler) {
        handler(event, data);
      });
    },
    getHandlers: function(topicKey) {
      return getNode(topicKey, this.handlers).handlers;
    },
    getHandlersDeep: function(topicKey) {
      var node = getNode(topicKey, this.handlers);
      return flattenHandlers(node);
    },
    addHandlers: function(topicKey, newHandlers) {
      var actualHandlers = this.getHandlers(topicKey);
      if (newHandlers instanceof Array) {
        actualHandlers = _.union(actualHandlers, newHandlers);
      } else {
        actualHandlers.push(newHandlers);
      }
      getNode(topicKey, this.handlers).handlers = actualHandlers;
    }
  };
};


},{"lodash":2}],4:[function(require,module,exports){
var HandlersManager = require('../');
window.HandlersManager = HandlersManager;

},{"../":1}]},{},[4]);
