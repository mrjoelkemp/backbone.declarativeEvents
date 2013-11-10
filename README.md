Backbone Declarative
===

Based on [1]: https://github.com/Codecademy/backbone.declarative

More extensible in that you can auto-bind more than model and collection events. Follows the format of objectEvents where object could also be any subview and even Backbone itself (for pub/sub).

Declarative bindings should also be available on Models, Views, and Collections, not just Views.

2 styles of integration
---
1. MonkeyPatch like [1] but that feels dirty. Don't like their closed object that maintains all viewEvents (both for perf and separation of concerns: each object should be responsible for its own declarative bindings)
2. Mixin style: Backbone.Declarative(this);
 - Looks for attributes on this that have the /([a-z]?[A-Z]?[0-9]?)+[Events]/ format and then, split those attributes to find the object name, look for those objects (Backbone isn't on the this) and then carry out the bindings.

---
**Problem** is that subview and model bindings are easy in the existing declarative format since event names are usually hardcoded. However, for pubsub with a global enumeration (non-hardcoded event names), we need to initialize the BackboneEvents subobject with variables and subscript notation:

BackboneEvents = {}
BackboneEvents[YouNow.Events.Foo] = 'onFoo';

This eliminates the possibility of having this definition cleanly attached to the view/model/etc.

**Solution**: Maybe have those events defined by a function that returns an object that's populated with the above syntax?