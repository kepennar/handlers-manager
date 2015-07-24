'use strict';

var expect = require('chai').expect;
var HandlersManager = require('../');
describe('Utils', function() {

  function testHandler1() {
    return 'Foo! Bar! Kicks!';
  }
  function testHandler2() {
    return 'Oof! Rab! Skcik!';
  }
  function testHandler3() {
    return '!skciK !raB !ooF';
  }

  var handlersManager;

  beforeEach(function() {
    handlersManager = HandlersManager.create('test');
  });

  describe('getHandlers', function() {

    it('should return 1 handler', function() {

      handlersManager.addHandlers('foo:bar:kicks', testHandler1);

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(1);
      expect(handlersManager.getHandlers('foo:bar:kicks')).to.contain(testHandler1);
    });

    it('should not return handlers', function() {

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(0);
    });

    it('should not return 2 handler', function() {

      var handlers = [testHandler1, testHandler2];
      handlersManager.addHandlers('foo:bar:kicks', handlers);

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(2);
      expect(retrievedHandlers).to.contain(testHandler1, testHandler2);
    });
  });

  describe('getHandlersDeep', function() {

    it('should return all childs handlers', function() {

      handlersManager.addHandlers('foo:', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo');

      expect(retrievedHandlers).to.have.length(2);
      expect(retrievedHandlers).to.contain(testHandler1, testHandler2);
    });

    it('should return the last childs', function() {

      handlersManager.addHandlers('foo:', testHandler1);
      handlersManager.addHandlers('foo:', testHandler2);
      handlersManager.addHandlers('foo:bar:kicks', testHandler3);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(1);
      expect(retrievedHandlers).to.contain(testHandler3);
    });
  });

});
