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

    it('should return 1 handler when 1 match with the topic key', function() {

      handlersManager.addHandlers('foo:bar:kicks', testHandler1);
      handlersManager.addHandlers('foo:bar:oops', testHandler2);

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(1);
      expect(handlersManager.getHandlers('foo:bar:kicks')).to.contain(testHandler1);
    });

    it('should return 2 handler when 2 match the topic key', function() {

      var handlers = [testHandler1, testHandler2];
      handlersManager.addHandlers('foo:bar:kicks', handlers);
      handlersManager.addHandlers('foo:bar:oops', testHandler3);

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(2);
      expect(retrievedHandlers).to.contain(testHandler1, testHandler2);
    });

    it('should not return handler when none match the topic key', function() {
      
      handlersManager.addHandlers('foo:bar:oops', testHandler1);

      var retrievedHandlers = handlersManager.getHandlers('foo:bar:kicks');

      expect(retrievedHandlers).to.have.length(0);
    });
  });

  describe('getHandlersDeep', function() {

    it('should return all childs handlers of a topic', function() {

      handlersManager.addHandlers('foo:', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);
      handlersManager.addHandlers('oof:bar:kicks', testHandler3);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo');

      expect(retrievedHandlers).to.have.length(2);
      expect(retrievedHandlers).to.contain(testHandler1, testHandler2);
    });

    it('should return only childs and no parents', function() {

      handlersManager.addHandlers('foo:', testHandler1);
      handlersManager.addHandlers('foo:', testHandler2);
      handlersManager.addHandlers('foo:bar:kicks', testHandler3);

      var retrievedHandlers = handlersManager.getHandlersDeep('foo:bar:kicks');

      expect(retrievedHandlers, 'retrieved handlers').to.have.length(1);
      expect(retrievedHandlers, 'retrieved handlers').to.contain(testHandler3);
    });
  });

  describe('handle', function() {

    it('should execute all handlers matching the topic key', function() {

      handlersManager.addHandlers('foo', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);
      handlersManager.addHandlers('another:event', testHandler3);

      handlersManager.handle('foo');

      expect(testHandler1.calledOnce, 'handler1 called').to.be.true;
      expect(testHandler2.calledOnce, 'handler2 called').to.not.be.true;
      expect(testHandler3.calledOnce, 'handler3 called').to.not.be.true;
    });
  });

  describe('handleChilds', function() {

    it('should execute all childs handlers matching the topic key', function() {

      handlersManager.addHandlers('foo', testHandler1);
      handlersManager.addHandlers('foo:bar:kicks', testHandler2);
      handlersManager.addHandlers('another:event', testHandler3);

      handlersManager.handleChilds('foo');

      expect(testHandler1.calledOnce, 'handler1 called').to.be.true;
      expect(testHandler2.calledOnce, 'handler2 called').to.be.true;
      expect(testHandler3.calledOnce, 'handler3 called').to.not.be.true;
    });
  });

  describe('get', function() {

    it('should return handler manager instance if one have been created with this name', function() {

      var hm = HandlersManager.create();
      var hm1 = HandlersManager.create('hm1');
      var hm2 = HandlersManager.create('hm2');

      expect(HandlersManager.get('hm1')).to.equal(hm1);
      expect(HandlersManager.get('hm2')).to.equal(hm2);
    });
  });

  describe('delete', function() {

    it('should delete an existing handlersManager', function() {

      HandlersManager.create('hm1');
      HandlersManager.delete('hm1');

      expect(HandlersManager.get('hm1')).to.be.undefined;
    });
    
    it('should not call handlers if handlersManager have been deleted', function() {

      var hm1 = HandlersManager.create('hm1');
      hm1.addHandlers('foo', testHandler1);
      HandlersManager.delete('hm1');
      hm1.handle('foo');
      expect(testHandler1.calledOnce, 'handler1 called').to.not.be.true;
    });
  });

});
