Backbone.DeclarativeEvents
===

Allows you to listen to events on Models, Collections, sub views, and the Backbone (pub/sub) object in a declarative way – cleaning up the
`this.listenTo` mess that typically results in Backbone views.

This is a rewrite and extension of the awesome [Codecademy/Backbone.Declarative](https://github.com/Codecademy/backbone.declarative) 
plugin by Amjad Masad. 

* The main reason for the rewrite is that the original plugin only allowed for bindings on models and 
collections – exclusively for views. 
* This plugin allows you to set up declarative bindings for any object of a view/model/collection that
supports backbone events – even the global Backbone object.

### Usage

The non-declarative way:

```javascript
ExampleView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);

    this.listenTo(this.collection, 'add', this.onAdd);
    this.listenTo(this.collection, 'remove', this.onRemove);

    // Example subview
    this.fooView = new FooView();

    this.listenTo(this.fooView, 'bar', this.onBar);
    this.listenTo(this.fooView, 'car', this.onCar);

    // Pub/sub binding
    this.listenTo(Backbone, 'event1', this.onEvent1);
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

  BackboneEvents: {
    'event1': 'onEvent1'
  },

  initialize: function() {
    this.fooView = new FooView();
  },
  ...
```

#### What about namespaced event names?

For large, pub/sub apps, you might have a namespace/enumeration of events
strings like the following:

```javascript
window.MyEvents = {
  EVENT1: 'event1',
  EVENT2: 'event2'
};
```

However, you can't use a variable in an object literal definition. To set up this binding declaratively, 
you should set up the `BackboneEvents` attribute to be a function that returns your event -> function name mappings.
For example:

```javascript
ExampleView = Backbone.View.extend({
  BackboneEvents: function () {
    var events = {};

    events[MyEvents.EVENT1] = 'onEvent1';
    events[MyEvents.EVENT2] = 'onEvent2';

    return events;
  }
  ...

```

### License

MIT