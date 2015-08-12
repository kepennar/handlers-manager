# handlers-manager
[![Build Status](https://travis-ci.org/kepennar/handlers-manager.svg?branch=master)](https://travis-ci.org/kepennar/handlers-manager)
[![Code Climate](https://codeclimate.com/github/kepennar/handlers-manager/badges/gpa.svg)](https://codeclimate.com/github/kepennar/handlers-manager)
[![Test Coverage](https://codeclimate.com/github/kepennar/handlers-manager/badges/coverage.svg)](https://codeclimate.com/github/kepennar/handlers-manager/coverage)


[![NPM](https://nodei.co/npm/handlers-manager.png)](https://nodei.co/npm/handlers-manager/)
[![NPM](https://nodei.co/npm-dl/handlers-manager.png)](https://nodei.co/npm/handlers-manager/)


## Install

```
$ npm install -S handlers-manager
```

## Examples

Retrieving all handlers for a specific topic
```js
var handlersManager = HandlersManager.create('example');
handlersManager.addHandlers('test:event1', function(data) {
  console.log('In the handler', data);
});

// ...

handlersManager.getHandlers('test:event1')
.forEach(function(handler) {
    handler(data)
});

// > 'In the handler {data}'
```

Execute any handlers defined below a topic node 
```js
var handlersManager = HandlersManager.create('example');
handlersManager.addHandlers('test:event1', function(data) {
  console.log('In the handler 1', data);
});
handlersManager.addHandlers('test:event', function(data) {
  console.log('In the handler 2', data);
});

// ...

handlersManager.handle('test', data);

// > 'In the handler 1 {data}'
// > 'In the handler 2 {data}'
```
