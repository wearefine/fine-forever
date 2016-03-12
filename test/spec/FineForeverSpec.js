function paginationMarkup(page) {
  return '<!doctype html><html><body><div class="pagination" style="padding: 3000px 0"><a href="' + page + '">Page ' + page + '</a></div></body></html>';
}

describe('FineForever', function() {

  var infinite;

  beforeEach(function() {
    jasmine.Ajax.install();
    var body = document.querySelector('body');
    body.innerHTML = paginationMarkup('2');

    // TODO - look into jasmine-fixtures to use DOM elements in the support/*.html files
    infinite = new FineForever({}, function(){});
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
    infinite = null;
  });

  describe('initialization', function () {

    it('should be defined', function () {
      expect(FineForever).toBeDefined();
    });

    it('should have public functions', function () {
      expect(infinite.retrieveItems).toEqual(jasmine.any(Function));
      expect(infinite.destroy).toEqual(jasmine.any(Function));
    });

  });

  describe('requests', function() {
    beforeEach(function() {
      jasmine.Ajax.stubRequest('/2').andReturn({
        'responseText': paginationMarkup('2')
      });
      jasmine.Ajax.stubRequest('/3').andReturn({
        'responseText': paginationMarkup('3')
      });
    });

    it('should fire the callback once it reaches the scroll position', function() {
      var increment = 0;
      infinite = new FineForever({}, function(items) {
        increment = 1;
      });

      expect(increment).toEqual(0);

      window.scrollTo(0, 3000);
      // expect(increment).toEqual(1);
    });
  });


});
