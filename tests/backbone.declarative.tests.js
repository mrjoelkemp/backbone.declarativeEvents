describe('Backbone Declarative', function() {

  describe('My tests', function () {
    var model, collection, view, SomeView;

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

        initialize: function () {
          this.subView = new Backbone.View();

          Backbone.declarativeEvents(this);
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
        }
      });

      view = new SomeView();


    });

    // Reset indicators
    afterEach(function () {
      view.fooChanged = undefined;
      view.booTriggered = undefined;
    });

    it ('automatically listens to events on models', function () {
      model.set('foo', 'yoyo');
      expect(view.fooChanged).toBeTruthy();
    });

    it ('automatically listens to events on collections', function () {
      collection.add(new Backbone.Model());
      expect(view.modelAdded).toBeTruthy();
    });

    it ('automatically listens to events on subviews', function () {
      view.subView.trigger('boo');
      expect(view.booTriggered).toBeTruthy();
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
          Backbone.declarativeEvents(this);
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
        })
      }).toThrow();
    });

    it('automatically listens to objects via declarative binding', function() {
      var count = 0;
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
              Backbone.declarativeEvents(this);
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