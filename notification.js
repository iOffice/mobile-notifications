;
(function ($, window, document, undefined) {

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
     * Markup of the generated DOM element
     * Could be a compiled template if called for
     */
    markup: '<div></div>',
    /**
     * Parent element to attach notification to
     * @returns {*|HTMLElement}
     */
    parent: function () {
      return $('body');
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
    if (!(this instanceof Notification)) return new Notification((text, options));

    this.options = _.defaults(options, defaults);

    this.$el = $(this.options.markup, {
      class: this.options.class + ' ' + this.options.type,
      text: _.isUndefined('text') || _.isObject(text) ? '' : text
    });

    this.$parent = _.isFunction(this.options.parent) ? this.options.parent() : this.options.parent;

    this.init();
  }

  Notification.prototype = {
    constructor: Notification,
    /**
     * Notification entry point
     */
    init: function () {
      this._bindAll();

      this.$parent.append(this.$el);
      this._setupEvents();

      if (this.options.show) {
        _.defer(this.show);
      }
    },

    /**
     * Show the notification manually
     * @returns {Notification}
     */
    show: function () {
      this.$el.addClass('show');

      if (!this.options.tapToClose) _.delay(this.hide, this.options.duration);

      return this;
    },

    /**
     * Hide the notification manually
     * @returns {Notification}
     */
    hide: function () {
      this.$el.removeClass('show');

      _.delay(this.destroy, this.options.destroyAfter);

      return this;
    },

    /**
     * Destroy and remove all attached events manually
     */
    destroy: function () {
      this._destroyEvents();
      this.$el.remove();
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
      var action = this._clickOrTap();
      if (action === 'tap') this.$el.hammer();

      if (this.options.tapToClose) this.$el.on(action, this.hide);

      return this;
    },

    /**
     * Remove attached events from the notification
     * @returns {Notification}
     * @private
     */
    _destroyEvents: function () {
      this.$el.off(this._clickOrTap(), this.hide);

      return this;
    },

    /**
     * Determine if hammer.js is available to use the tap event
     * @returns {string}
     * @private
     */
    _clickOrTap: function () {
      return $.prototype.hammer ? 'tap' : 'click';
    }
  };

  window.Notification = Notification;

})(jQuery, window, document);