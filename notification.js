;
(function (window, document, undefined) {

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
    parent: function () {
      return document.body;
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

  function Notification(text, options) {
    if (!(this instanceof Notification)) return new Notification(text, options);

    (options = options || {});

    this.options = _.defaults(options, defaults);

    this.el = document.createElement('div');
    this.textNode = document.createTextNode((text && typeof text !== 'object') ? text : '');
    this.el.appendChild(this.textNode);

    this.el.classList.add(this.options.class, this.options.type);

    this.parent = typeof this.options.parent === 'function' ? this.options.parent() : this.options.parent;

    this.init();
  }

  Notification.prototype = {
    constructor: Notification,
    /**
     * Notification entry point
     */
    init: function () {
      this._bindAll();

      this._setupEvents();

      this.parent.appendChild(this.el);

      if (this.options.show) {
        this.show();
      }
    },

    /**
     * Show the notification manually
     * @returns {Notification}
     */
    show: function () {
      var self = this;

      requestAnimationFrame(function() {
        self.el.classList.add('show');
      });

      if (!this.options.tapToClose) {

        _.delay(this.hide, this.options.duration);
      }

      return this;
    },

    /**
     * Hide the notification manually
     * @returns {Notification}
     */
    hide: function () {
      var self = this;

      requestAnimationFrame(function() {
        self.el.classList.remove('show');
      });

      setTimeout(this.destroy, this.options.destroyAfter);

      return this;
    },

    /**
     * Destroy and remove all attached events manually
     */
    destroy: function () {
      this._destroyEvents();

      this.parent.removeChild(this.el);
    },

    /**
     * Bind all function to the notification object
     * @private
     */
    _bindAll: function () {
      var functions = _.functions(this);
      functions.unshift(this);

      _.bindAll.apply(_, functions);
    },

    /**
     * Setup and attach events to the notification
     * @returns {Notification}
     * @private
     */
    _setupEvents: function () {
      if (this.options.tapToClose) this.el.addEventListener('touchstart', this.hide);

      return this;
    },

    /**
     * Remove attached events from the notification
     * @returns {Notification}
     * @private
     */
    _destroyEvents: function () {
      this.el.removeEventListener('touchstart', this.hide);

      return this;
    }
  };

  window.Notification = Notification;

})(window, document);