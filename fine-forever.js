/**
 * A vanilla JS infinite scroll function
 * @author Tim Shedor
 */

'use strict';

/**
 * The fineForever global initialization
 * @class
 */
function fineForever(settings, callback) {
  /** @lends fineForever.prototype */
  return this.init(settings, callback);
}

(function () {

  var defaults = {
    navSelector: '.pagination',
    nextSelector: 'a:first-child',
    itemSelector: '.item',
    offset: 500,
    loadingHTML: null
  };


  /**
   * Once the page starts moving, track to see if we've reached our callback
   * @private
   */
  function onScroll() {
    var scroll_top = window.pageYOffset || document.documentElement.scrollTop;

    // If we've passed the element_position (with offset)
    if(scroll_top >= this.element_position) {
      var url = this.findNextUrl();

      // If url is not false and we're not already retrieving something
      if(url && !this.is_retrieving) {
        this.retrieveItems(url);
      }
    }
  }

  /**
   * Initialize infinite listener
   * @param {Object} [settings={}] - hash of options
   * @param {Function} callback - triggered when reached the offset above the navSelector
   *   @param {NodeList} JS elements that are loaded in
   * @returns {fineForever}
   */
  fineForever.prototype.init = function(settings, callback) {
    this.is_retrieving = false;
    this.callback = callback;

    // Loop through default params
    for(var i = 0; i < Object.keys(defaults).length; i++) {
      var key = Object.keys(defaults)[i];

      // If settings does not have the default key, apply it
      if(!settings.hasOwnProperty(Object.keys(defaults)[i])) {
        settings[key] = defaults[key];
      }
    }
    this.settings = settings;

    this.setNav();

    // this.onScroll.bind(this) !== this.onScroll.bind(this)
    // I don't know why this is, and would like to, but for now, we're going to bind this func once and put it in an instance variable
    this.scrollEventCallback = onScroll.bind(this);

    window.addEventListener('scroll', this.scrollEventCallback);

    this.addLoadingHtml();

    return this;
  };

  /**
   * Based on the pagination selector, find next URL and adjust settings
   * @protected
   * @returns {String|Boolean} the next url or false if there is none
   */
  fineForever.prototype.findNextUrl = function() {
    var url = this.nav.querySelector( this.settings.nextSelector );

    // If next selector is found
    if(!!url) {
      return url.getAttribute('href');
    } else {
      return false;
    }
  };

  /**
   * Reset nav selector
   * @protected
   * @sets this.nav
   * @sets this.element_position
   */
  fineForever.prototype.setNav = function() {
    this.nav = document.querySelector(this.settings.navSelector);

    // Abort if nav item can't be found
    if(!this.nav) {
      return;
    }

    // Determine the top position of the element then subtract the offset
    var element_position = (this.nav.offsetTop - this.nav.scrollTop + this.nav.clientTop) - this.settings.offset;

    this.element_position = element_position;
  };

  /**
   * Get new items via AJAX
   * @protected
   * @param {String} url
   */
  fineForever.prototype.retrieveItems = function(url) {
    var xhr = new XMLHttpRequest();
    var _this = this;
    this.is_retrieving = true;

    var loading_html = document.getElementById('fcinfinite-loading');
    loading_html.style.display = 'block';

    xhr.onreadystatechange = function() {
      // Only move forward if we've got a clean response
      if (xhr.readyState !== 4 || xhr.status !== 200) {
        return;
      }

      // Create hidden div to find the desired elements
      var searchable_div = document.createElement('div');
      searchable_div.innerHTML = xhr.responseText;

      // Grab new nav selector
      var new_nav = searchable_div.querySelector(_this.settings.navSelector);

      // See if nav selector available in the second page
      if(new_nav && new_nav.innerHTML.length) {
        // If pagination present, replace markup and reset listeners
        _this.nav.innerHTML = new_nav.innerHTML;
        _this.setNav();

      } else {
        // If no pagination present, remove scroll listener and pagination node from DOM
        _this.destroy();

      }

      // Trigger user-defined callback with desired elements
      var elements = searchable_div.querySelectorAll( _this.settings.itemSelector );
      _this.callback( elements );

      // Hide whatever loading indicator or text
      loading_html.style.display = 'none';
      _this.is_retrieving = false;
    };

    xhr.open('GET', url, true);
    xhr.send();
  };

  /**
   * Add loading HTML if defined in the settings before the nav
   */
  fineForever.prototype.addLoadingHtml = function() {
    var loading_div = document.createElement('div');
    loading_div.id = 'fcinfinite-loading';

    if(this.settings.loadingHTML !== null) {
      loading_div.innerHTML = this.settings.loadingHTML;
    }

    // Insert immediately before pagination
    this.nav.parentNode.insertBefore(loading_div, this.nav);
  };

  /**
   * Remove fineForever instance
   */
  fineForever.prototype.destroy = function() {
    window.removeEventListener('scroll', this.scrollEventCallback);
    this.nav.remove();
    var loading_div = document.getElementById('fcinfinite-loading');

    if(loading_div) {
      loading_div.remove();
    }
  };

})();
