'use strict';
var expect = require('chai').expect;
var sinon = require('sinon');

var HandlersManager = require('../');

describe('HandlersManager', function() {

  var testHandler1;
  var testHandler2;
  var testHandler3;

  var handlersManager;

  beforeEach(function() {
    handlersManager = HandlersManager.create('test');
    testHandler1 = sinon.spy();
    testHandler2 = sinon.spy();
    testHandler3 = sinon.spy();
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
      handlersManager.addHandlers('oof:bar:kicks', testHandler3);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo');

      expect(retrievedHandlers).to.have.length(2);
      expect(retrievedHandlers).to.contain(testHandler1, testHandler2);
    });

    it('should return the last childs', function() {

      handlersManager.addHandlers('foo:', testHandler1);
      handlersManager.addHandlers('foo:', testHandler2);
      handlersManager.addHandlers('foo:bar:kicks', testHandler3);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo:bar:kicks');

      expect(retrievedHandlers, 'retrieved handlers').to.have.length(1);
      expect(retrievedHandlers, 'retrieved handlers').to.contain(testHandler3);
    });
  });

  describe('handle', function() {

    it('should execute handlers', function() {

      handlersManager.addHandlers('foo', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);
      handlersManager.addHandlers('another:event', testHandler3);

      handlersManager.handle('foo');

      expect(testHandler1.calledOnce, 'handler1').to.be.true;
      expect(testHandler2.calledOnce, 'handler2').to.not.be.true;
      expect(testHandler3.calledOnce, 'handler3').to.not.be.true;
    });
  });
  describe('handleChilds', function() {

    it('should execute all childs handlers', function() {

      handlersManager.addHandlers('foo', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);
      handlersManager.addHandlers('another:event', testHandler3);

      var handlers = handlersManager.getHandlersDeep('foo');
      handlersManager.handleChilds('foo');

      expect(testHandler1.calledOnce, 'handler1').to.be.true;
      expect(testHandler2.calledOnce, 'handler2').to.be.true;
      expect(testHandler3.calledOnce, 'handler3').to.not.be.true;
    });
  });

});
