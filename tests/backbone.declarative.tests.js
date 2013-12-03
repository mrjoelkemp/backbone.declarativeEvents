/*global describe: true, it: true, expect: true, beforeEach: true, afterEach: true */
/*jslint sloppy: true*/
describe('Backbone Declarative', function() {

  describe('My tests', function () {
    var model, collection, view, view2, SomeView, SomeView2, Events;

    Events = {
      EVENT1: 'event1'
    };

    beforeEach(function () {
      model = new Backbone.Model({
        foo: ''
      });

      collection = new Backbone.Collection({
        model: Backbone.Model
      });

      collection.add(model);

      SomeView = Backbone.View.extend({
        model: model,
        collection: collection,

        modelEvents: {
          'change:foo': 'onFooChange'
        },

        collectionEvents: {
          'add': 'onAdd'
        },

        subViewEvents: {
          'boo': 'onBoo'
        },

        BackboneEvents: {
          'event1': 'onEvent1'
        },

        initialize: function () {
          this.subView = new Backbone.View();
        },

        onFooChange: function () {
          this.fooChanged = true;
        },

        onBoo: function () {
          this.booTriggered = true;
        },

        onAdd: function (model) {
          if (! $.isEmptyObject(model)) {
            this.modelAdded = true;
          }
        },

        onEvent1: function () {
          this.event1Triggered = true;
        }
      });


      // Used for testing pub/sub namespaced events
      SomeView2 = Backbone.View.extend({
        BackboneEvents: function () {
          var events = {};

          events[Events.EVENT1] = 'onEvent1';

          return events;
        },

        initialize: function () {
        },

        onEvent1: function () {
          this.event1Triggered = true;
        }
      });

      view = new SomeView();
      view2 = new SomeView2();
    });

    // Reset indicators
    afterEach(function () {
      view.fooChanged = undefined;
      view.event1Triggered = undefined;
      view.booTriggered = undefined;

      view2.event1Triggered = undefined;
    });

    it ('listens to events on models', function () {
      model.set('foo', 'yoyo');
      expect(view.fooChanged).toBeTruthy();
    });

    it ('listens to events on collections', function () {
      collection.add(new Backbone.Model());
      expect(view.modelAdded).toBeTruthy();
    });

    it ('listens to events on subviews', function () {
      view.subView.trigger('boo');
      expect(view.booTriggered).toBeTruthy();
    });

    it ('listens to pub/sub events on the Backbone object', function () {
      Backbone.trigger('event1');
      expect(view.event1Triggered).toBeTruthy();
      expect(view2.event1Triggered).toBeTruthy();
    });

  });

  describe('Amjad\'s tests', function() {
    var model, collection, view, ThrowerView;

    beforeEach(function () {
      model = new Backbone.Model({
        foo: ''
      });

      collection = new Backbone.Collection({
        model: Backbone.Model
      });

      collection.add(model);

      view = new Backbone.View({
        model: model,
        collection: collection
      });

      ThrowerView = Backbone.View.extend({
        collectionEvents: {
          'change:foo': 'onFooChange'
        },
        modelEvents: {
          'change:foo': 'onFooChange'
        },
        initialize: function () {
        }
      });
    });

    it('throws if the objects to listenTo are not found', function() {
      expect(function () {
        new ThrowerView();
      }).toThrow();

      expect(function () {
        new ThrowerView({
          model: model
        });
      }).toThrow();
    });

    it('throws if a listenTo callback is not found on the target', function() {
      expect(function () {
        new ThrowerView({
          model: model,
          collection: collection
        });
      }).toThrow();
    });

    it('automatically listens to objects via declarative binding', function() {
      var count = 0,
          SomeView = Backbone.View.extend({
            collectionEvents: {
              'change:foo': 'onFooChange'
            },
            modelEvents: {
              'change:foo': 'onFooChange'
            },
            onFooChange: function () {
              count++;
            },
            initialize: function () {
            }
          });

      new SomeView({
        model: model,
        collection: collection
      });

      model.set('foo', 'bar');
      expect(count).toBe(2);
    });
  });

});