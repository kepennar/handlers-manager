# handlers-manager

## Examples

```js
var handlersManager = HandlersManager.create('example');
this.handlersManager.addHandlers('test:event1', function(data) {
  console.log('In the handler', data);
});

...

handlersManager.getHandlers('test:event1')
.forEach(function(handler) {
    handler(data)
});

```


```js
var handlersManager = HandlersManager.create('example');
this.handlersManager.addHandlers('test:event1', function(data) {
  console.log('In the handler 1', data);
});
this.handlersManager.addHandlers('test:event', function(data) {
  console.log('In the handler 2', data);
});

...

handlersManager.handle('test');
.forEach(function(handler) {
    handler(data)
});

```