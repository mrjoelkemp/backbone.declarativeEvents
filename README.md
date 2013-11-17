Backbone.Declarative
===

Allows you to listen to events on Models, Collections, and sub views in a declarative way – cleaning up the
listenTo mess that typically results in Backbone views.

*Technically, you can listen to events on any object property of a Backbone model, view, and collection –
so long as that sub-object has Backbone.Events mixed in.

This is a rewrite and extension of the awesome [Codecademy/Backbone.Declarative](https://github.com/Codecademy/backbone.declarative) plugin by Amjad Masad. 

### Usage

The non-declarative way:

```javascript
ExampleView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);

    this.listenTo(this.collection, 'add', this.onAdd);
    this.listenTo(this.collection, 'remove', this.onRemove);

    this.fooView = new FooView();

    this.listenTo(this.fooView, 'bar', this.onBar);
    this.listenTo(this.fooView, 'car', this.onCar);
  },
  ...
```

The declarative way: just use the format `*object*Events` where *object* 
could be the name of a model, collection, view, or event-triggerable object.

```javascript
ExampleView = Backbone.View.extend({
  modelEvents: {
    'change': 'render',
    'destroy': 'remove'
  },

  collectionEvents: {
    'add': 'onAdd',
    'remove': 'onRemove'
  },

  fooViewEvents: {
    'bar': 'onBar',
    'car': 'onCar'
  },

  initialize: function() {
    this.fooView = new FooView();

    Backbone.declarative(this);
  },
  ...
```

**Constraints:**

1. You must include the line `Backbone.declarative(this)` in order to mixin the declarative
functionality into your View, Model, or Collection. 
2. The statement must be the last line in your `initialize` method. Once you mixin the declarative
functionality, it automatically sets up the event listening on the sub-objects and will
throw an error if the sub-objects don't exist yet.

---

TODO: 

1. Provide a monkeypatch for Backbone's view, model, and collection constructors to avoid the need for 
explicitly calling `Backbone.declarative(this)`. Although, it's nice to have fine control of when to mix in.

2. Handle pub/sub bindings on the Backbone object with namespaced event names:

We can't do:

```javascript
BackboneEvents = {
  Foo.bar: 'onBar'
}
```

So we may need to do:

```javascript
BackboneEvents = function () {
  var events = {}
  events[Foo.bar] = 'onBar';
  return events;
}
```
