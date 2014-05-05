var $__Object = Object, $__getOwnPropertyNames = $__Object.getOwnPropertyNames, $__getOwnPropertyDescriptor = $__Object.getOwnPropertyDescriptor, $__getDescriptors = function(object) {
  var descriptors = {}, name, names = $__getOwnPropertyNames(object);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    descriptors[name] = $__getOwnPropertyDescriptor(object, name);
  }
  return descriptors;
}, $__createClassNoExtends = function(object, staticObject) {
  var ctor = object.constructor;
  Object.defineProperty(object, 'constructor', {enumerable: false});
  ctor.prototype = object;
  Object.defineProperties(ctor, $__getDescriptors(staticObject));
  return ctor;
};
((function(window, document, undefined) {
  var mergeDefaults = function(obj) {
    Array.prototype.slice.call(arguments, 1).forEach(function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };
  var defaults = {
    duration: 2500,
    class: 'notification',
    parent: function() {
      return document.getElementById('mobile-notification-container');
    },
    type: 'success',
    tapToClose: false,
    show: true,
    destroyAfter: 500
  };
  var NotificationClass = function() {
    'use strict';
    var $NotificationClass = ($__createClassNoExtends)({
      constructor: function(text, options) {
        this.options = mergeDefaults(options || {}, defaults);
        this.updateDOM(text);
        this._setupEvents();
        if (this.options.show) {
          setTimeout((function() {
            this.show();
          }).bind(this), 1);
        }
      },
      updateDOM: function(text) {
        var textNode = document.createTextNode((text && typeof text !== 'object') ? text: '');
        var el = this.el = document.createElement('div');
        var parent = this.parent = typeof this.options.parent === 'function' ? this.options.parent(): this.options.parent;
        el.appendChild(textNode);
        el.classList.add(this.options.class, this.options.type);
        parent.appendChild(this.el);
      },
      show: function() {
        this.el.classList.add('show');
        if (!this.options.tapToClose) setTimeout((function() {
          this.hide();
        }).bind(this), this.options.duration);
        return this;
      },
      hide: function() {
        this.el.classList.remove('show');
        setTimeout((function() {
          this.destroy();
        }).bind(this), this.options.destroyAfter);
        return this;
      },
      destroy: function() {
        this._destroyEvents();
        this.parent.removeChild(this.el);
      },
      _setupEvents: function() {
        this.onTouch = (function() {
          this.hide();
        }).bind(this);
        if (this.options.tapToClose) this.el.addEventListener('touchstart', this.onTouch);
        return this;
      },
      _destroyEvents: function() {
        this.el.removeEventListener('touchstart', this.onTouch);
        return this;
      }
    }, {});
    return $NotificationClass;
  }();
  document.addEventListener("DOMContentLoaded", function() {
    var container = document.createElement('div');
    container.id = 'mobile-notification-container';
    document.body.appendChild(container);
  });
  window.Notification = (function(text, options) {
    return new NotificationClass(text, options);
  });
}))(window, document);
