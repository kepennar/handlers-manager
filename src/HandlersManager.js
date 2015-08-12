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

