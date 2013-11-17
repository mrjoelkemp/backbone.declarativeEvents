;(function (global) {
  'use strict';

  var Backbone = global.Backbone,
      _ = global._;

  if (! _) {
    _ = typeof require !== 'undefined' && require('underscore');
    if (! _) throw new Error('Can\'t find underscore');
  }

  if (! Backbone) {
    Backbone = typeof require !== 'undefined' && require('backbone');
    if (! Backbone) throw new Error('Can\'t find Backbone');
  }

  global.Backbone.declarative = function (target) {
    if (! target) throw new Error('target not defined');

    var
        // Declarative events are on to the prototype
        keys = _.keys(Object.getPrototypeOf(target)),
        // Ignore the standard backbone event object
        decEvents = keys.join(' ').match(/\w+[e|E]vents/g);

    // Look for the objects with declared events on the target
    _.each(decEvents, function (attrib) {
      var objName = attrib.replace(/[e|E]vents/, ''),
          obj     = target[objName],
          events  = target[attrib];

      if (! obj) throw new Error(objName + ' not found');

      // Set up listening
      _.each(events, function (callbackName, eventName) {
        var method = target[callbackName];

        if (! method) throw new Error(callbackName + ' function not found');

        target.listenTo(obj, eventName, method);
      });
    });
  };

})(this);