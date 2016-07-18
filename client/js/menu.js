//Modified from http://callmenick.com/post/slide-and-push-menus-with-css3-transitions

(function(window) {

  'use strict';

  /**
   * Menu Constructor.
   */
  function Menu() {
    this._init();
  }

  /**
   * Initialize Menu.
   */
  Menu.prototype._init = function() {
    this.body = document.body;
    this.wrapper = document.querySelector('#wrapper');
    this.mask = document.querySelector('#mask');
    this.menu = document.querySelector('#menu');
    this.closeBtn = document.querySelector('#closeButton');
    this.openBtn = document.querySelector('#openButton');
    this._initEvents();
  };

  /**
   * Initialize Menu Events.
   */
  Menu.prototype._initEvents = function() {
    // Event for clicks on the close button inside the menu.
    this.closeBtn.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));

    // Event for clicks on the mask.
    this.mask.addEventListener('click', function(e) {
      e.preventDefault();
      this.close();
    }.bind(this));
  };

  /**
   * Open Menu.
   */
  Menu.prototype.open = function() {
    this.body.classList.add('has-active-menu');
    this.wrapper.classList.add('has-menu');
    this.menu.classList.add('is-active');
    this.mask.classList.add('is-active');
    this.disableOpenBtns();
  };

  /**
   * Close Menu.
   */
  Menu.prototype.close = function() {
    this.body.classList.remove('has-active-menu');
    this.wrapper.classList.remove('has-menu');
    this.menu.classList.remove('is-active');
    this.mask.classList.remove('is-active');
    this.enableOpenBtns();
  };

  /**
   * Disable Menu Openers.
   */
  Menu.prototype.disableOpenBtns = function() {
      this.openBtn.disabled = true;
  };

  /**
   * Enable Menu Openers.
   */
  Menu.prototype.enableOpenBtns = function() {
      this.openBtn.disabled = false;
  };

  /**
   * Add to global namespace.
   */
  window.Menu = Menu;

})(window);