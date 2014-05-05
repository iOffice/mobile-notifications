((window, document, undefined) => {
  // Underscore implementation of _.defaults
  // https://github.com/jashkenas/underscore/blob/master/underscore.js#L863
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
    /**
     * Duration to show the notification
     */
    duration: 2500,
    /**
     * Class to add to the generated markup
     */
    class: 'notification',
    /**
     * Parent element to attach notification to
     * @returns {*|HTMLElement}
     */
    parent: function() {
      return document.getElementById('mobile-notification-container');
    },
    /**
     * Type of notification
     * This is the class name that is attached to the element upon creation
     * Intended to be used to control visual clues as to what type of notification
     * is shown.
     */
    type: 'success',
    /**
     * If true notification can be hidden on tap/click
     */
    tapToClose: false,
    /**
     * If true notification is shown immediatley
     */
    show: true,
    /**
     * Duration to delay the destruction of the DOM element created for the notification
     * If you animation is longer than the default increase this time accordingly
     */
    destroyAfter: 500
  };

  /**
   * Simple notification alert meant to be used with PhoneGap apps
   * @param text Text content of the notification
   * @param options Notification Options
   * @constructor
   */

  class NotificationClass {
    constructor(text, options) {
      this.options = mergeDefaults(options || {}, defaults);

      this.updateDOM(text);

      this._setupEvents();

      if (this.options.show) {
        // For iOS we need to wait for the current stack to clear
        // or the initial animation will not run
        setTimeout(() => {
          this.show();
        }, 1);
      }
    }

    updateDOM(text) {
      var textNode = document.createTextNode((text && typeof text !== 'object') ? text : '');
      var el = this.el = document.createElement('div');
      var parent = this.parent = typeof this.options.parent === 'function' ? this.options.parent() : this.options.parent;

      el.appendChild(textNode);
      el.classList.add(this.options.class, this.options.type);
      parent.appendChild(this.el);
    }

    /**
     * Show the notification manually
     * @returns {Notification}
     */
    show() {
      this.el.classList.add('show');

      if (!this.options.tapToClose) setTimeout(() => {
        this.hide();
      }, this.options.duration);

      return this;
    }

    /**
     * Hide the notification manually
     * @returns {Notification}
     */
    hide() {
      this.el.classList.remove('show');

      setTimeout(() => {
        this.destroy();
      }, this.options.destroyAfter);

      return this;
    }

    /**
     * Destroy and remove all attached events manually
     */
    destroy() {
      this._destroyEvents();

      this.parent.removeChild(this.el);
    }

    /**
     * Setup and attach events to the notification
     * @returns {Notification}
     * @private
     */
    _setupEvents() {
      this.onTouch = () => {
        this.hide();
      };

      if (this.options.tapToClose) this.el.addEventListener('touchstart', this.onTouch);

      return this;
    }

    /**
     * Remove attached events from the notification
     * @returns {Notification}
     * @private
     */
    _destroyEvents() {
      this.el.removeEventListener('touchstart', this.onTouch);

      return this;
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    var container = document.createElement('div');
    container.id = 'mobile-notification-container';

    document.body.appendChild(container);
  });

  window.Notification = (text, options) => {
    return new NotificationClass(text, options);
  };

})(window, document);